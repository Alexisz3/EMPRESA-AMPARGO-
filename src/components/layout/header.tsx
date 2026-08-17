import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { Container } from "../ui/container";
import { LocaleSwitcher } from "./locale-switcher";

const navigation = [
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "projects", href: "/projects" },
  { key: "contact", href: "/contact" },
] as const;

type NavigationKey = (typeof navigation)[number]["key"];

export async function Header({ activePage }: { activePage?: NavigationKey } = {}) {
  const t = await getTranslations("Navigation");

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-background/95 backdrop-blur">
      <Container className="flex min-h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-xl font-bold tracking-[0.16em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          aria-label={t("homeLabel")}
        >
          AMPARGO
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label={t("primaryLabel")}>
          {navigation.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={activePage === item.key ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground ${
                activePage === item.key
                  ? "text-foreground underline decoration-accent decoration-2 underline-offset-8"
                  : "text-muted"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <Link
            href="/quote"
            className="motion-button inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            {t("quote")}
          </Link>
        </div>

        <details className="mobile-menu group relative lg:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 rounded-full border border-black/15 px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground [&::-webkit-details-marker]:hidden">
            <span>{t("menu")}</span>
            <span className="relative h-3.5 w-4" aria-hidden="true">
              <span className="absolute left-0 top-0 h-px w-4 bg-current transition-transform group-open:translate-y-[6px] group-open:rotate-45" />
              <span className="absolute bottom-0 left-0 h-px w-4 bg-current transition-transform group-open:-translate-y-[7px] group-open:-rotate-45" />
            </span>
          </summary>
          <div className="mobile-menu-panel absolute right-0 top-14 max-h-[calc(100svh-6rem)] w-[min(20rem,calc(100vw-2.5rem))] overflow-y-auto rounded-2xl border border-black/10 bg-surface p-4 shadow-xl">
            <nav className="grid" aria-label={t("mobileLabel")}>
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={activePage === item.key ? "page" : undefined}
                  className={`rounded-lg px-3 py-3 text-base font-medium hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    activePage === item.key ? "text-accent" : ""
                  }`}
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-black/10 pt-4">
              <a
                href="tel:+18327940720"
                className="motion-button inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("call")}
              </a>
              <a
                href="https://wa.me/18327940720"
                target="_blank"
                rel="noreferrer"
                className="motion-button inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("whatsapp")}
              </a>
            </div>
            <div className="mt-3 flex items-center gap-3 border-t border-black/10 pt-4">
              <LocaleSwitcher />
              <Link
                href="/quote"
                className="motion-button inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                {t("quote")}
              </Link>
            </div>
          </div>
        </details>
      </Container>
    </header>
  );
}
