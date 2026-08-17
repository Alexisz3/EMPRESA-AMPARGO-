import type { QuoteFields } from "./quote-validation";

export type QuoteAttachment = {
  name: string;
  size: number;
  type: string;
  bytes: ArrayBuffer;
};

export type QuoteRequest = QuoteFields & {
  attachments: QuoteAttachment[];
  submittedAt: string;
};

export async function deliverQuoteRequest(request: QuoteRequest) {
  void request;
  const provider = process.env.QUOTE_DELIVERY_PROVIDER?.trim();
  const recipient = process.env.QUOTE_DELIVERY_RECIPIENT?.trim();

  // No provider implementation is approved yet. This adapter is the single
  // integration point for a future email or form-delivery service.
  if (!provider || !recipient) return { ok: false as const, reason: "not_configured" as const };
  return { ok: false as const, reason: "provider_not_implemented" as const };
}
