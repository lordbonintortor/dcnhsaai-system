import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { AlumniProfile, ProfileDetails } from "../alumni-profile";
import { normalizeProfile, profileError } from "../alumni-profile";
import { isProfilePhoto } from "../profile-photo";
import type { ApplicationReview } from "../application-review";
import { ApiError } from "../request-validation";
import { normalizedPhoto } from "./photo";
export { ApiError } from "../request-validation";

export function backendConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new ApiError("The account service is not configured yet. Please contact the association.", 503);
  return { url, key };
}

// Account operations use the signed-in user and remain subject to row-level security.
export async function backend(remember?: boolean) {
  const { url, key } = backendConfig();
  const store = await cookies();
  const persistent = remember ?? store.get("dcnhsaai.remember")?.value === "yes";
  return createServerClient(url, key, {
    cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 },
    cookies: {
      getAll: () => store.getAll(),
      setAll: values => {
        for (const { name, value, options } of values) {
          const removing = options.maxAge === 0;
          store.set(name, value, { ...options, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", ...(!persistent && !removing ? { maxAge: undefined, expires: undefined } : {}) });
        }
      },
    },
  });
}

export function signupClient() {
  const { url, key } = backendConfig();
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}

export async function requireUser(client: SupabaseClient) {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new ApiError("Please sign in to continue.", 401);
  return data.user;
}

export async function officerFor(client: SupabaseClient, userId: string) {
  const { data, error } = await client.from("officers").select("display_name").eq("user_id", userId).maybeSingle();
  if (error) throw new ApiError("Unable to check officer access. Please try again.", 503);
  return data ? { name: data.display_name as string } : null;
}

export async function requireOfficer(client: SupabaseClient) {
  const user = await requireUser(client);
  const officer = await officerFor(client, user.id);
  if (!officer) throw new ApiError("Officer access is required.", 403);
  return officer;
}

export function detailsInput(input: unknown): ProfileDetails {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new ApiError("Enter your alumni information.");
  const raw = input as Record<string, unknown>;
  const fields = ["batchYear", "section", "adviser", "firstName", "middleName", "lastName", "mobile", "otherProfession", "employers"];
  for (const field of fields) {
    if (typeof raw[field] !== "string" || raw[field].length > (field === "employers" ? 2000 : 200)) throw new ApiError("Check your alumni information. A field is missing or too long.");
  }
  if (!Array.isArray(raw.professions) || raw.professions.length > 8 || !raw.professions.every(value => typeof value === "string")) throw new ApiError("Select a valid profession.");
  // Photos have separate validation; signed display URLs are never accepted as uploads.
  const details = normalizeProfile({ ...raw, photoDataUrl: "" } as ProfileDetails);
  const error = profileError(details);
  if (error) throw new ApiError(error);
  return details;
}

export function photoInput(value: unknown) {
  if (!isProfilePhoto(value)) throw new ApiError("Choose a valid profile photo.");
  if (!value) return null;
  const bytes = Buffer.from(value.split(",")[1], "base64");
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes.at(-2) !== 0xff || bytes.at(-1) !== 0xd9) throw new ApiError("Choose a valid JPEG profile photo.");
  return bytes;
}

export async function uploadPhoto(client: SupabaseClient, userId: string, bytes: Buffer) {
  let image: Buffer;
  try { image = await normalizedPhoto(bytes); }
  catch { throw new ApiError("This photo could not be processed. Please choose another JPEG photo."); }
  const path = `${userId}/${crypto.randomUUID()}.jpg`;
  const { error } = await client.storage.from("alumni-photos").upload(path, image, { contentType: "image/jpeg", upsert: false });
  if (error) throw new ApiError("The profile photo could not be uploaded. Please try again.", 503);
  return path;
}

export async function signedPhoto(client: SupabaseClient, path: string | null) {
  if (!path) return "";
  const { data, error } = await client.storage.from("alumni-photos").createSignedUrl(path, 600);
  if (error) throw new ApiError("The profile photo could not be loaded. Please try again.", 503);
  return data.signedUrl;
}

type ProfileRow = {
  id: string; username: string | null; details: Omit<ProfileDetails, "photoDataUrl">;
  verification: AlumniProfile["verification"]; created_at: string; updated_at: string;
  version: number; photo_path: string | null;
};
type ReviewRow = {
  id: string; applicant_id: string; status: ApplicationReview["status"];
  actor: ApplicationReview["actor"]; reviewer: string; message: string; reviewed_at: string;
};
export const PROFILE_COLUMNS = "id,username,details,verification,created_at,updated_at,version,photo_path";
const REVIEW_COLUMNS = "id,applicant_id,status,actor,reviewer,message,reviewed_at";

export async function profilesFor(client: SupabaseClient, id?: string): Promise<AlumniProfile[]> {
  const rows: ProfileRow[] = [];
  // Read explicit pages; PostgREST's default row limit must not hide applications.
  for (let offset = 0; ; offset += 500) {
    let query = client.from("alumni_profiles").select(PROFILE_COLUMNS).order("created_at").order("id").range(offset, offset + 499);
    if (id) query = query.eq("id", id);
    const { data, error } = await query;
    if (error) throw new ApiError("Unable to load alumni records. Please try again.", 503);
    rows.push(...(data ?? []) as ProfileRow[]);
    if (!data || data.length < 500) break;
  }
  if (!rows.length) return [];
  const history: ReviewRow[] = [];
  // Small ID batches keep filter URLs within proxy limits, including larger queues.
  for (let start = 0; start < rows.length; start += 100) {
    const ids = rows.slice(start, start + 100).map(row => row.id);
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await client.from("application_reviews").select(REVIEW_COLUMNS).in("applicant_id", ids).order("reviewed_at").order("id").range(offset, offset + 499);
      if (error) throw new ApiError("Unable to load application history. Please try again.", 503);
      history.push(...(data ?? []) as ReviewRow[]);
      if (!data || data.length < 500) break;
    }
  }
  const photos = new Map<string, string>();
  const paths = rows.flatMap(row => row.photo_path ? [row.photo_path] : []);
  if (paths.length) {
    const { data, error } = await client.storage.from("alumni-photos").createSignedUrls(paths, 600);
    if (error || !data || data.some(photo => !photo.signedUrl)) throw new ApiError("Unable to load profile photos. Please try again.", 503);
    for (const photo of data) if (photo.path && photo.signedUrl) photos.set(photo.path, photo.signedUrl);
  }
  return rows.map(row => ({
    ...row.details, username: row.username, id: row.id, verification: row.verification,
    createdAt: row.created_at, updatedAt: row.updated_at, version: row.version,
    photoDataUrl: row.photo_path ? photos.get(row.photo_path) ?? "" : "",
    reviewHistory: history.filter(entry => entry.applicant_id === row.id).map(entry => ({
      id: entry.id, status: entry.status, actor: entry.actor, reviewer: entry.reviewer,
      message: entry.message, reviewedAt: entry.reviewed_at,
    })),
  }));
}

export function rpcError(error: { message: string; code?: string } | null) {
  if (!error) return;
  // Only our intentional database exceptions are suitable for applicants.
  if (error.code === "P0001") throw new ApiError(error.message, /changed|already has/.test(error.message) ? 409 : 400);
  throw new ApiError("The change could not be saved. Please try again.", 503);
}
