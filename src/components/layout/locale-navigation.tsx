"use client";

import { useLayoutEffect } from "react";
import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

type AnchorDescriptor =
  | { kind: "data"; value: string }
  | { kind: "id"; value: string }
  | { kind: "labelled"; value: string }
  | { kind: "structural"; value: number };

type PendingLocaleScroll = {
  absoluteY: number;
  anchor: AnchorDescriptor | null;
  anchorViewportTop: number | null;
  createdAt: number;
  progress: number;
  targetLocale: AppLocale;
  targetPathname: string;
};

const STORAGE_KEY = "ampargo:locale-scroll";
const MAX_PENDING_AGE = 10_000;
const MAX_RESTORE_FRAMES = 30;
const MAX_WAIT_FRAMES = 180;
const MIN_RESTORE_FRAMES = 10;
const START_THRESHOLD = 64;

let memoryPending: PendingLocaleScroll | null = null;
let activeRestorationTimer = 0;

function getStructuralAnchors() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      "main section, main article[id], main form[id], footer",
    ),
  );
}

function describeAnchor(
  element: HTMLElement,
  structuralAnchors: HTMLElement[],
): AnchorDescriptor | null {
  const dataAnchor = element.dataset.localeScrollAnchor;

  if (dataAnchor) return { kind: "data", value: dataAnchor };
  if (element.id) return { kind: "id", value: element.id };

  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) return { kind: "labelled", value: labelledBy };

  const index = structuralAnchors.indexOf(element);
  return index >= 0 ? { kind: "structural", value: index } : null;
}

function findAnchor(descriptor: AnchorDescriptor) {
  if (descriptor.kind === "id") {
    return document.getElementById(descriptor.value);
  }

  if (descriptor.kind === "data") {
    return Array.from(
      document.querySelectorAll<HTMLElement>("[data-locale-scroll-anchor]"),
    ).find(
      (element) => element.dataset.localeScrollAnchor === descriptor.value,
    ) ?? null;
  }

  if (descriptor.kind === "labelled") {
    return Array.from(
      document.querySelectorAll<HTMLElement>("[aria-labelledby]"),
    ).find(
      (element) =>
        element.getAttribute("aria-labelledby") === descriptor.value,
    ) ?? null;
  }

  return getStructuralAnchors()[descriptor.value] ?? null;
}

function captureVisibleAnchor() {
  const structuralAnchors = getStructuralAnchors();
  const referenceLine = Math.min(160, window.innerHeight * 0.2);
  const candidates = structuralAnchors
    .map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .filter(({ rect }) => rect.height > 0 && rect.width > 0);
  const containing = candidates
    .filter(
      ({ rect }) => rect.top <= referenceLine && rect.bottom > referenceLine,
    )
    .sort((a, b) => b.rect.top - a.rect.top);
  const closest = [...candidates].sort(
    (a, b) =>
      Math.abs(a.rect.top - referenceLine) -
      Math.abs(b.rect.top - referenceLine),
  );
  const selected = containing[0] ?? closest[0];

  if (!selected) return null;

  const descriptor = describeAnchor(selected.element, structuralAnchors);
  return descriptor
    ? { descriptor, viewportTop: selected.rect.top }
    : null;
}

function savePendingScroll(pending: PendingLocaleScroll) {
  memoryPending = pending;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  } catch {
    // The in-memory value still covers normal client-side locale navigation.
  }
}

function readPendingScroll() {
  if (memoryPending) return memoryPending;

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as PendingLocaleScroll) : null;
  } catch {
    return null;
  }
}

function clearPendingScroll() {
  memoryPending = null;

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing else is required when storage is unavailable.
  }
}

function captureLocaleScroll(
  targetLocale: AppLocale,
  targetPathname: string,
) {
  const maxScroll = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    0,
  );
  const visibleAnchor = captureVisibleAnchor();

  savePendingScroll({
    absoluteY: window.scrollY,
    anchor: visibleAnchor?.descriptor ?? null,
    anchorViewportTop: visibleAnchor?.viewportTop ?? null,
    createdAt: Date.now(),
    progress: maxScroll > 0 ? window.scrollY / maxScroll : 0,
    targetLocale,
    targetPathname,
  });
}

function getNavigationHref(pathname: string) {
  return `${pathname}${window.location.search}${window.location.hash}`;
}

function startLocaleScrollRestoration(
  targetLocale: AppLocale,
  targetPathname: string,
) {
  window.clearTimeout(activeRestorationTimer);

  let restoreFrames = 0;
  let stableFrames = 0;
  let waitFrames = 0;

  function restore() {
    const pending = readPendingScroll();

    if (!pending) return;

    const isExpired = Date.now() - pending.createdAt > MAX_PENDING_AGE;
    const matchesDestination =
      pending.targetLocale === targetLocale &&
      pending.targetPathname === targetPathname;

    if (isExpired || !matchesDestination) {
      clearPendingScroll();
      return;
    }

    if (document.documentElement.lang !== targetLocale) {
      waitFrames += 1;

      if (waitFrames >= MAX_WAIT_FRAMES) {
        clearPendingScroll();
        return;
      }

      activeRestorationTimer = window.setTimeout(restore, 16);
      return;
    }

    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      0,
    );
    const anchor = pending.anchor ? findAnchor(pending.anchor) : null;
    let targetY: number;

    if (anchor && pending.anchorViewportTop !== null) {
      targetY =
        window.scrollY +
        anchor.getBoundingClientRect().top -
        pending.anchorViewportTop;
    } else if (pending.absoluteY <= START_THRESHOLD) {
      targetY = pending.absoluteY;
    } else {
      targetY = pending.progress * maxScroll;
    }

    targetY = Math.min(Math.max(targetY, 0), maxScroll);

    if (Math.abs(window.scrollY - targetY) > 0.5) {
      window.scrollTo({ left: window.scrollX, top: targetY, behavior: "auto" });
      stableFrames = 0;
    } else {
      stableFrames += 1;
    }

    restoreFrames += 1;

    if (
      (stableFrames >= 3 && restoreFrames >= MIN_RESTORE_FRAMES) ||
      restoreFrames >= MAX_RESTORE_FRAMES
    ) {
      clearPendingScroll();
      return;
    }

    activeRestorationTimer = window.setTimeout(restore, 16);
  }

  restore();
}

export function useLocaleNavigation() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  function changeLocale(
    targetLocale: AppLocale,
    historyMode: "push" | "replace" = "replace",
  ) {
    if (targetLocale === locale) return;

    captureLocaleScroll(targetLocale, pathname);
    router[historyMode](getNavigationHref(pathname), {
      locale: targetLocale,
      scroll: false,
    });
    startLocaleScrollRestoration(targetLocale, pathname);
  }

  return { changeLocale, locale, pathname };
}

export function LocaleScrollRestoration() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();

  useLayoutEffect(() => {
    startLocaleScrollRestoration(locale, pathname);
  }, [locale, pathname]);

  return null;
}
