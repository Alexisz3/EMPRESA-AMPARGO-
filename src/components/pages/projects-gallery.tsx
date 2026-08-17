"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type ProjectGroup = {
  title: string;
  description: string;
  tag: string;
  images: { src: string; alt: string; portrait?: boolean }[];
};

type Props = {
  groups: ProjectGroup[];
  closeLabel: string;
  nextLabel: string;
  previousLabel: string;
  openLabel: string;
};

export function ProjectsGallery({ groups, closeLabel, nextLabel, previousLabel, openLabel }: Props) {
  const [active, setActive] = useState<{ group: number; image: number } | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const currentGroup = active ? groups[active.group] : null;
  const current = currentGroup && active ? currentGroup.images[active.image] : null;

  const move = useCallback((direction: number) => {
    if (!active || !currentGroup) return;
    setActive({ group: active.group, image: (active.image + direction + currentGroup.images.length) % currentGroup.images.length });
  }, [active, currentGroup]);

  const closeLightbox = useCallback(() => {
    setActive(null);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }, []);

  const finishSwipe = () => {
    if (touchStartRef.current === null || touchEndRef.current === null) return;
    const distance = touchStartRef.current - touchEndRef.current;
    if (Math.abs(distance) >= 48) move(distance > 0 ? 1 : -1);
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); };
  }, [active, closeLightbox, move]);

  return (
    <>
      <div className="space-y-14 sm:space-y-24 lg:space-y-32">
        {groups.map((group, groupIndex) => (
          <section key={group.title} aria-labelledby={`project-${groupIndex}`} data-reveal>
            <div className="grid gap-4 border-t border-black/15 pt-6 md:grid-cols-[0.7fr_1.3fr] md:gap-12 md:pt-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{group.tag}</p>
              <div>
                <h2 id={`project-${groupIndex}`} className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{group.title}</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted sm:mt-4 sm:text-lg sm:leading-8">{group.description}</p>
              </div>
            </div>
            <div data-reveal-group className={`mt-6 grid min-w-0 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2 ${group.images.length >= 3 ? "grid-cols-2 lg:grid-cols-12" : ""}`}>
              {group.images.map((image, imageIndex) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={(event) => { lastTriggerRef.current = event.currentTarget; setActive({ group: groupIndex, image: imageIndex }); }}
                  aria-label={`${openLabel}: ${image.alt}`}
                  data-reveal
                  className={`project-media group relative min-w-0 overflow-hidden rounded-[1.5rem] bg-black/5 text-left transition-transform active:scale-[0.995] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground ${
                    group.images.length >= 3
                      ? imageIndex === 0 ? "col-span-2 aspect-[16/10] sm:aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:aspect-auto lg:min-h-[680px]" : "aspect-[4/3] lg:col-span-5 lg:aspect-auto lg:min-h-[332px]"
                      : image.portrait ? "aspect-[4/5]" : "aspect-[16/10] sm:aspect-[4/3]"
                  }`}
                >
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 55vw, (min-width: 768px) 50vw, calc(100vw - 2.5rem)" className="object-cover" />
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur sm:bottom-4 sm:right-4 sm:px-4 sm:py-2">{imageIndex + 1} / {group.images.length}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {active && current ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={currentGroup?.title}
          className="fixed inset-0 z-50 flex touch-pan-y items-center justify-center bg-black/95 p-4 sm:p-8"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeLightbox(); }}
          onTouchStart={(event) => { touchStartRef.current = event.touches[0]?.clientX ?? null; touchEndRef.current = null; }}
          onTouchMove={(event) => { touchEndRef.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={finishSwipe}
        >
          <button autoFocus type="button" onClick={closeLightbox} aria-label={closeLabel} className="absolute right-4 top-4 z-10 inline-flex min-h-12 items-center rounded-full border border-white/25 bg-black/55 px-5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-7 sm:top-7">{closeLabel} <span aria-hidden="true">&times;</span></button>
          {currentGroup && currentGroup.images.length > 1 ? (
            <>
              <button type="button" onClick={() => move(-1)} aria-label={previousLabel} className="absolute bottom-4 left-4 z-10 grid size-12 place-items-center rounded-full border border-white/25 bg-black/55 text-2xl text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-auto sm:left-7">&larr;</button>
              <button type="button" onClick={() => move(1)} aria-label={nextLabel} className="absolute bottom-4 right-4 z-10 grid size-12 place-items-center rounded-full border border-white/25 bg-black/55 text-2xl text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-auto sm:right-7">&rarr;</button>
            </>
          ) : null}
          <div className="relative h-[72svh] w-[calc(100vw-2rem)] max-w-6xl sm:h-[82vh] sm:w-[88vw]">
            <Image src={current.src} alt={current.alt} fill sizes="90vw" className="object-contain" priority />
          </div>
          <p className="absolute bottom-6 left-1/2 max-w-[58vw] -translate-x-1/2 text-center text-sm text-white/75 sm:bottom-4 sm:max-w-none">{currentGroup?.title} &middot; {active.image + 1} / {currentGroup?.images.length}</p>
        </div>
      ) : null}
    </>
  );
}
