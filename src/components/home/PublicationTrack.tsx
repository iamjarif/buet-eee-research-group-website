"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";

import { PublicationCard } from "@/components/home/PublicationCard";
import { transitionHero } from "@/lib/motion/transitions";
import { fadeUpHero } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";
import type { PublicationSummary } from "../../../sanity/types";

type PublicationTrackProps = {
  publications?: PublicationSummary[];
};

const SECONDS_PER_CARD = 14;
const DECELERATION_RATE = 10;
const ACCELERATION_RATE = 3.5;

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionPreference() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => false,
  );
}

export function PublicationTrack({ publications = [] }: PublicationTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const loopWidthRef = useRef(0);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const motionReduced = useReducedMotion();

  const shouldAutoScroll = publications.length > 1 && !prefersReducedMotion;
  const displayPublications = shouldAutoScroll
    ? [...publications, ...publications]
    : publications;
  const animationDuration = Math.max(publications.length * SECONDS_PER_CARD, 40);

  useEffect(() => {
    if (!shouldAutoScroll) return;

    const track = trackRef.current;
    if (!track) return;

    const measureLoop = () => {
      loopWidthRef.current = track.scrollWidth / 2;
    };

    measureLoop();

    const resizeObserver = new ResizeObserver(measureLoop);
    resizeObserver.observe(track);

    const getTargetSpeed = () => {
      const loopWidth = loopWidthRef.current;
      if (!loopWidth) return 0;
      return loopWidth / animationDuration;
    };

    const tick = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;

      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      const targetSpeed = pausedRef.current ? 0 : getTargetSpeed();
      const easing = pausedRef.current ? DECELERATION_RATE : ACCELERATION_RATE;
      const step = Math.min(1, delta * easing);

      velocityRef.current += (targetSpeed - velocityRef.current) * step;
      offsetRef.current -= velocityRef.current * delta;

      const loopWidth = loopWidthRef.current;
      if (loopWidth > 0) {
        while (offsetRef.current <= -loopWidth) offsetRef.current += loopWidth;
        while (offsetRef.current > 0) offsetRef.current -= loopWidth;
      }

      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      frame = requestAnimationFrame(tick);
    };

    let frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      track.style.transform = "";
      offsetRef.current = 0;
      velocityRef.current = 0;
      lastTimeRef.current = 0;
    };
  }, [shouldAutoScroll, animationDuration, publications]);

  if (!publications.length) return null;

  const setPaused = (paused: boolean) => {
    pausedRef.current = paused;
  };

  const SectionWrapper = motionReduced ? "section" : motion.section;

  const sectionProps = motionReduced
    ? {}
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        variants: fadeUpHero,
        transition: { ...transitionHero, delay: 0.75 },
      };

  return (
    <SectionWrapper
      aria-label="Featured publications"
      className="overflow-hidden bg-surface-base pb-16 lg:pb-20"
      {...sectionProps}
    >
      <div
        className={cn(
          "w-full",
          shouldAutoScroll ? "overflow-hidden" : "overflow-x-auto pb-2",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setPaused(false);
          }
        }}
      >
        <div
          ref={shouldAutoScroll ? trackRef : undefined}
          className={cn(
            "flex w-max gap-5 px-5 sm:px-8 lg:px-[var(--spacing-container-x)]",
            shouldAutoScroll && "will-change-transform",
          )}
        >
          {displayPublications.map((publication, index) => (
            <PublicationCard
              key={`${publication._id}-${index}`}
              publication={publication}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

export default PublicationTrack;
