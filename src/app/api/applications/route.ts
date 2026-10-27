import { ApiError, backend, profilesFor, requireOfficer, rpcError } from "@/lib/server/backend";
import { failure, input, json } from "@/lib/server/http";

export async function GET() {
  try {
    const client = await backend();
    await requireOfficer(client);
    return json({ applications: await profilesFor(client) });
  } catch (cause) { return failure(cause); }
}

export async function POST(request: Request) {
  try {
    const body = await input(request);
    const client = await backend();
    await requireOfficer(client);
    if (typeof body.id !== "string" || !/^[\da-f-]{36}$/i.test(body.id) || !Number.isInteger(body.version)) throw new ApiError("Reopen the application before reviewing it.");
    if (!["verified", "needs_information", "rejected"].includes(String(body.status))) throw new ApiError("Choose a valid decision.");
    if (body.message !== undefined && typeof body.message !== "string") throw new ApiError("Enter a valid message.");
    rpcError((await client.rpc("review_alumni_application", { p_applicant_id: body.id, p_expected_version: body.version, p_status: body.status, p_message: body.message ?? "" })).error);
    return json({ ok: true });
  } catch (cause) { return failure(cause); }
}
