"use client";

import { useState, useCallback, useRef, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Project = {
  id: string;
  index: string;
  title: string;
  category: string;
  src: string;
  imagePosition: string;
  sizes: string;
  alt: string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

// The server cannot know the visitor's preference, so it renders the animated
// markup and React swaps in the real value after hydration. Reading matchMedia
// during render instead would make the server and client HTML disagree for
// exactly the people who asked for less motion.
const getReducedMotionOnServer = () => false;

type Props = {
  eyebrow: string;
  sectionTitle: string;
  description: string;
  viewAll: string;
  projects: Project[];
};

export function FeaturedProjectsInteractive({
  eyebrow,
  sectionTitle,
  description,
  viewAll,
  projects,
}: Props) {
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState<number | null>(null);
  const [entering, setEntering] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );

  // Intersection observer for section reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8%", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index === active || entering) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      setPrevActive(active);
      setEntering(true);
      setActive(index);
      timerRef.current = setTimeout(() => {
        setEntering(false);
        setPrevActive(null);
      }, 560);
    },
    [active, entering]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const current = projects[active];
  const total = projects.length;
  const progressPct = ((active + 1) / total) * 100;

  return (
    <section
      ref={sectionRef}
      id="featured-projects"
      className="bg-foreground py-16 text-background sm:py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div
          className={`grid gap-7 transition-all duration-700 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12 ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: revealed ? "0ms" : "0ms" }}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-on-dark">
              {eyebrow}
            </p>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {sectionTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              {description}
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex min-h-11 w-fit items-center gap-2 text-base font-semibold text-white underline-offset-4 transition-colors hover:text-accent-on-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {viewAll} <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Progressive enhancement: if no JS, force mobile stack layout on all screens */}
        <noscript>
          <style>{`
            .js-desktop-projects { display: none !important; }
            .no-js-stack { display: grid !important; }
          `}</style>
        </noscript>

        {/* Interactive project viewer — desktop */}
        <div className="js-desktop-projects mt-16 hidden lg:grid lg:grid-cols-[280px_1fr] lg:gap-0 xl:grid-cols-[320px_1fr]">
          {/* Index column */}
          <div className="flex flex-col justify-center border-r border-white/10 pr-10">
            <ol aria-label="Projects" className="space-y-1">
              {projects.map((project, i) => (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={active === i ? "true" : undefined}
                    aria-controls="project-image-panel"
                    aria-label={`View project: ${project.title}`}
                    className={`group flex w-full min-h-[52px] items-start gap-4 rounded-lg px-3 py-4 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      active === i
                        ? "text-white"
                        : "text-white/40 hover:text-white/75"
                    }`}
                  >
                    <span
                      className={`mt-0.5 min-w-[2.25rem] text-xs font-semibold tracking-[0.18em] transition-colors duration-200 ${
                        active === i ? "text-accent-on-dark" : "text-white/30 group-hover:text-white/50"
                      }`}
                    >
                      {project.index}
                    </span>
                    <span className="text-base font-semibold leading-snug tracking-[-0.015em]">
                      {project.title}
                    </span>
                  </button>
                  {/* Thin separator */}
                  {i < projects.length - 1 && (
                    <div className="mx-3 h-px bg-white/8" />
                  )}
                </li>
              ))}
            </ol>

            {/* Editorial progress indicator */}
            <div className="mt-10 px-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-[0.18em] text-accent-on-dark">
                  {current.index}
                </span>
                <span className="text-xs font-medium text-white/35 tracking-[0.12em]">
                  {String(total).padStart(2, "0")}
                </span>
              </div>
              <div className="h-px w-full bg-white/12 overflow-hidden rounded-full">
                <div
                  className="proj-progress-fill h-full bg-accent-on-dark rounded-full"
                  style={{
                    transform: `scaleX(${progressPct / 100})`,
                    transformOrigin: "left center",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Image panel — two-layer system: outgoing stays visible underneath */}
          <div id="project-image-panel" aria-live="polite" className="relative aspect-[4/3] overflow-hidden bg-black/30 lg:aspect-auto lg:min-h-[580px]">
            {/* Outgoing layer — stays visible while incoming reveals on top */}
            {prevActive !== null && entering && (
              <div
                className="absolute inset-0"
                style={{ zIndex: 0 }}
                aria-hidden="true"
              >
                <Image
                  src={projects[prevActive].src}
                  alt=""
                  fill
                  sizes={projects[prevActive].sizes}
                  className={`object-cover ${projects[prevActive].imagePosition}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
              </div>
            )}

            {/* Incoming / active layer — clip-path reveal on top */}
            <div
              className={`absolute inset-0 ${
                reducedMotion
                  ? ""
                  : entering
                  ? "proj-image-reveal is-entering"
                  : "proj-image-reveal"
              }`}
              style={{ zIndex: 1 }}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes={current.sizes}
                className={`object-cover ${current.imagePosition}`}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

              {/* Project info overlay */}
              <div className="absolute inset-x-0 bottom-0 p-8 xl:p-10">
                <div className="flex items-end justify-between">
                  <div
                    key={`title-${active}`}
                    className={reducedMotion ? "" : "proj-in"}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-on-dark mb-2">
                      {current.category}
                    </p>
                    <span className="text-2xl font-semibold tracking-[-0.02em] text-white xl:text-3xl">
                      {current.title}
                    </span>
                  </div>
                  <span className="text-[4.5rem] font-semibold leading-none tracking-[-0.06em] text-white/12 xl:text-[5.5rem]">
                    {current.index}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile — vertical stack (existing behavior, plus no-JS fallback) */}
        <div className="no-js-stack mt-12 grid gap-4 md:grid-cols-2 lg:hidden">
          {projects.map((project, i) => (
            <Link
              key={project.id}
              href="/projects"
              className={`group relative block min-h-0 overflow-hidden rounded-[1.5rem] bg-black/20 aspect-[4/3] transition-all duration-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                revealed
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: revealed ? `${i * 80}ms` : "0ms" }}
            >
              <figure className="h-full w-full">
                <Image
                  src={project.src}
                  alt={project.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={`object-cover ${project.imagePosition} transition-transform duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent transition-opacity duration-[560ms] group-hover:opacity-[0.82]" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-on-dark mb-1">
                    {project.index}
                  </p>
                  <span className="text-lg font-semibold tracking-[-0.015em] text-white">
                    {project.title}
                  </span>
                </figcaption>
              </figure>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
