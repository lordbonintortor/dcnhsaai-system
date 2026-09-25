export const verificationLabels = {
  pending: "Pending review",
  needs_information: "Needs information",
  verified: "Verified · Demo",
  rejected: "Rejected",
} as const;

export type VerificationStatus = keyof typeof verificationLabels;

export const verificationReferences = {
  school_records: "School graduation records",
  records_office: "School records-office confirmation",
  association_registry: "Previously verified graduate registry",
  graduation_document: "Diploma or graduation certificate",
} as const;

export type VerificationReference = keyof typeof verificationReferences;

export type ApplicationReview = {
  id: string;
  status: VerificationStatus;
  actor: "officer" | "applicant";
  reviewer: string;
  reviewedAt: string;
  message: string;
  reference?: VerificationReference;
  referenceNote?: string;
};

export type ReviewInput = {
  status: VerificationStatus;
  message: string;
  reference?: VerificationReference;
  referenceNote?: string;
  confirmsGraduation: boolean;
};

export function isVerificationStatus(value: unknown): value is VerificationStatus {
  return typeof value === "string" && Object.hasOwn(verificationLabels, value);
}

export function isApplicationReview(value: unknown): value is ApplicationReview {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return ["id", "reviewer", "reviewedAt", "message"].every(key => typeof row[key] === "string")
    && isVerificationStatus(row.status)
    && (row.actor === "officer" || row.actor === "applicant")
    && (row.reference === undefined || (typeof row.reference === "string" && Object.hasOwn(verificationReferences, row.reference)))
    && (row.referenceNote === undefined || typeof row.referenceNote === "string");
}

export function reviewInputError(input: ReviewInput): string | null {
  if (!isVerificationStatus(input.status)) return "Choose a review decision.";
  if (!input.message.trim() || input.message.trim().length > 1000) return "Enter a message to the applicant using 1–1,000 characters.";
  if (input.status === "verified") {
    if (!input.reference || !Object.hasOwn(verificationReferences, input.reference)) return "Select the reference used to confirm graduation.";
    if (!input.referenceNote?.trim() || input.referenceNote.trim().length > 300) return "Describe the reference checked using 1–300 characters.";
    if (!input.confirmsGraduation) return "Confirm that the reference supports graduation from DCNHS.";
  }
  return null;
}

export function reviewDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila",
  }).format(date);
}
