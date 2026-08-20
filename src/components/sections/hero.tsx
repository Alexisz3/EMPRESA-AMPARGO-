import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { Container } from "../ui/container";

const trustIndicators = ["experience", "serviceArea", "projectTypes"] as const;

type TitleLines = { lead: string[]; trail: string[] };

export async function Hero() {
  const t = await getTranslations("Hero");

  // The headline is split into lines for the masked line-by-line reveal. The
  // split lives in the message files because Spanish breaks in different
  // places than English and runs longer, so line counts may differ per locale.
  const { lead, trail } = t.raw("titleLines") as TitleLines;
  const titleLines = [
    ...lead.map((text) => ({ text, muted: false })),
    ...trail.map((text) => ({ text, muted: true })),
  ];

  return (
    <section className="relative overflow-hidden pb-12 pt-6 sm:py-20 lg:pb-0 lg:pt-16">
      <Container>
        {/*
          Desktop: asymmetric editorial grid — text ~38%, image ~62%.
          Mobile: single column, vertical stack.
        */}
        <div className="grid items-end gap-10 sm:gap-12 lg:grid-cols-[0.62fr_1fr] lg:items-start lg:gap-0 xl:grid-cols-[0.55fr_1fr]">

          {/* ── Left column: text ── */}
          <div className="lg:pt-10 lg:pb-14 lg:pr-12 xl:pr-16">

            {/* Eyebrow */}
            <p
              data-reveal="hero"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-accent"
              style={
                {
                  "--reveal-delay": "0ms",
                  "--reveal-distance": "14px",
                  "--reveal-duration": "520ms",
                } as React.CSSProperties
              }
            >
              {t("eyebrow")}
            </p>

            {/* Horizontal arch line below eyebrow */}
            <span
              aria-hidden="true"
              data-reveal="hero"
              className="arch-line-h mt-4 block h-px w-full bg-foreground/10"
              style={{ "--line-delay": "100ms" } as React.CSSProperties}
            />

            {/* H1 — split by line for reveal */}
            <h1 className="mt-4 text-[clamp(2.35rem,8.5vw,3.25rem)] font-semibold leading-[0.96] tracking-[-0.045em] sm:mt-6 sm:text-6xl lg:text-[3.25rem] xl:text-7xl">
              {titleLines.map((line, index) => (
                <span
                  key={`${line.text}-${index}`}
                  data-reveal="hero"
                  className={`reveal-line${line.muted ? " text-muted" : ""}`}
                  style={
                    {
                      "--line-delay": `${100 + index * 50}ms`,
                      "--line-duration": "660ms",
                      "--line-distance": "36px",
                    } as React.CSSProperties
                  }
                >
                  <span>{line.text}</span>
                </span>
              ))}
            </h1>

            <p
              data-reveal="hero"
              className="mt-5 max-w-sm text-base leading-snug text-muted sm:mt-7 sm:text-lg sm:leading-8"
              style={
                {
                  "--reveal-delay": "300ms",
                  "--reveal-distance": "14px",
                  "--reveal-duration": "560ms",
                } as React.CSSProperties
              }
            >
              {t("description")}
            </p>

            <div
              data-reveal="hero"
              className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row"
              style={
                {
                  "--reveal-delay": "400ms",
                  "--reveal-distance": "12px",
                  "--reveal-duration": "500ms",
                } as React.CSSProperties
              }
            >
              <Link
                href="/quote"
                className="motion-button inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 text-base font-semibold text-white hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("primaryCta")}
              </Link>
              <Link
                href="/projects"
                className="motion-button inline-flex min-h-12 items-center justify-center rounded-full border border-black/20 px-7 text-base font-semibold hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                {t("secondaryCta")}
              </Link>
            </div>

            {/* Trust metrics — mobile only */}
            <dl
              data-reveal
              data-reveal-group
              className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-3 lg:hidden"
              style={
                {
                  "--reveal-delay": "450ms",
                  "--reveal-distance": "8px",
                } as React.CSSProperties
              }
            >
              {trustIndicators.map((indicator, index) => (
                <div
                  key={indicator}
                  data-reveal
                  className={`bg-background px-5 py-5 sm:px-7 ${index === 2 ? "col-span-2 sm:col-span-1" : ""}`}
                >
                  <dd className="text-base font-semibold text-foreground">
                    {t(`trust.${indicator}.value`)}
                  </dd>
                  <dt className="mt-1 text-sm text-muted">
                    {t(`trust.${indicator}.label`)}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Right column: photograph ── */}
          <div className="relative lg:-mr-10 xl:-mr-10">
            {/* Vertical architectural line — left edge of image on desktop */}
            <span
              aria-hidden="true"
              data-reveal="hero"
              className="arch-line-v absolute -left-5 top-[10%] hidden h-[60%] w-px bg-foreground/10 lg:block"
              style={{ "--line-delay": "200ms" } as React.CSSProperties}
            />

            {/* Photograph */}
            <div
              data-reveal="image"
              className="relative aspect-[3/2] overflow-hidden rounded-[2rem] bg-[#25302c] text-white shadow-2xl shadow-black/15 sm:aspect-[5/4] lg:aspect-[4/5] lg:rounded-r-none"
            >
              <Image
                src="/images/outdoor-kitchen-hero.jpeg"
                alt={t("imageAlt")}
                fill
                priority
                sizes="(min-width: 1024px) 62vw, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
                className="hero-image-enter object-cover object-[52%_center] sm:object-[50%_center] lg:object-[54%_center]"
              />

              {/* Editorial panel — 30+ YEARS */}
              <div
                className="editorial-panel absolute bottom-6 left-6 rounded-xl border border-white/20 bg-[#1d2522]/85 px-4 py-3 backdrop-blur-sm sm:bottom-8 sm:left-8"
                data-reveal="image"
                style={{ "--panel-delay": "600ms" } as React.CSSProperties}
                aria-hidden="true"
              >
                <p className="text-lg font-semibold leading-tight tracking-[-0.03em] text-white sm:text-xl">
                  {t("trust.experience.value")}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-white/65">
                  {t("trust.experience.label")}
                </p>
              </div>

              {/* Editorial panel — HOUSTON, TX (Hidden on mobile) */}
              <div
                className="editorial-panel absolute hidden sm:block sm:right-8 sm:top-8 rounded-xl border border-white/15 bg-[#1d2522]/75 px-3 py-2.5 backdrop-blur-sm"
                data-reveal="image"
                style={{ "--panel-delay": "700ms" } as React.CSSProperties}
                aria-hidden="true"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                  {t("trust.serviceArea.value")}
                </p>
              </div>
            </div>

            {/* Trust metrics — desktop, docked below image */}
            <dl
              data-reveal
              data-reveal-group
              className="mt-0 hidden grid-cols-3 gap-px overflow-hidden border-x border-b border-black/10 bg-black/10 lg:grid lg:rounded-b-2xl"
              style={
                {
                  "--reveal-delay": "680ms",
                  "--reveal-distance": "6px",
                } as React.CSSProperties
              }
            >
              {trustIndicators.map((indicator) => (
                <div key={indicator} data-reveal className="bg-background px-5 py-4 sm:px-6">
                  <dd className="text-sm font-semibold text-foreground sm:text-base">
                    {t(`trust.${indicator}.value`)}
                  </dd>
                  <dt className="mt-0.5 text-xs text-muted">
                    {t(`trust.${indicator}.label`)}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}

