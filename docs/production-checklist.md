# AMPARGO Production Checklist

The codebase is prepared for preproduction review. The following external dependencies remain intentionally incomplete.

## Client and provider inputs

- [ ] Confirm the final production domain.
- [x] Use Vercel for the current temporary deployment; the official production domain remains pending.
- [ ] Deliver and approve the final AMPARGO logo and favicon assets.
- [ ] Confirm the corporate email address.
- [ ] Approve the Quote email/form delivery provider.
- [ ] Confirm the Quote recipient inbox.
- [ ] Select production-grade antispam and distributed rate limiting appropriate to the hosting platform.
- [ ] Provide the Google Analytics Measurement ID if analytics is approved.
- [ ] Configure `NEXT_PUBLIC_SITE_URL` with the final HTTPS origin.
- [ ] Decide whether the current credential-free Google Maps embed is approved.
- [ ] Obtain legal review of the Privacy Policy.
- [ ] Confirm or create the Google Business Profile.
- [ ] Configure Google Search Console after domain verification.
- [ ] Obtain final client review of English and Spanish copy, photographs, phone numbers and address.
- [ ] Define additional-estimate/revision terms before publishing “Initial Estimate — Free.”
- [ ] Obtain warranty terms and approved public wording.
- [ ] Obtain insurance coverage details and approved public wording.
- [ ] Obtain electrical, plumbing and other applicable license numbers, holders, scopes and validity.
- [ ] Confirm financing availability and business hours.
- [ ] Request at least three authorized testimonials.
- [ ] Request authentic Before/After pairs of the same space from similar angles.

## Production verification

- [ ] Implement the approved provider in `src/lib/quote-delivery.ts`.
- [ ] Test a real Quote submission, attachment delivery and failure path in production.
- [ ] Verify hosting request-body limits support the documented 25 MB combined upload limit.
- [ ] Verify production CSP with the selected analytics, form and hosting providers.
- [ ] Verify canonical, hreflang, robots and sitemap output using the final domain.
- [ ] Confirm Analytics does not load until any required consent mechanism is satisfied.
- [ ] Run `npm run test:validation`, `npm run lint`, `npm run typecheck` and `npm run build` with production environment settings.
- [ ] Complete a final keyboard, mobile, form, image and broken-link review on the deployed URL.

## Current temporary assets

- [ ] Replace the current temporary `src/app/favicon.ico` with the approved final favicon. No new logo or brand mark has been invented for preproduction.
- [ ] Obtain or recreate the approved AMPARGO logo as a clean SVG or high-resolution PNG. The older business-card photograph remains reference material only.

## Confirmed information not yet approved for broad public claims

- Joe Andrade and Mario Parra are both primary contacts.
- AMPARGO aims to respond within approximately 24 hours.
- The initial estimate is free; additional estimates or revisions may involve additional cost, with exact terms pending.
- AMPARGO can assist with permits when required; final public wording remains under review.
- Warranty, insurance and applicable licenses are confirmed, but the supporting details and public wording remain pending.
- Electrical and plumbing work are performed internally.
- AMPARGO purchases and coordinates materials and may work with external architects or designers when project complexity requires it.

See `docs/client-confirmed-information.md` for the complete source-of-truth record and publication restrictions.
