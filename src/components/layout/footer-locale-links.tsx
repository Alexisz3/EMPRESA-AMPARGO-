"use client";

import { Link, usePathname } from "@/i18n/navigation";

export function FooterLocaleLinks({ label }: { label: string }) {
  const pathname = usePathname();
  return (
    <span className="flex items-center gap-2" aria-label={label}>
      <Link href={pathname} locale="en" className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">English</Link>
      <span aria-hidden="true">|</span>
      <Link href={pathname} locale="es" className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Español</Link>
    </span>
  );
}
