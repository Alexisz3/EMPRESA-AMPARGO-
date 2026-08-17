import { NextResponse } from "next/server";

import { deliverQuoteRequest } from "@/lib/quote-delivery";
import { hasValidFileSignature, MAX_MULTIPART_REQUEST_SIZE, MIN_FORM_COMPLETION_MS, validateQuoteFields, validateQuoteFiles } from "@/lib/quote-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return NextResponse.json({ code: "UNSUPPORTED_MEDIA_TYPE" }, { status: 415 });
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_MULTIPART_REQUEST_SIZE) {
    return NextResponse.json({ code: "REQUEST_TOO_LARGE" }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400 });
  }

  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim()) {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400 });
  }
  const startedAt = Number(formData.get("formStartedAt"));
  if (!Number.isFinite(startedAt) || startedAt <= 0 || Date.now() - startedAt < MIN_FORM_COMPLETION_MS) {
    return NextResponse.json({ code: "SUBMISSION_TOO_FAST" }, { status: 422 });
  }

  const fieldNames = ["fullName", "phone", "email", "address", "projectType", "budget", "desiredStartDate", "description"] as const;
  const rawFields = Object.fromEntries(fieldNames.map((field) => [field, formData.get(field)]));
  const { data, errors: fieldErrors } = validateQuoteFields(rawFields);
  const files = formData.getAll("files").filter((value): value is File => value instanceof File && (value.name.length > 0 || value.size > 0));
  const errors = { ...fieldErrors, ...validateQuoteFiles(files) };

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ code: "VALIDATION_ERROR", errors }, { status: 422 });
  }

  try {
    const attachments = await Promise.all(files.map(async (file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      bytes: await file.arrayBuffer(),
    })));
    if (attachments.some((file) => !hasValidFileSignature(file.type, file.bytes))) {
      return NextResponse.json({ code: "VALIDATION_ERROR", errors: { files: "fileSignature" } }, { status: 422 });
    }
    const result = await deliverQuoteRequest({ ...data, attachments, submittedAt: new Date().toISOString() });

    if (!result.ok) {
      return NextResponse.json({ code: "DELIVERY_NOT_CONFIGURED" }, { status: 503 });
    }

    return NextResponse.json({ code: "SUBMITTED" }, { status: 201 });
  } catch {
    return NextResponse.json({ code: "DELIVERY_FAILED" }, { status: 500 });
  }
}
