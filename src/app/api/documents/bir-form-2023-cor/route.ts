import { readFile } from "node:fs/promises";
import path from "node:path";
import { backend, requireUser } from "@/lib/server/backend";
import { failure } from "@/lib/server/http";

export async function GET() {
  try {
    const client = await backend();
    await requireUser(client);

    const file = await readFile(path.join(process.cwd(), "private", "documents", "bir-form-2023-cor.pdf"));
    return new Response(file, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": 'inline; filename="BIR Form 2023 COR.pdf"',
        "Content-Type": "application/pdf",
      },
    });
  } catch (cause) {
    return failure(cause);
  }
}
