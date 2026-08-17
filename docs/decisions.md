# Architecture Decision Log

## ADR-001: Use Next.js App Router with TypeScript

- Status: accepted
- Decision: Build with Next.js App Router and strict TypeScript settings.
- Reason: The project benefits from server rendering, metadata support, image optimization, route-level composition, and typed implementation.

## ADR-002: Use Tailwind CSS for styling

- Status: accepted
- Decision: Use Tailwind CSS with semantic CSS custom properties for brand tokens.
- Reason: This supports fast responsive implementation while allowing the unconfirmed brand layer to change without rewriting component structure.

## ADR-003: Use locale-prefixed routes

- Status: accepted
- Decision: Use `next-intl` with `/en` and `/es`; English is the default locale and every public URL carries a locale prefix.
- Reason: Explicit language URLs are predictable, shareable, and suitable for localized SEO. The proxy negotiates visits to the unprefixed root.

## ADR-004: Keep content local in V1

- Status: accepted
- Decision: Store approved structured content and translation messages in the codebase.
- Reason: A CMS is outside the V1 scope and would add operational complexity before the content model is stable.

## ADR-005: Defer final brand styling and imagery

- Status: accepted
- Decision: Keep the initial screen neutral and integrate real project photographs only after assets are supplied and selected.
- Reason: The current local context does not contain approved brand assets or client photographs. Deferring prevents invented or misleading presentation.

## ADR-006: Install Motion without forcing client rendering

- Status: accepted
- Decision: Keep pages as Server Components by default and introduce Motion only in isolated Client Components when the design calls for animation.
- Reason: This preserves performance and limits client-side JavaScript while leaving the approved animation tool ready.

## ADR-007: Exclude 3D and CMS features

- Status: accepted
- Decision: Do not add 3D libraries, CMS SDKs, or placeholder integrations.
- Reason: Both features are explicitly outside V1 and would create unnecessary dependencies and maintenance.

## Open decisions

- Production domain and hosting target.
- Final brand palette, typography, and logo behavior.
- Localized slug strategy beyond the initial sitemap.
- Quote form delivery service, spam protection, consent copy, and data retention.
- Analytics and cookie-consent requirements.
- Exact service list, service area, project taxonomy, and verified business claims.

## ADR-008: Validate quote requests without pretending to deliver them

- Status: accepted
- Decision: Validate multipart quote requests on the client and again in an App Router endpoint. Route validated requests through a provider-neutral adapter that currently returns a not-configured result.
- Reason: No corporate inbox or delivery provider has been approved. A visible success state must only appear after a real integration confirms delivery.

## ADR-009: Apply bounded upload limits

- Status: accepted
- Decision: Accept up to 5 JPG, JPEG, PNG, or PDF files, limited to 10 MB each and 25 MB combined.
- Reason: These limits support useful project photos and plans while limiting memory use and accidental oversized submissions. Hosting-provider request limits must be checked before launch.

## ADR-010: Activate optional services only through environment variables

- Status: accepted
- Decision: Do not load Google Analytics without a valid `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Do not generate production canonical, hreflang, or sitemap URLs without `NEXT_PUBLIC_SITE_URL`.
- Reason: Production identifiers and the final domain are not confirmed, and placeholder identifiers would create incorrect tracking and SEO signals.

## ADR-011: Use a credential-free Maps embed

- Status: accepted
- Decision: Use a standard Google Maps query embed for the confirmed address, with no API key stored in the project.
- Reason: This provides useful location context without inventing credentials or committing to a paid Maps API integration.

## Production blockers that remain open

- Domain and hosting selection.
- Corporate email and delivery recipient.
- Approved quote-form delivery provider and adapter implementation.
- Google Analytics Measurement ID and any required consent decision.
- Final Maps approach if the standard embed is not approved.
- Legal review of the Privacy Policy.
- Final logo asset.

## ADR-012: Apply compatible baseline security headers

- Status: accepted
- Decision: Apply CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, `base-uri`, `form-action`, `object-src` and `frame-ancestors` protections through Next.js headers.
- Reason: These reduce common browser risks without preventing the confirmed Google Maps embed or the optional Analytics integration. The CSP allows only the external origins currently anticipated and must be retested when hosting, analytics or a form provider is selected.

## ADR-013: Add local spam friction, defer distributed rate limiting

- Status: accepted
- Decision: Use an off-screen honeypot and a 2.5-second minimum form-completion check. Do not represent an in-memory counter as production rate limiting.
- Reason: Stateless or multi-instance hosting requires a shared store or platform-native service for dependable rate limits. That choice cannot be finalized before hosting is selected.

## ADR-014: Defer structured data until final identity inputs

- Status: accepted
- Decision: Do not publish LocalBusiness JSON-LD during preproduction.
- Reason: AMPARGO remains a provisional name and the final domain, logo, corporate email and business-profile strategy are pending. Publishing partial schema now provides limited benefit and risks stale entity data.

## ADR-015: Preserve source photographs and rely on Next Image

- Status: accepted
- Decision: Do not recompress the current project photographs during this audit.
- Reason: Every source image is below approximately 130 KB, and `next/image` already serves responsive optimized variants. Re-encoding would add duplicate assets with negligible transfer savings.

## ADR-016: Remove the inactive Motion client dependency

- Status: accepted; supersedes ADR-006 for the current implementation
- Decision: Replace the two `motion.div` wrappers configured with `initial={false}` by ordinary server-rendered elements and remove Motion.
- Reason: The wrappers produced no animation but still created a client boundary and shipped an animation library. CSS transitions and reduced-motion handling cover the interactions currently present.

## ADR-017: Separate confirmed information from publishable claims

- Status: accepted
- Decision: Record new client confirmations in `docs/client-confirmed-information.md`, but do not publish incomplete estimate terms, warranties, insurance, licenses, credentials, testimonials, Before/After claims, financing, hours, or service areas beyond Houston.
- Reason: Several facts are directionally confirmed but still require evidence, exact terms, authorized wording, or source material before they can be represented accurately in public marketing copy.

## ADR-018: Keep temporary Vercel identity out of definitive SEO configuration

- Status: accepted
- Decision: Keep canonical, hreflang, sitemap, definitive JSON-LD, and Search Console prepared for environment-based activation, but do not use the temporary `*.vercel.app` URL as the official SEO origin.
- Reason: The official domain is still pending, and publishing the temporary deployment as the definitive business identity would create avoidable migration and indexing work.
