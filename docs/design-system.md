# Design System Foundation

## Status

This document defines implementation guardrails, not a final visual identity. Brand tokens will be revised after the approved logo, visual reference, and Header/Hero direction are available.

## Principles

1. Let real project photography carry visual credibility.
2. Keep content readable and calls to action unmistakable.
3. Use consistent spacing, type hierarchy, and interaction states.
4. Build mobile-first and enhance progressively.
5. Treat accessibility and reduced motion as defaults.

## Initial technical tokens

The global stylesheet exposes semantic placeholders:

- `background`: warm neutral page background.
- `foreground`: primary text.
- `surface`: elevated content surface.
- `muted`: secondary text.
- `accent`: temporary action/accent color.

These names may remain stable even when their values change after brand approval. Components should use semantic tokens instead of scattering raw color values.

## Typography

- Geist is the temporary sans-serif foundation supplied through `next/font`.
- Geist Mono is available only for technical or utility content.
- Final display and body typefaces remain an open brand decision.
- Text must tolerate longer Spanish labels without clipping or fixed-width assumptions.

## Layout

- Use a shared centered container with responsive horizontal padding.
- Define section spacing consistently rather than per-page improvisation.
- Avoid fixed heights for copy-heavy components.
- Design interactive targets at a minimum practical touch size of 44 by 44 CSS pixels.

## Components

- Implemented layout: Header, responsive native mobile navigation, locale switcher.
- Implemented UI: Container and semantic page-section primitives.
- Implemented sections: complete bilingual Home plus About, Services, Projects, Quote, Contact and Privacy pages using approved real photography where applicable.
- Implemented shared UI: Footer, buttons, form controls, project gallery/lightbox, CTA sections and localized system 404.

Components will be added only as the relevant page phase begins.

## Motion

- No animation library is currently shipped. Use lightweight CSS transitions for purposeful interaction feedback.
- Keep animation subtle and avoid delaying access to content.
- Provide a reduced-motion path and never rely on animation alone to convey state.

## Images

- Use `next/image` for responsive delivery.
- Supply explicit dimensions or stable aspect ratios to prevent layout shift.
- Write contextual alt text; use empty alt text for genuinely decorative images.
- Establish a documented crop/focal-point strategy after the real asset set is available.
