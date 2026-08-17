"use client";

import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";

import { useLocaleNavigation } from "./locale-navigation";

export function LocaleSwitcher() {
  const { changeLocale, locale } = useLocaleNavigation();
  const t = useTranslations("LocaleSwitcher");
  const nextLocale: AppLocale = locale === "en" ? "es" : "en";

  return (
    <button
      type="button"
      onClick={() => changeLocale(nextLocale)}
      className="motion-button inline-flex min-h-12 items-center rounded-full border border-black/15 px-4 text-sm font-semibold hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground lg:min-h-11"
      aria-label={t("label", { language: t(nextLocale) })}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
