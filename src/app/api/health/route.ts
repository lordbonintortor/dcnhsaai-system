import { backendConfig, signupClient } from "@/lib/server/backend";
import { json } from "@/lib/server/http";
import { usernameLookupClient } from "@/lib/server/username-auth";

export async function GET() {
  try {
    const { url, key } = backendConfig();
    const [database, auth, usernames, lookup] = await Promise.all([
      signupClient().rpc("alumni_directory").limit(1),
      fetch(`${url}/auth/v1/settings`, { headers: { apikey: key }, cache: "no-store", signal: AbortSignal.timeout(8000) }),
      signupClient().rpc("username_only_ready"),
      usernameLookupClient().from("account_usernames").select("user_id").limit(1),
    ]);
    if (database.error) {
      console.error("Database health check failed", { code: database.error.code || "request_failed" });
      return json({ status: "not_ready" }, 503);
    }
    if (!auth.ok) {
      console.error("Authentication health check failed", { status: auth.status });
      return json({ status: "not_ready" }, 503);
    }
    if ((await auth.json()).mailer_autoconfirm !== true) return json({ status: "not_ready" }, 503);
    if (usernames.error || usernames.data !== true || lookup.error) return json({ status: "not_ready" }, 503);
    return json({ status: "ok" });
  } catch (cause) {
    const errorCode = cause instanceof Error && cause.cause && typeof cause.cause === "object" && "code" in cause.cause ? cause.cause.code : undefined;
    console.error("Backend health check failed", { name: cause instanceof Error ? cause.name : "unknown", code: errorCode });
    return json({ status: "not_ready" }, 503);
  }
}
