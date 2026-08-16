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
const RESUME_AUTO_SCROLL_MS = 1800;
const DRAG_THRESHOLD_PX = 6;

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
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const loopWidthRef = useRef(0);
  const pausedRef = useRef(false);
  const userInteractingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const lastTimeRef = useRef(0);
  const resumeTimeoutRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const motionReduced = useReducedMotion();

  const shouldAutoScroll = publications.length > 1 && !prefersReducedMotion;
  const displayPublications = shouldAutoScroll
    ? [...publications, ...publications]
    : publications;
  const animationDuration = Math.max(publications.length * SECONDS_PER_CARD, 40);

  useEffect(() => {
    if (!shouldAutoScroll) return;

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const clearResumeTimeout = () => {
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = null;
      }
    };

    const scheduleAutoScrollResume = () => {
      clearResumeTimeout();
      resumeTimeoutRef.current = window.setTimeout(() => {
        userInteractingRef.current = false;
        pausedRef.current = false;
        resumeTimeoutRef.current = null;
      }, RESUME_AUTO_SCROLL_MS);
    };

    const measureLoop = () => {
      loopWidthRef.current = track.scrollWidth / 2;
    };

    const normalizeOffset = () => {
      const loopWidth = loopWidthRef.current;
      if (!loopWidth) return;

      while (offsetRef.current >= loopWidth) {
        offsetRef.current -= loopWidth;
      }
      while (offsetRef.current < 0) {
        offsetRef.current += loopWidth;
      }
    };

    const applyOffset = () => {
      normalizeOffset();
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    };

    measureLoop();
    applyOffset();

    const resizeObserver = new ResizeObserver(() => {
      measureLoop();
      applyOffset();
    });
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

      const isPaused =
        pausedRef.current || userInteractingRef.current || isDraggingRef.current;
      const targetSpeed = isPaused ? 0 : getTargetSpeed();
      const easing = isPaused ? DECELERATION_RATE : ACCELERATION_RATE;
      const step = Math.min(1, delta * easing);

      velocityRef.current += (targetSpeed - velocityRef.current) * step;

      if (velocityRef.current > 0 && !isPaused) {
        offsetRef.current += velocityRef.current * delta;
        applyOffset();
      }

      frame = requestAnimationFrame(tick);
    };

    let frame = requestAnimationFrame(tick);

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      dragStartXRef.current = event.clientX;
      dragStartOffsetRef.current = offsetRef.current;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = event.clientX - dragStartXRef.current;
      if (!hasDraggedRef.current && Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;

      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true;
        userInteractingRef.current = true;
        pausedRef.current = true;
        velocityRef.current = 0;
        viewport.setPointerCapture(event.pointerId);
        viewport.classList.add("cursor-grabbing");
        viewport.classList.remove("cursor-grab");
      }

      offsetRef.current = dragStartOffsetRef.current - deltaX;
      applyOffset();
    };

    const endDrag = (event: PointerEvent) => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;

      if (hasDraggedRef.current) {
        viewport.releasePointerCapture(event.pointerId);
        viewport.classList.add("cursor-grab");
        viewport.classList.remove("cursor-grabbing");
        scheduleAutoScrollResume();
      }

      hasDraggedRef.current = false;
    };

    const onWheel = (event: WheelEvent) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.shiftKey
            ? event.deltaY
            : 0;

      if (delta === 0) return;

      event.preventDefault();
      userInteractingRef.current = true;
      pausedRef.current = true;
      velocityRef.current = 0;
      offsetRef.current += delta;
      applyOffset();
      scheduleAutoScrollResume();
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(frame);
      clearResumeTimeout();
      resizeObserver.disconnect();
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("wheel", onWheel);
      viewport.classList.remove("cursor-grab", "cursor-grabbing");
      track.style.transform = "";
      velocityRef.current = 0;
      offsetRef.current = 0;
      lastTimeRef.current = 0;
    };
  }, [shouldAutoScroll, animationDuration, publications]);

  if (!publications.length) return null;

  const pauseForHover = () => {
    if (userInteractingRef.current || isDraggingRef.current) return;
    pausedRef.current = true;
  };

  const resumeFromHover = () => {
    if (userInteractingRef.current || isDraggingRef.current) return;
    pausedRef.current = false;
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
        ref={viewportRef}
        className={cn(
          "w-full min-w-0 pb-2",
          shouldAutoScroll
            ? "cursor-grab select-none overflow-hidden"
            : "overflow-x-auto",
          !shouldAutoScroll &&
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          shouldAutoScroll && "[touch-action:pan-y]",
        )}
        onMouseEnter={shouldAutoScroll ? pauseForHover : undefined}
        onMouseLeave={shouldAutoScroll ? resumeFromHover : undefined}
        onFocusCapture={shouldAutoScroll ? pauseForHover : undefined}
        onBlurCapture={
          shouldAutoScroll
            ? (event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  resumeFromHover();
                }
              }
            : undefined
        }
      >
        <div
          ref={trackRef}
          className={cn(
            "flex w-max gap-5 container-px",
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
