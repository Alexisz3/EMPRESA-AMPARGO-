export const PROJECT_TYPES = [
  "remodeling",
  "construction",
  "design-planning",
  "maintenance",
  "electrical",
  "plumbing",
  "other",
] as const;

export const MAX_UPLOAD_FILES = 5;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_TOTAL_UPLOAD_SIZE = 25 * 1024 * 1024;
export const MAX_MULTIPART_REQUEST_SIZE = 27 * 1024 * 1024;
export const MIN_FORM_COMPLETION_MS = 2500;
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export type QuoteFields = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  projectType: ProjectType | "";
  budget: string;
  desiredStartDate: string;
  description: string;
};

export type QuoteFieldName = keyof QuoteFields | "files";
export type QuoteErrorCode =
  | "required"
  | "invalidName"
  | "invalidPhone"
  | "invalidEmail"
  | "invalidProjectType"
  | "invalidDate"
  | "descriptionTooShort"
  | "tooLong"
  | "fileCount"
  | "fileSize"
  | "fileType"
  | "fileEmpty"
  | "fileSignature"
  | "totalFileSize";

export type QuoteErrors = Partial<Record<QuoteFieldName, QuoteErrorCode>>;

type FileLike = { name: string; size: number; type: string };

function sanitizeText(value: unknown, preserveLines = false) {
  if (typeof value !== "string") return "";
  const normalized = value.normalize("NFKC").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  return preserveLines
    ? normalized.replace(/[^\S\r\n]+/g, " ").replace(/\n{3,}/g, "\n\n").trim()
    : normalized.replace(/\s+/g, " ").trim();
}

export function validateQuoteFields(input: Record<string, unknown>) {
  const data: QuoteFields = {
    fullName: sanitizeText(input.fullName),
    phone: sanitizeText(input.phone),
    email: sanitizeText(input.email).toLowerCase(),
    address: sanitizeText(input.address),
    projectType: sanitizeText(input.projectType) as QuoteFields["projectType"],
    budget: sanitizeText(input.budget),
    desiredStartDate: sanitizeText(input.desiredStartDate),
    description: sanitizeText(input.description, true),
  };
  const errors: QuoteErrors = {};

  if (!data.fullName) errors.fullName = "required";
  else if (data.fullName.length < 2) errors.fullName = "invalidName";
  else if (data.fullName.length > 100) errors.fullName = "tooLong";

  const phoneDigits = data.phone.replace(/\D/g, "");
  if (!data.phone) errors.phone = "required";
  else if (phoneDigits.length < 10 || phoneDigits.length > 15) errors.phone = "invalidPhone";
  else if (data.phone.length > 40) errors.phone = "tooLong";

  if (!data.email) errors.email = "required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = "invalidEmail";
  else if (data.email.length > 254) errors.email = "tooLong";

  if (data.address.length > 200) errors.address = "tooLong";

  if (!data.projectType) errors.projectType = "required";
  else if (!PROJECT_TYPES.includes(data.projectType as ProjectType)) errors.projectType = "invalidProjectType";

  if (data.budget.length > 100) errors.budget = "tooLong";

  if (data.desiredStartDate) {
    const validFormat = /^\d{4}-\d{2}-\d{2}$/.test(data.desiredStartDate);
    const parsed = new Date(`${data.desiredStartDate}T00:00:00`);
    if (!validFormat || Number.isNaN(parsed.getTime())) errors.desiredStartDate = "invalidDate";
  }

  if (!data.description) errors.description = "required";
  else if (data.description.length < 20) errors.description = "descriptionTooShort";
  else if (data.description.length > 3000) errors.description = "tooLong";

  return { data, errors };
}

export function validateQuoteFiles(files: FileLike[]) {
  const errors: QuoteErrors = {};
  if (files.length > MAX_UPLOAD_FILES) errors.files = "fileCount";
  else if (files.some((file) => file.size === 0)) errors.files = "fileEmpty";
  else if (files.some((file) => file.size > MAX_FILE_SIZE)) errors.files = "fileSize";
  else if (files.some((file) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    const expectedType = extension === "jpg" || extension === "jpeg" ? "image/jpeg" : extension === "png" ? "image/png" : extension === "pdf" ? "application/pdf" : null;
    return !expectedType || file.type !== expectedType || !ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number]);
  })) errors.files = "fileType";
  else if (files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_UPLOAD_SIZE) errors.files = "totalFileSize";
  return errors;
}

export function hasValidFileSignature(type: string, bytes: ArrayBuffer) {
  const data = new Uint8Array(bytes);
  if (type === "image/jpeg") return data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
  if (type === "image/png") return data.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => data[index] === value);
  if (type === "application/pdf") return data.length >= 5 && String.fromCharCode(...data.slice(0, 5)) === "%PDF-";
  return false;
}
