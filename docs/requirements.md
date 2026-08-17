# AMPARGO Website Requirements

## Project summary

AMPARGO needs a bilingual corporate website for its remodeling and construction services in Houston, Texas. The website is a multi-page marketing site whose primary business goal is to generate qualified quote requests.

## Audiences

- English-speaking homeowners in the Houston market.
- Spanish-speaking homeowners in the Houston market.
- Prospective clients evaluating AMPARGO's capabilities and previous work.

## Goals

1. Explain AMPARGO's services clearly.
2. Build trust with real project photography and credible company information.
3. Make requesting a quote easy on mobile and desktop.
4. Support search visibility for relevant Houston-area remodeling and construction queries.

## Functional requirements

- English is the default commercial language and Spanish is fully supported.
- Each public page has a locale-specific URL under `/en` or `/es`.
- Navigation, content, metadata, forms, validation, and confirmation states must be localized.
- The site must be responsive from small mobile screens through large desktops.
- The quote form must be accessible, validate on client and server, preserve entries after errors, and provide clear loading, success, and failure states.
- Quote uploads accept at most 5 JPG, JPEG, PNG, or PDF files, with a 10 MB per-file limit and 25 MB combined limit. Client and server validation must agree on MIME type and extension, and the server must verify the file signature.
- Quote delivery must not report success until an approved provider and recipient are configured and implemented.
- The Quote form includes a honeypot and a 2.5-second minimum completion check. Production-grade distributed rate limiting remains dependent on the selected hosting environment.
- Real client photography will be integrated after assets are supplied and approved.
- Project content must be maintained locally in V1; no CMS is required.
- No 3D configurator, renderer, or visualization module is included.

## Quality requirements

- Use semantic HTML and keyboard-accessible interactions.
- Meet WCAG 2.2 AA contrast and focus expectations where practical.
- Respect reduced-motion preferences for animations.
- Optimize images with correct dimensions, modern formats, and meaningful alternative text.
- Prioritize Core Web Vitals, static rendering, and minimal client-side JavaScript.
- Provide unique page titles and descriptions, localized canonical URLs, and language alternates before launch.
- Do not publish claims, credentials, service areas, contact details, reviews, or statistics that the client has not approved.

## Out of scope for V1

- CMS or authenticated admin dashboard.
- 3D design or product configuration.
- Customer accounts, online payments, or scheduling platform.
- Invented testimonials, certifications, warranties, addresses, or business history.

## Content needed before launch

- Approved logo files and brand guidelines, if available.
- Confirmed phone number, email address, service area, hours, and quote workflow.
- Final English source copy and reviewed Spanish translation.
- Approved service list and project categories.
- Real client photographs with usage permission and project context.
- Legal and privacy content required for the final form and analytics setup.

## External launch dependencies

- Confirm and configure the production domain and hosting platform.
- Provide the final corporate email address and quote-delivery recipient.
- Approve an email or form-delivery provider and implement it through `src/lib/quote-delivery.ts`.
- Provide a Google Analytics Measurement ID if analytics will be used.
- Decide whether the standard Google Maps embed is sufficient or whether a managed Maps configuration is needed.
- Obtain legal review of the initial Privacy Policy before publication.
- Provide and approve the final logo asset.
- Replace the temporary favicon with an approved asset.

## Definition of done for the technical foundation

- Next.js, TypeScript, App Router, Tailwind CSS, and next-intl are installed.
- `/en` and `/es` render successfully and `/` routes through locale handling.
- Required source and documentation directories exist.
- Lint, TypeScript validation, and production build pass.
- The repository is ready for Header and Hero implementation without a premature full Home design.
