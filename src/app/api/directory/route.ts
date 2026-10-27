import { backend, rpcError } from "@/lib/server/backend";
import { failure, json } from "@/lib/server/http";
import type { DirectoryEntry } from "@/lib/alumni-directory";

export async function GET() {
  try {
    const client = await backend();
    const entries: DirectoryEntry[] = [];
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await client.rpc("alumni_directory").range(offset, offset + 499);
      rpcError(error);
      entries.push(...(data ?? []));
      if (!data || data.length < 500) break;
    }
    return json({ entries });
  } catch (cause) { return failure(cause); }
}
