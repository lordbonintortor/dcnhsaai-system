import "server-only";
import { createClient } from "@supabase/supabase-js";
import { ApiError } from "../request-validation";
import { backendConfig } from "./backend";

// This isolated client only resolves usernames. Profile/review/storage operations
// must continue using the user's RLS-protected client, never this privileged client.
export function usernameLookupClient() {
  const { url } = backendConfig();
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new ApiError("Username sign-in is awaiting the server account setup.", 503);
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}

export async function usernameAccount(username: string) {
  const client = usernameLookupClient();
  const { data, error } = await client.from("account_usernames").select("user_id").eq("username", username).maybeSingle();
  if (error) throw new ApiError("Unable to check your account. Please try again later.", 503);
  return data as { user_id: string } | null;
}

export async function usernameCredentials(username: string) {
  const account = await usernameAccount(username);
  if (!account) return null;
  const { data, error } = await usernameLookupClient().auth.admin.getUserById(account.user_id);
  if (error || !data.user?.email) throw new ApiError("Unable to check your account. Please try again later.", 503);
  // Existing Auth identities/passwords stay intact. This address never leaves the server.
  return { userId: account.user_id, email: data.user.email };
}

export function adminAuthClient() {
  return usernameLookupClient();
}

export function temporaryPassword() {
  return `Dcn${crypto.randomUUID().replaceAll("-", "").slice(0, 18)}!`;
}
