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
  BOUNCE: "back.out(1.4)",
  ELASTIC: "elastic.out(0.5, 0.3)",
  SLOW_MO: "slow(0.7, 0.7, false)",
  SMOOTH: "power2.out",
};

// Opacity animations
export const fadeIn = (element: HTMLElement | string, duration = DURATION.NORMAL, delay = 0) => {
  return gsap.fromTo(
    element,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      clearProps: "all",
      delay,
      duration,
      ease: EASE.SMOOTH,
    },
  );
};

export const fadeOut = (element: HTMLElement | string, duration = DURATION.NORMAL) => {
  return gsap.to(element, {
    autoAlpha: 0,
    duration,
    ease: EASE.SMOOTH,
  });
};

// Movement animations
export const slideInUp = (element: HTMLElement | string, duration = DURATION.NORMAL, delay = 0) => {
  return gsap.fromTo(
    element,
    { autoAlpha: 0, y: 30 },
    {
      autoAlpha: 1,
      clearProps: "all",
      delay,
      duration,
      ease: EASE.SMOOTH,
      y: 0,
    },
  );
};

export const slideInRight = (
  element: HTMLElement | string,
  duration = DURATION.NORMAL,
  delay = 0,
) => {
  return gsap.fromTo(
    element,
    { autoAlpha: 0, x: -30 },
    {
      autoAlpha: 1,
      clearProps: "all",
      delay,
      duration,
      ease: EASE.SMOOTH,
      x: 0,
    },
  );
};

// Stagger animations for lists
export const staggerFadeIn = (
  elements: HTMLElement[] | string,
  stagger = 0.1,
  duration = DURATION.NORMAL,
) => {
  return gsap.fromTo(
    elements,
    { autoAlpha: 0, y: 15 },
    {
      autoAlpha: 1,
      clearProps: "all",
      duration,
      ease: EASE.SMOOTH,
      stagger,
      y: 0,
    },
  );
};

// Hover effect for cards
export const cardHoverEffect = (element: HTMLElement, scale = 1.03) => {
  const tl = gsap.timeline({ paused: true });
  tl.to(element, {
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    duration: DURATION.FAST,
    ease: EASE.SMOOTH,
    scale,
  });
  return tl;
};

// Page transitions
export const pageTransitionIn = () => {
  const tl = gsap.timeline();
  tl.to("body", { duration: 0, overflow: "hidden" }).fromTo(
    ".page-transition-wrapper",
    { opacity: 0 },
    { duration: DURATION.FAST, opacity: 1 },
  );
  return tl;
};

export const pageTransitionOut = () => {
  const tl = gsap.timeline();
  tl.to(".page-transition-wrapper", {
    duration: DURATION.FAST,
    onComplete: () => {
      gsap.to("body", { duration: 0, overflow: "auto" });
    },
    opacity: 0,
  });
  return tl;
};

// Scroll trigger animations
export const createScrollTriggerAnimation = (
  element: string,
  animationType: "fadeIn" | "slideUp" | "slideRight" = "fadeIn",
  settings = {},
) => {
  let animation: gsap.core.Tween;

  const defaultSettings = {
    end: "bottom 20%",
    markers: false,
    start: "top 80%",
    toggleActions: "play none none reverse",
    trigger: element,
  };

  const finalSettings = { ...defaultSettings, ...settings };

  if (animationType === "slideUp") {
    animation = gsap.fromTo(
      element,
      { autoAlpha: 0, y: 50 },
      { autoAlpha: 1, duration: DURATION.NORMAL, ease: EASE.SMOOTH, y: 0 },
    );
  } else if (animationType === "slideRight") {
    animation = gsap.fromTo(
      element,
      { autoAlpha: 0, x: -50 },
      { autoAlpha: 1, duration: DURATION.NORMAL, ease: EASE.SMOOTH, x: 0 },
    );
  } else {
    animation = gsap.fromTo(
      element,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: DURATION.NORMAL, ease: EASE.SMOOTH },
    );
  }

  ScrollTrigger.create({
    animation,
    ...finalSettings,
  });

  return animation;
};
