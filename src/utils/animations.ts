import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins
gsap.registerPlugin(ScrollTrigger);

// Animation durations
export const DURATION = {
  FAST: 0.2,
  NORMAL: 0.4,
  SLOW: 0.8,
};

// Common easings
export const EASE = {
  SMOOTH: "power2.out",
  BOUNCE: "back.out(1.4)",
  ELASTIC: "elastic.out(0.5, 0.3)",
  SLOW_MO: "slow(0.7, 0.7, false)",
};

// Opacity animations
export const fadeIn = (
  element: HTMLElement | string,
  duration = DURATION.NORMAL,
  delay = 0
) => {
  return gsap.fromTo(
    element,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration,
      delay,
      ease: EASE.SMOOTH,
      clearProps: "all",
    }
  );
};

export const fadeOut = (
  element: HTMLElement | string,
  duration = DURATION.NORMAL
) => {
  return gsap.to(element, {
    autoAlpha: 0,
    duration,
    ease: EASE.SMOOTH,
  });
};

// Movement animations
export const slideInUp = (
  element: HTMLElement | string,
  duration = DURATION.NORMAL,
  delay = 0
) => {
  return gsap.fromTo(
    element,
    { y: 30, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration,
      delay,
      ease: EASE.SMOOTH,
      clearProps: "all",
    }
  );
};

export const slideInRight = (
  element: HTMLElement | string,
  duration = DURATION.NORMAL,
  delay = 0
) => {
  return gsap.fromTo(
    element,
    { x: -30, autoAlpha: 0 },
    {
      x: 0,
      autoAlpha: 1,
      duration,
      delay,
      ease: EASE.SMOOTH,
      clearProps: "all",
    }
  );
};

// Stagger animations for lists
export const staggerFadeIn = (
  elements: HTMLElement[] | string,
  stagger = 0.1,
  duration = DURATION.NORMAL
) => {
  return gsap.fromTo(
    elements,
    { autoAlpha: 0, y: 15 },
    {
      autoAlpha: 1,
      y: 0,
      duration,
      stagger,
      ease: EASE.SMOOTH,
      clearProps: "all",
    }
  );
};

// Hover effect for cards
export const cardHoverEffect = (element: HTMLElement, scale = 1.03) => {
  const tl = gsap.timeline({ paused: true });
  tl.to(element, {
    scale,
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    duration: DURATION.FAST,
    ease: EASE.SMOOTH,
  });
  return tl;
};

// Page transitions
export const pageTransitionIn = () => {
  const tl = gsap.timeline();
  tl.to("body", { duration: 0, overflow: "hidden" }).fromTo(
    ".page-transition-wrapper",
    { opacity: 0 },
    { opacity: 1, duration: DURATION.FAST }
  );
  return tl;
};

export const pageTransitionOut = () => {
  const tl = gsap.timeline();
  tl.to(".page-transition-wrapper", {
    opacity: 0,
    duration: DURATION.FAST,
    onComplete: () => {
      gsap.to("body", { duration: 0, overflow: "auto" });
    },
  });
  return tl;
};

// Scroll trigger animations
export const createScrollTriggerAnimation = (
  element: string,
  animationType: "fadeIn" | "slideUp" | "slideRight" = "fadeIn",
  settings = {}
) => {
  let animation;

  const defaultSettings = {
    trigger: element,
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
    markers: false,
  };

  const finalSettings = { ...defaultSettings, ...settings };

  switch (animationType) {
    case "slideUp":
      animation = gsap.fromTo(
        element,
        { y: 50, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: DURATION.NORMAL, ease: EASE.SMOOTH }
      );
      break;
    case "slideRight":
      animation = gsap.fromTo(
        element,
        { x: -50, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: DURATION.NORMAL, ease: EASE.SMOOTH }
      );
      break;
    case "fadeIn":
    default:
      animation = gsap.fromTo(
        element,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: DURATION.NORMAL, ease: EASE.SMOOTH }
      );
  }

  ScrollTrigger.create({
    animation,
    ...finalSettings,
  });

  return animation;
};
