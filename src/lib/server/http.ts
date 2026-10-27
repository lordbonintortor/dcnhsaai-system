import "server-only";
import { ApiError } from "./backend";
export { requestInput as input } from "../request-validation";

export const privateHeaders = { "Cache-Control": "private, no-store, max-age=0", "Vary": "Cookie", "X-Content-Type-Options": "nosniff" };

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: privateHeaders });
}

export function failure(cause: unknown) {
  if (cause instanceof ApiError) return json({ error: cause.message }, cause.status);
  return json({ error: "The service is temporarily unavailable. Please try again." }, 503);
}

