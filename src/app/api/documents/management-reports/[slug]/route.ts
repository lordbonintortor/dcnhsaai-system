import { readFile } from "node:fs/promises";
import path from "node:path";
import { backend, requireOfficer } from "@/lib/server/backend";
import { failure } from "@/lib/server/http";

const reports = {
  "2025-financial-report-dcnhsaai": {
    filename: "2025-financial-report-dcnhsaai.pdf",
    downloadName: "2025 Financial Report DCNHSAAI.pdf",
  },
  "5-year-financials-2021-2025": {
    filename: "5-year-financials-2021-2025.pdf",
    downloadName: "5-Year Financials 2021-2025.pdf",
  },
} as const;

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const report = reports[slug as keyof typeof reports];
    if (!report) return new Response("Not found", { status: 404 });

    const client = await backend();
    await requireOfficer(client);
    const file = await readFile(path.join(process.cwd(), "private", "documents", "management-reports", report.filename));
    return new Response(file, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `inline; filename="${report.downloadName}"`,
        "Content-Type": "application/pdf",
      },
    });
  } catch (cause) {
    return failure(cause);
  }
}
