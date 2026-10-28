import { cookies } from "next/headers";
import { ApiError, backend, backendConfig, detailsInput, officerFor, photoInput, profilesFor, requireOfficer, requireUser, rpcError, signupClient, uploadPhoto } from "@/lib/server/backend";
import { failure, input, json } from "@/lib/server/http";
import { normalizedUsername, USERNAME_HELP, usernameAuthEmail } from "@/lib/username";
import { adminAuthClient, usernameAccount, usernameCredentials, temporaryPassword } from "@/lib/server/username-auth";

export const runtime = "nodejs";
type Context = { params: Promise<{ action: string }> };

export async function GET(_request: Request, { params }: Context) {
  try {
    if ((await params).action !== "session") return json({ error: "Not found" }, 404);
    const client = await backend();
    const { data, error } = await client.auth.getUser();
    if (!data.user) {
      if (error && error.name !== "AuthSessionMissingError" && error.status !== 401 && error.status !== 403) throw new ApiError("Unable to check your session. Please try again.", 503);
      return json({ profile: null, officer: null });
    }
    const [profiles, officer] = await Promise.all([profilesFor(client, data.user.id), officerFor(client, data.user.id)]);
    return json({ profile: profiles[0] ?? null, officer, mustChangePassword: data.user.user_metadata?.forcePasswordChange === true });
  } catch (cause) { return failure(cause); }
}

export async function POST(request: Request, { params }: Context) {
  try {
    const { action } = await params;
    const body = await input(request);
    if (action === "register") {
      const details = detailsInput(body.details);
      const username = normalizedUsername(body.username);
      if (!username) throw new ApiError(USERNAME_HELP);
      if (body.consent !== true) throw new ApiError("Confirm your graduation declaration and consent.");
      if (typeof body.password !== "string" || body.password.length < 8 || body.password.length > 128) throw new ApiError("Use a password with 8–128 characters.");
      const photo = photoInput((body.details as Record<string, unknown>).photoDataUrl ?? "");
      // Fail before creating accounts if the project would send confirmation emails.
      const { url, key } = backendConfig();
      const settingsResponse = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key }, cache: "no-store", signal: AbortSignal.timeout(8000) });
      if (!settingsResponse.ok || (await settingsResponse.json()).mailer_autoconfirm !== true) throw new ApiError("Registration is awaiting the association’s account-service setup. Please try again later.", 503);
      const client = signupClient();
      const readiness = await client.rpc("username_only_ready");
      if (readiness.error || readiness.data !== true) throw new ApiError("Username registration needs the latest database update. Please contact the association.", 503);
      if (await usernameAccount(username)) throw new ApiError("This username is already taken. Choose another, or sign in if it is yours.", 409);
      const email = usernameAuthEmail(username);
      const alumni = { ...details } as Partial<typeof details>;
      delete alumni.photoDataUrl;
      const { data, error } = await client.auth.signUp({ email, password: body.password, options: { data: { alumni, username, graduateConsent: true } } });
      if (error) {
        if (error.status === 429) throw new ApiError("Too many attempts. Please wait before trying again.", 429);
        if (error.code === "user_already_exists" || error.code === "email_exists") throw new ApiError("This username is already taken. Choose another, or sign in if it is yours.", 409);
        throw new ApiError("Your account could not be created. Check your details or contact the association.", 400);
      }
      if (!data.user || !data.session) throw new ApiError("Your account needs assistance. Please contact the association before registering again.", 503);
      // The signup trigger has copied these fields into protected profile storage.
      // Clear the temporary metadata so future access tokens do not carry the form.
      await client.auth.updateUser({ data: { alumni: null, username: null, graduateConsent: null } });
      let warning = "";
      if (photo) {
        let path: string | null = null;
        try {
          path = await uploadPhoto(client, data.user.id, photo);
          const { error: saveError } = await client.rpc("save_alumni_profile", { p_details: alumni, p_expected_version: 1, p_change_photo: true, p_photo_path: path });
          rpcError(saveError);
        } catch {
          if (path) await client.storage.from("alumni-photos").remove([path]);
          warning = "Your account was created, but your photo could not be saved. Sign in to add it from My profile.";
        }
      }
      // Registration does not replace any existing session or automatically sign in.
      await client.auth.signOut({ scope: "local" });
      return json({ profile: { ...details, username, id: data.user.id, createdAt: data.user.created_at, verification: "pending" }, warning }, 201);
    }
    if (action === "login") {
      const username = normalizedUsername(body.username);
      if (!username || typeof body.password !== "string" || !body.password || body.password.length > 128) throw new ApiError("Enter your username and password.");
      const credentials = await usernameCredentials(username);
      if (!credentials) throw new ApiError("The username or password is incorrect.", 401);
      const remember = body.remember === true;
      const client = await backend(remember);
      const { data, error } = await client.auth.signInWithPassword({ email: credentials.email, password: body.password });
      if (error || !data.user) throw new ApiError(error?.status === 429 ? "Too many sign-in attempts. Please try again later." : "The username or password is incorrect.", error?.status === 429 ? 429 : 401);
      if (data.user.id !== credentials.userId) {
        await client.auth.signOut({ scope: "local" });
        throw new ApiError("The username or password is incorrect.", 401);
      }
      const officer = await officerFor(client, data.user.id);
      const { data: profile, error: profileError } = await client.from("alumni_profiles").select("id").eq("id", data.user.id).maybeSingle();
      if (profileError) { await client.auth.signOut({ scope: "local" }); throw new ApiError("Unable to load your account. Please try again.", 503); }
      if ((body.officer === true && !officer) || (body.officer !== true && !profile)) {
        await client.auth.signOut({ scope: "local" });
        throw new ApiError(body.officer === true ? "This account does not have officer access." : "Use the officer sign-in page for this account.", 403);
      }
      (await cookies()).set("dcnhsaai.remember", remember ? "yes" : "no", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}) });
      return json({ ok: true, mustChangePassword: data.user.user_metadata?.forcePasswordChange === true });
    }
    if (action === "logout") {
      const client = await backend();
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) throw new ApiError("Unable to sign out. Please try again.", 503);
      (await cookies()).delete("dcnhsaai.remember");
      return json({ ok: true });
    }
    if (action === "resubmit") {
      const client = await backend();
      await requireUser(client);
      rpcError((await client.rpc("resubmit_alumni_application")).error);
      return json({ ok: true });
    }
    if (action === "change-password") {
      const client = await backend();
      await requireUser(client);
      if (typeof body.password !== "string" || body.password.length < 8 || body.password.length > 128) throw new ApiError("Use a password with 8–128 characters.");
      const { error } = await client.auth.updateUser({ password: body.password, data: { forcePasswordChange: false } });
      if (error) throw new ApiError("Your password could not be changed. Please try again.", 503);
      return json({ ok: true });
    }
    if (action === "reset-password") {
      const client = await backend();
      await requireOfficer(client);
      if (typeof body.userId !== "string" || !body.userId) throw new ApiError("Choose an account first.");
      const admin = adminAuthClient();
      const password = temporaryPassword();
      const { error } = await admin.auth.admin.updateUserById(body.userId, { password, user_metadata: { forcePasswordChange: true } });
      if (error) throw new ApiError("The temporary password could not be issued. Please try again.", 503);
      return json({ temporaryPassword: password });
    }
    return json({ error: "Not found" }, 404);
  } catch (cause) { return failure(cause); }
}
