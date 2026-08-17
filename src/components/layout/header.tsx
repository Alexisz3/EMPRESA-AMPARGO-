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

export async function Header() {
  const t = await getTranslations("Navigation");

  return (
    <header className="relative z-20 border-b border-black/10 bg-background/95 backdrop-blur">
      <Container className="flex min-h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-[0.16em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          aria-label={t("homeLabel")}
        >
          AMPARGO
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label={t("primaryLabel")}>
          {navigation.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <Link
            href="/quote"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            {t("quote")}
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 rounded-full border border-black/15 px-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            <span>{t("menu")}</span>
            <span className="relative h-3.5 w-4" aria-hidden="true">
              <span className="absolute left-0 top-0 h-px w-4 bg-current transition-transform group-open:translate-y-[6px] group-open:rotate-45" />
              <span className="absolute bottom-0 left-0 h-px w-4 bg-current transition-transform group-open:-translate-y-[7px] group-open:-rotate-45" />
            </span>
          </summary>
          <div className="absolute right-0 top-14 w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-black/10 bg-surface p-4 shadow-xl">
            <nav className="grid" aria-label={t("mobileLabel")}>
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-base font-medium hover:bg-background"
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex items-center gap-3 border-t border-black/10 pt-4">
              <LocaleSwitcher />
              <Link
                href="/quote"
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background"
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
