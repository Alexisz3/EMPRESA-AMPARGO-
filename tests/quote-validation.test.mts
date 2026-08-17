import assert from "node:assert/strict";
import test from "node:test";

import { hasValidFileSignature, MAX_FILE_SIZE, validateQuoteFields, validateQuoteFiles } from "../src/lib/quote-validation.ts";

const validFields = {
  fullName: "Jordan Smith",
  phone: "(832) 555-0123",
  email: "Jordan@example.com",
  address: "Houston, TX 77075",
  projectType: "remodeling",
  budget: "To be discussed",
  desiredStartDate: "2026-10-15",
  description: "We are planning a bathroom remodeling project in our home.",
};

test("accepts and normalizes a valid quote request", () => {
  const result = validateQuoteFields(validFields);
  assert.deepEqual(result.errors, {});
  assert.equal(result.data.email, "jordan@example.com");
});

test("rejects missing and malformed required fields", () => {
  const result = validateQuoteFields({ ...validFields, fullName: "", phone: "123", email: "bad", projectType: "unknown", description: "short" });
  assert.equal(result.errors.fullName, "required");
  assert.equal(result.errors.phone, "invalidPhone");
  assert.equal(result.errors.email, "invalidEmail");
  assert.equal(result.errors.projectType, "invalidProjectType");
  assert.equal(result.errors.description, "descriptionTooShort");
});

test("checks file extension, MIME type, empty files and size", () => {
  assert.deepEqual(validateQuoteFiles([{ name: "plan.pdf", type: "application/pdf", size: 1000 }]), {});
  assert.equal(validateQuoteFiles([{ name: "plan.exe", type: "application/pdf", size: 1000 }]).files, "fileType");
  assert.equal(validateQuoteFiles([{ name: "photo.jpg", type: "image/png", size: 1000 }]).files, "fileType");
  assert.equal(validateQuoteFiles([{ name: "empty.pdf", type: "application/pdf", size: 0 }]).files, "fileEmpty");
  assert.equal(validateQuoteFiles([{ name: "large.pdf", type: "application/pdf", size: MAX_FILE_SIZE + 1 }]).files, "fileSize");
});

test("checks JPEG, PNG and PDF file signatures", () => {
  assert.equal(hasValidFileSignature("image/jpeg", Uint8Array.from([0xff, 0xd8, 0xff, 0x00]).buffer), true);
  assert.equal(hasValidFileSignature("image/png", Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).buffer), true);
  assert.equal(hasValidFileSignature("application/pdf", new TextEncoder().encode("%PDF-1.7").buffer), true);
  assert.equal(hasValidFileSignature("application/pdf", new TextEncoder().encode("not a pdf").buffer), false);
});
