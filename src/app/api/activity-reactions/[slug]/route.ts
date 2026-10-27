import { backend, requireUser } from "@/lib/server/backend";
import { failure, input, json } from "@/lib/server/http";

function validSlug(slug: string) {
  return /^[a-z0-9-]{1,80}$/.test(slug);
}

async function reactionState(client: Awaited<ReturnType<typeof backend>>, slug: string, userId?: string) {
  const { count, error } = await client.from("activity_reactions").select("user_id", { count: "exact", head: true }).eq("activity_slug", slug);
  if (error) throw error;
  let liked = false;
  if (userId) {
    const { data, error: userError } = await client.from("activity_reactions").select("user_id").eq("activity_slug", slug).eq("user_id", userId).maybeSingle();
    if (userError) throw userError;
    liked = Boolean(data);
  }
  return { count: count ?? 0, liked };
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!validSlug(slug)) return json({ error: "Invalid activity." }, 400);
    const client = await backend();
    const { data } = await client.auth.getUser();
    return json(await reactionState(client, slug, data.user?.id));
  } catch (cause) {
    return failure(cause);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!validSlug(slug)) return json({ error: "Invalid activity." }, 400);
    const client = await backend();
    const user = await requireUser(client);
    const body = await input(request);
    if (body.reaction !== "like") return json({ error: "Unsupported reaction." }, 400);
    const existing = await client.from("activity_reactions").select("user_id").eq("activity_slug", slug).eq("user_id", user.id).maybeSingle();
    if (existing.error) throw existing.error;
    if (existing.data) {
      const { error } = await client.from("activity_reactions").delete().eq("activity_slug", slug).eq("user_id", user.id);
      if (error) throw error;
    } else {
      const { error } = await client.from("activity_reactions").insert({ activity_slug: slug, user_id: user.id, reaction: "like" });
      if (error) throw error;
    }
    return json(await reactionState(client, slug, user.id));
  } catch (cause) {
    return failure(cause);
  }
}
