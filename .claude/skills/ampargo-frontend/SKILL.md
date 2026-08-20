---
name: ampargo-frontend
description: Build or change any UI in the AMPARGO website — sections, pages, layout, styling, motion, responsive behavior, accessibility. Use this whenever the task touches src/components, src/app/[locale], or src/app/globals.css, and whenever the user mentions the hero, header, footer, services, projects, gallery, the quote form's appearance, "redesign", "layout", "spacing", "animation", "mobile", or "make it look better". This project has a specific bilingual + motion + token architecture that generic Next.js/Tailwind habits will silently break, so consult this before writing component code.
---

# AMPARGO Frontend

The site sells remodeling work to Houston homeowners in two languages. Photography carries the credibility; the interface's job is to stay out of its way and make the quote request obvious. Every rule below exists because breaking it produces a specific, observed failure in this codebase.

## The four invariants

These are what actually go wrong here. Check each one before you consider a UI change finished.

### 1. No user-visible string lives in a component

Every visible string comes from `useTranslations` / `getTranslations` against `src/messages/en.json` and `src/messages/es.json`. Both files must keep identical key sets — a key present in one and missing in the other throws at render time in that locale.

This is the invariant most often broken here, and it fails quietly: the English page looks perfect while the Spanish page shows English. The hero H1 shipped that way for several commits. When a design calls for text split across elements (line-by-line reveals, a large number beside a small label), the split itself must live in the message file, because Spanish breaks in different places than English:

```json
"titleLines": { "lead": ["Transforming", "Spaces."], "trail": ["Building What", "Matters."] }
```

Read it with `t.raw("titleLines")` and map over it. Never hardcode the lines in JSX and never assume the two languages have the same number of them.

Verify with the real render, not by reading the source:

```bash
npm run build && npm run start &
curl -s localhost:3000/es | grep -oE '<h1[^>]*>.*?</h1>' | sed 's/<[^>]*>/ /g'
```

Spanish runs 15–25% longer than English. Never set a fixed width or height on a text container; test the longest Spanish string, not the English one.

### 2. Server Components by default

Pages and sections are async Server Components using `getTranslations`. `"use client"` is a deliberate cost, not a convenience — it ships JavaScript and removes the component from the static render.

Add it only when the component genuinely needs state, effects, or event handlers. When a section needs one interactive island, keep the section on the server and pass translated strings down as props to a small client child. `featured-projects.tsx` → `featured-projects-interactive.tsx` is the pattern to copy: the server component resolves translations, the client component receives them as a typed `Project[]`.

Never read `window`, `matchMedia`, or `navigator` during a client component's render body — the server renders one value and the client's first render can produce another, which is a hydration mismatch. Read them inside `useEffect` and store the result in state.

### 3. Motion goes through the `data-reveal` system

`src/components/ui/motion-observer.tsx` runs one `IntersectionObserver` for the whole page. It adds `.motion-enhanced` to `<html>`, marks each `[data-reveal]` element `data-reveal-ready="true"`, then sets `data-reveal-visible="true"` as elements enter the viewport. All the actual animation is CSS in `globals.css`.

To animate something new, add `data-reveal` and tune it with CSS custom properties inline rather than writing new keyframes:

```tsx
<p data-reveal style={{ "--reveal-delay": "300ms", "--reveal-distance": "14px" } as React.CSSProperties}>
```

Available variants: bare `data-reveal` (fade/rise), `data-reveal="hero"` (larger distance), `.reveal-line` (masked line wipe — the animating element is the inner `<span>`, the wrapper needs `overflow: hidden`), `.arch-line-h` / `.arch-line-v` (scale-in rules), `.editorial-panel` (delayed float-in, tuned with `--panel-delay`).

Content must be readable with JavaScript off: `[data-reveal] { opacity: 1 }` is the base state and animation only attaches once `.motion-enhanced` is present. Never author a reveal that starts at `opacity: 0` outside that guard.

Every new animation needs a `prefers-reduced-motion: reduce` branch in the block at the bottom of `globals.css`. Reduced motion means the element is immediately in its final state — not a faster animation.

### 4. Color comes from semantic tokens

`globals.css` defines `--background --foreground --surface --muted --accent`, exposed to Tailwind as `bg-background`, `text-muted`, `text-accent` and so on. The brand identity is not final; tokens are the seam that lets values change without touching components.

One documented exception exists: dark sections (`bg-foreground`) need a lighter accent for contrast, and they use `#d18a62` literally in `footer.tsx`, `featured-projects-interactive.tsx`, and `quote-page-content.tsx`. That literal is a known debt, not a precedent — prefer adding an `--accent-on-dark` token over spreading it further. Never introduce a new raw hex for anything else.

## Accessibility floor

WCAG 2.2 AA is a requirement in `docs/requirements.md`, and for a contractor site the practical stakes are high: a homeowner filling out a quote request on a phone one-handed is the primary user.

- Interactive targets are at least 44×44 CSS px. The codebase uses `min-h-11` (44px) and `min-h-12` (48px) — match the neighbors.
- Every interactive element carries a visible `focus-visible:outline-2 focus-visible:outline-offset-2` state. Never remove an outline without replacing it.
- Use real semantics: `<button>` for actions, the `Link` from `@/i18n/navigation` for navigation, `<dl>` for label/value pairs, `<figure>`/`<figcaption>` for captioned images. The mobile menu is a native `<details>` element precisely so it works without JavaScript.
- Content images get descriptive alt text from the message files; decorative ones get `alt=""` or `aria-hidden`.
- Dynamic regions (form status, the project viewer) need `aria-live="polite"`.

## Images

Always `next/image` with `fill` plus a stable aspect ratio on the parent, and a `sizes` attribute matching the real layout breakpoints — a wrong `sizes` silently ships a 2000px image to a phone. Photographs are real client work; `object-position` is tuned per image (see `hero.tsx`'s `object-[52%_center]`) because the subject is rarely centered. Only `priority` on genuinely above-the-fold images.

## Navigation and locale

Import `Link`, `usePathname`, `useRouter` from `@/i18n/navigation`, never from `next/link` or `next/navigation` — the i18n wrappers add the locale prefix. Raw `next/link` produces a URL that drops the visitor's language.

Locale switching preserves scroll position through `src/components/layout/locale-navigation.tsx`, which anchors on structural elements (`main section`, `[id]`, `[aria-labelledby]`). When you add a major section, give it an `id` or `data-locale-scroll-anchor` so the restoration has something stable to land on.

## Before you call it done

```bash
npm run lint && npm run typecheck && npm run build
```

Then look at the actual rendered result in both languages and at 375px width. The failures this project produces — an English H1 on the Spanish page, a hydration mismatch, a Spanish label overflowing a fixed-width chip — are all invisible in the source and obvious in the browser.
