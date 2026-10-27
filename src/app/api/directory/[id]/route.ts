import { ApiError, backend, requireUser, rpcError, signedPhoto } from "@/lib/server/backend";
import { failure, json } from "@/lib/server/http";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const client = await backend();
    await requireUser(client);
    const { id } = await params;
    if (!/^[\da-f-]{36}$/i.test(id)) throw new ApiError("Profile not found.", 404);
    const { data, error } = await client.rpc("alumni_member_profile", { p_id: id });
    rpcError(error);
    const row = data?.[0];
    if (!row) return json({ profile: null });
    return json({ profile: {
      id: row.id, name: `${row.firstName} ${row.lastName}`, firstName: row.firstName,
      lastName: row.lastName, batchYear: row.batchYear,
      profession: row.professions.map((value: string) => value === "Other" ? row.otherProfession : value).join(", "),
      photoDataUrl: await signedPhoto(client, row.photo_path),
    } });
  } catch (cause) { return failure(cause); }
}
