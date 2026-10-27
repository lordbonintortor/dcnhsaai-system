import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { ApiError, assertSameOrigin, requestInput } from "../src/lib/request-validation.ts";

const origin = "https://alumni.example.com";
let previousUrl;
before(() => { previousUrl = process.env.APP_URL; process.env.APP_URL = origin; });
after(() => { if (previousUrl === undefined) delete process.env.APP_URL; else process.env.APP_URL = previousUrl; });
function request(body = "{}", headers = {}) {
  return new Request(`${origin}/api/account/login`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", ...headers }, body });
}
const hasStatus = status => cause => cause instanceof ApiError && cause.status === status;

test("mutations require the configured website origin", () => {
  assert.doesNotThrow(() => assertSameOrigin(request()));
  assert.throws(() => assertSameOrigin(request("{}", { Origin: "https://attacker.example.com" })), hasStatus(403));
  assert.throws(() => assertSameOrigin(request("{}", { Origin: "" })), hasStatus(403));
  assert.throws(() => assertSameOrigin(request("{}", { Origin: "null" })), hasStatus(403));
  assert.throws(() => assertSameOrigin(request("{}", { "sec-fetch-site": "cross-site" })), hasStatus(403));
});

test("valid JSON objects are accepted and passwords stay literal", async () => {
  const body = { email: "test@example.com", password: "<script>literal</script>" };
  assert.deepEqual(await requestInput(request(JSON.stringify(body))), body);
});

test("form and text payloads are rejected before account mutations", async () => {
  for (const type of ["text/plain", "application/x-www-form-urlencoded", "multipart/form-data"]) await assert.rejects(requestInput(request("{}", { "Content-Type": type })), hasStatus(415));
});

test("malformed JSON, arrays, and null cannot masquerade as an account form", async () => {
  for (const value of ["{", "null", "[]", '"text"', "false"]) await assert.rejects(requestInput(request(value)), hasStatus(400));
});

test("large declared bodies are rejected before reading", async () => {
  await assert.rejects(requestInput(request("{}", { "Content-Length": "170001" })), hasStatus(413));
});

test("streamed bodies cannot bypass the size limit by omitting Content-Length", async () => {
  const body = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(100_000)); controller.enqueue(new Uint8Array(100_000)); controller.close(); } });
  const streamed = new Request(`${origin}/api/profile`, { method: "PATCH", headers: { Origin: origin, "Content-Type": "application/json" }, body, duplex: "half" });
  await assert.rejects(requestInput(streamed), hasStatus(413));
});
