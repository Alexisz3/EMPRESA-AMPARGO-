import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { Container } from "../ui/container";
import { FooterLocaleLinks } from "./footer-locale-links";

const quickLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "projects", href: "/projects" },
  { key: "contact", href: "/contact" },
] as const;

const serviceLinks = [
  { key: "remodeling", href: "/services#remodeling" },
  { key: "construction", href: "/services#construction" },
  { key: "designPlanning", href: "/services#design-planning" },
  { key: "maintenance", href: "/services#additional-services" },
] as const;

export async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t border-white/10 bg-[#151b19] text-white">
      <Container>
        <div className="grid gap-12 py-16 sm:grid-cols-2 sm:py-20 lg:grid-cols-[1.35fr_0.8fr_1fr_1fr] lg:gap-16">
          <div>
            <Link
              href="/"
              className="inline-flex text-xl font-bold tracking-[0.16em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              AMPARGO
            </Link>
            <p className="mt-5 max-w-sm leading-7 text-white/60">
              {t("description")}
            </p>
          </div>

          <nav aria-label={t("quickLinksLabel")}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d18a62]">
              {t("quickLinksLabel")}
            </h2>
            <ul className="mt-5 grid gap-3">
              {quickLinks.map((item) => (
                <li key={item.key}>
                  <Link className="text-white/70 transition-colors hover:text-white" href={item.href}>
                    {t(`quickLinks.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("servicesLabel")}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d18a62]">
              {t("servicesLabel")}
            </h2>
            <ul className="mt-5 grid gap-3">
              {serviceLinks.map((service) => (
                <li key={service.key}>
                  <Link className="text-white/70 transition-colors hover:text-white" href={service.href}>
                    {t(`services.${service.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d18a62]">
              {t("contactLabel")}
            </h2>
            <p className="mt-5 text-white/70">Houston, TX</p>
            <div className="mt-5 grid gap-5">
              <p>
                <span className="block font-semibold">Joe Andrade</span>
                <a className="mt-1 inline-flex text-white/70 transition-colors hover:text-white" href="tel:+18327940720">
                  (832) 794-0720
                </a>
              </p>
              <p>
                <span className="block font-semibold">Mario Parra</span>
                <a className="mt-1 inline-flex text-white/70 transition-colors hover:text-white" href="tel:+18326524660">
                  (832) 652-4660
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 py-7 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright")}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link href="/privacy" className="transition-colors hover:text-white">
              {t("privacy")}
            </Link>
            <FooterLocaleLinks label={t("languagesLabel")} />
          </div>
        </div>
      </Container>
    </footer>
  );
}
