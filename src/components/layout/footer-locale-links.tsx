"use client";

import type { MouseEvent } from "react";

import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

import { useLocaleNavigation } from "./locale-navigation";

export function FooterLocaleLinks({ label }: { label: string }) {
  const { changeLocale, locale, pathname } = useLocaleNavigation();

  function handleLocaleClick(
    event: MouseEvent<HTMLAnchorElement>,
    targetLocale: AppLocale,
  ) {
    if (
      targetLocale === locale ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    changeLocale(targetLocale, "push");
  }

  return (
    <span className="flex items-center gap-2" aria-label={label}>
      <Link href={pathname} locale="en" scroll={false} onClick={(event) => handleLocaleClick(event, "en")} className="inline-flex min-h-11 items-center transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">English</Link>
      <span aria-hidden="true">|</span>
      <Link href={pathname} locale="es" scroll={false} onClick={(event) => handleLocaleClick(event, "es")} className="inline-flex min-h-11 items-center transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Español</Link>
    </span>
  );
}
