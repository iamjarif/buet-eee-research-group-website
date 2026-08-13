import { DISTANCE } from "./constants";
import { transitionHero, transitionSection, transitionUI } from "./transitions";

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitionSection,
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: DISTANCE.md },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionSection,
  },
};

export const fadeUpSubtle = {
  hidden: { opacity: 0, y: DISTANCE.sm },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionSection,
  },
};

export const fadeUpHero = {
  hidden: { opacity: 0, y: DISTANCE.lg },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionHero,
  },
};

export const lineReveal = {
  hidden: { scaleX: 0, opacity: 0.6 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: transitionUI,
  },
};

export const imageReveal = {
  hidden: { opacity: 0, scale: 1.03 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionSection,
  },
};

export const headerItem = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionUI,
  },
};

export function createStaggerContainer(stagger = 0.1, delayChildren = 0) {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  };
}

export const heroSequence = createStaggerContainer(0.12, 0.15);
export const sectionSequence = createStaggerContainer(0.1, 0.05);
export const footerSequence = createStaggerContainer(0.08, 0);
