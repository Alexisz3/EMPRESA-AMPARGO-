# AMPARGO Production Checklist

The codebase is prepared for preproduction review. The following external dependencies remain intentionally incomplete.

## Client and provider inputs

- [ ] Confirm the final production domain.
- [ ] Select and configure the hosting platform.
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
