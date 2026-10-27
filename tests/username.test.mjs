import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizedUsername, usernameAuthEmail } from "../src/lib/username.ts";

test("username sign-in is case insensitive and produces a stable internal identifier", () => {
  assert.equal(normalizedUsername(" Jamie_2015 "), "jamie_2015");
  assert.equal(usernameAuthEmail(" JAMIE_2015 "), usernameAuthEmail("jamie_2015"));
});

test("invalid usernames cannot alias another identity or inject an address", () => {
  for (const input of [null, {}, "ab", "9jamie", "a b", "a+b", "álex", "alex@example.com", "a".repeat(31)]) {
    assert.equal(normalizedUsername(input), null);
  }
  assert.throws(() => usernameAuthEmail("alex@example.com"), /Invalid/);
  assert.equal(normalizedUsername("a@@example.com"), null);
});
