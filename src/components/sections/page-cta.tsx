import { Link } from "@/i18n/navigation";

import { Container } from "../ui/container";

type PageCtaProps = {
  description: string;
  eyebrow?: string;
  primaryLabel: string;
  title: string;
  secondaryLabel: string;
};

export function PageCta({
  description,
  eyebrow,
  primaryLabel,
  secondaryLabel,
  title,
}: PageCtaProps) {
  return (
    <section className="bg-foreground py-16 text-background sm:py-24">
      <Container>
        <div data-reveal className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#27312e] px-6 py-14 sm:px-12 sm:py-18 lg:px-20 lg:py-20">
          <div aria-hidden="true" className="absolute -right-28 -top-28 size-80 rounded-full border border-white/10" />
          <div className="relative z-10 max-w-4xl">
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-on-dark">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {title}
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              {description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className="motion-button inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 text-base font-semibold text-white hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {primaryLabel}
              </Link>
              <a
                href="tel:+18327940720"
                className="motion-button inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-7 text-base font-semibold text-white hover:border-white hover:bg-white hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {secondaryLabel}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
