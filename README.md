# AMPARGO Web

Technical foundation for AMPARGO's bilingual remodeling and construction website serving Houston, Texas.

## Run locally

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. Locale handling redirects the root to an English or Spanish route; `/en` and `/es` can also be opened directly.

## Commands

```powershell
npm run dev
npm run lint
npm run typecheck
npm run test:validation
npm run build
npm run start
```

## Project structure

- `src/app/[locale]`: locale-aware App Router pages and layouts.
- `src/components/layout`: shared site chrome such as Header and Footer.
- `src/components/sections`: page-level marketing sections.
- `src/components/ui`: reusable interface primitives.
- `src/content`: approved structured site content outside translation messages.
- `src/i18n`: locale routing, loading, and navigation helpers.
- `src/lib`: framework-independent utilities and integrations.
- `src/messages`: English and Spanish UI messages.
- `src/types`: shared TypeScript types.
- `docs`: product, brand, design, sitemap, and decision documentation.

## Environment configuration

Copy `.env.example` to `.env.local` only when real values are available. The site currently runs without these variables:

- `NEXT_PUBLIC_SITE_URL`: production origin for canonical URLs, hreflang, robots and sitemap.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: optional Google Analytics 4 ID; no analytics scripts load without it.
- `QUOTE_DELIVERY_PROVIDER`: reserved identifier for the future approved delivery integration.
- `QUOTE_DELIVERY_RECIPIENT`: approved corporate inbox for quote requests.

The quote endpoint validates submissions but intentionally returns a service-unavailable response until a real provider implementation is added to `src/lib/quote-delivery.ts`. It never simulates successful email delivery.

Quote attachments are checked for count, individual and combined size, allowed extension, MIME type, empty files and JPEG/PNG/PDF signatures. A honeypot and minimum-completion-time check provide basic local spam friction; production-grade distributed rate limiting remains a hosting decision.

Baseline browser security headers are configured in `next.config.ts`. Recheck the Content Security Policy after selecting hosting, analytics and form-delivery providers.

## Current scope

The project includes the bilingual Home, About, Services, Projects, Contact, Quote and Privacy pages. Real client photography is used where approved. V1 has no CMS or 3D module.

See [`docs/requirements.md`](docs/requirements.md) and [`docs/decisions.md`](docs/decisions.md) before adding features or unverified business content.

See [`docs/production-checklist.md`](docs/production-checklist.md) for every client or provider dependency that remains open before launch.
