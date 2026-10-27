// Shared, dependency-free request validation; the server imports this at its boundary.
export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = new URL(process.env.APP_URL || request.url).origin;
  if (!origin || origin !== allowed || request.headers.get("sec-fetch-site") === "cross-site") throw new ApiError("This request must come from the association website.", 403);
}

export async function requestInput(request: Request): Promise<Record<string, unknown>> {
  assertSameOrigin(request);
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") throw new ApiError("Send a JSON request.", 415);
  if (Number(request.headers.get("content-length")) > 170_000) throw new ApiError("The request is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError("The request is empty.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 170_000) { await reader.cancel(); throw new ApiError("The request is too large.", 413); }
    chunks.push(value);
  }
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch { throw new ApiError("The request contains invalid JSON."); }
}
