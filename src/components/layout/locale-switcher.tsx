"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");
  const nextLocale: AppLocale = locale === "en" ? "es" : "en";

  function changeLocale() {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <button
      type="button"
      onClick={changeLocale}
      className="motion-button inline-flex min-h-12 items-center rounded-full border border-black/15 px-4 text-sm font-semibold hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground lg:min-h-11"
      aria-label={t("label", { language: t(nextLocale) })}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
