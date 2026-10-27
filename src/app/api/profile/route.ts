import { ApiError, backend, detailsInput, photoInput, profilesFor, requireUser, rpcError, uploadPhoto } from "@/lib/server/backend";
import { failure, input, json } from "@/lib/server/http";

export async function PATCH(request: Request) {
  let uploaded: string | null = null;
  const client = await backend().catch(() => null);
  try {
    const body = await input(request);
    if (!client) throw new ApiError("The account service is unavailable.", 503);
    const user = await requireUser(client);
    const current = (await profilesFor(client, user.id))[0];
    if (!current) throw new ApiError("An alumni account is required.", 403);
    const details = detailsInput(body.details);
    if (!Number.isInteger(body.version)) throw new ApiError("Reload your profile before saving.");
    const changePhoto = Object.hasOwn(body, "photo");
    const photo = changePhoto ? photoInput(body.photo) : null;
    if (photo) uploaded = await uploadPhoto(client, user.id, photo);
    const { data: previous } = await client.from("alumni_profiles").select("photo_path").eq("id", user.id).single();
    rpcError((await client.rpc("save_alumni_profile", { p_details: details, p_expected_version: body.version, p_change_photo: changePhoto, p_photo_path: uploaded })).error);
    uploaded = null; // The new photo now belongs to the saved record.
    if (changePhoto && previous?.photo_path) await client.storage.from("alumni-photos").remove([previous.photo_path]);
    return json({ profile: (await profilesFor(client, user.id))[0] });
  } catch (cause) {
    if (uploaded && client) await client.storage.from("alumni-photos").remove([uploaded]);
    return failure(cause);
  }
}
