---
name: ampargo-backend
description: Work on the AMPARGO server side — the quote API route, form validation, file upload handling, the email/form delivery adapter, security headers and CSP, environment variables, SEO output (robots, sitemap, canonical, hreflang), and structured data. Use this whenever the task touches src/app/api, src/lib, src/proxy.ts, next.config.ts, or .env, and whenever the user mentions the quote form "sending", email delivery, Resend/SendGrid/SMTP, spam, rate limiting, uploads, attachments, security, or analytics. The quote pipeline has strict correctness and honesty rules that generic form-handling advice will violate.
---

# AMPARGO Backend

There is exactly one business-critical server path: a homeowner submits a quote request and it must reach AMPARGO. Everything else — SEO, headers, analytics — supports that. The rules below protect the two things that matter: never losing a lead, and never telling a visitor their request was sent when it wasn't.

## The honesty rule

`src/lib/quote-delivery.ts` is a provider-neutral adapter that currently returns `{ ok: false }` because no delivery provider has been approved. The route turns that into a `503 DELIVERY_NOT_CONFIGURED`, and the form shows a real error.

This is deliberate (ADR-008), not an unfinished stub to paper over. Never make the endpoint return success without a real provider confirming delivery, never add a fake "we'll be in touch" path, and never `console.log` the submission and call it delivered. A homeowner who believes their kitchen remodel request was sent, and hears nothing, is a lost customer who thinks AMPARGO ignored them.

When a provider is finally approved, implement it inside `deliverQuoteRequest` and nowhere else. The route already handles the result correctly. The function must return `ok: true` only after the provider acknowledges the send, and it must throw or return `ok: false` on failure so the route can produce `DELIVERY_FAILED`.

## Validation parity

`src/lib/quote-validation.ts` is shared by the browser and the server. Both call the same `validateQuoteFields` and `validateQuoteFiles`. This matters: client validation is UX, server validation is the actual gate, and if the two disagree the user hits an error the form can't explain.

When you change a rule, change it once in `quote-validation.ts` — never add a check inline in `route.ts` or `estimate-form.tsx`. Then extend `tests/quote-validation.test.mts` and run `npm run test:validation`.

Errors are language-neutral codes (`required`, `invalidPhone`, `fileSignature`, …), not sentences. The route returns codes; the form maps them to translated messages via `t('errors.' + code)`. A new error code needs a matching key in **both** `src/messages/en.json` and `src/messages/es.json` under `QuotePage.form.errors` or the form renders nothing where the error should be.

Text passes through `sanitizeText`, which normalizes to NFKC and strips control characters. Keep new string fields on that path.

## Upload handling

Limits live as exported constants (`MAX_UPLOAD_FILES` 5, `MAX_FILE_SIZE` 10 MB, `MAX_TOTAL_UPLOAD_SIZE` 25 MB) — reference them, never retype the numbers.

Uploads are checked in a deliberate order, cheapest and most spoofable first: count, empty, per-file size, extension-and-MIME agreement, combined size, and finally the magic-byte signature in `hasValidFileSignature`. The signature check is the only one a determined attacker can't forge by renaming a file, and it runs on the server only, after the bytes are read. Preserve that ordering when you add a type — a new format needs its extension mapping, its MIME type in `ALLOWED_FILE_TYPES`, its signature bytes, the `accept` attribute on the file input, and a test.

`route.ts` reads all attachments into memory with `arrayBuffer()`. At the documented 25 MB ceiling that is acceptable, but it means the hosting platform's request-body limit must actually allow 25 MB — verify this against the host before launch rather than assuming, since the platform default is often 4.5 MB and the failure looks like a silent 413 to the user.

## Spam and abuse

Two local measures exist: an off-screen honeypot field named `website`, and `MIN_FORM_COMPLETION_MS` (2.5s) measured from a hidden `formStartedAt` timestamp.

`formStartedAt` is client-supplied and trivially forged — it is friction, not security, and ADR-013 is explicit that this is not rate limiting. Real protection requires a shared store (the hosting platform's rate limiter, or Redis/Upstash keyed by IP). Do not implement an in-memory counter and present it as rate limiting: serverless runs many instances, so it protects almost nothing while creating false confidence.

## Environment-gated services

Optional integrations stay dark until real values exist (ADR-010, ADR-018):

- `NEXT_PUBLIC_SITE_URL` — without it, `getSiteUrl()` returns `null` and canonical, hreflang, OpenGraph URLs and sitemap entries are omitted rather than guessed. Publishing wrong canonicals is worse than publishing none, and the temporary `*.vercel.app` origin must never become the SEO identity.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — no Analytics script loads without it.
- `QUOTE_DELIVERY_PROVIDER` / `QUOTE_DELIVERY_RECIPIENT` — the delivery adapter stays disabled without both.

Follow the same shape for any new integration: read the variable, return an inert result when it's absent, and document it in `.env.example` and the README. Secrets are server-only; anything named `NEXT_PUBLIC_*` is visible in the browser bundle, so an API key must never carry that prefix.

## Security headers

The CSP is built in `next.config.ts`. It currently carries `'unsafe-inline'` on `script-src`, which is what Next.js needs for its inline bootstrap without a nonce setup — it materially weakens the CSP and should be replaced with a nonce-based policy through middleware when there's time. Treat it as known debt, and don't widen the policy further to make a library work; check whether the library is necessary first.

Every added external origin (a form provider's endpoint, a font host, a maps embed) needs its matching directive, and the policy must be retested against the deployed site, since a CSP that only fails in production is the normal failure mode.

## API route conventions

Responses are `{ code: "SCREAMING_SNAKE" }` with an optional `errors` object, using accurate status codes: 415 wrong content type, 413 too large, 400 malformed, 422 validation or spam rejection, 503 not configured, 500 delivery failure, 201 accepted.

Never include the visitor's submitted data or a raw exception in a response body. The `catch` in `route.ts` returns a bare code on purpose — internal detail in an error response is an information leak, and here it would leak a customer's name, phone, and address.

## Before you call it done

```bash
npm run test:validation && npm run lint && npm run typecheck && npm run build
```

For a change to the quote path, also exercise it for real — a valid submission, a submission that trips each new validation rule, and the not-configured path — with `curl` against `npm run start`, because the interesting failures here live in multipart parsing and the browser/server boundary, not in the types.
