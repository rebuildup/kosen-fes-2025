import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  DURATION,
  EASE,
  cardHoverEffect,
  staggerFadeIn,
} from "../utils/animations";

// Hook for applying animation to an element on mount
export const useAnimateOnMount = (
  animation: "fadeIn" | "slideUp" | "slideRight" = "fadeIn",
  delay = 0
) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    let tl: gsap.core.Timeline;

    switch (animation) {
      case "slideUp":
        tl = gsap.timeline();
        tl.fromTo(
          element,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: DURATION.NORMAL,
            delay,
            ease: EASE.SMOOTH,
          }
        );
        break;
      case "slideRight":
        tl = gsap.timeline();
        tl.fromTo(
          element,
          { x: -30, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: DURATION.NORMAL,
            delay,
            ease: EASE.SMOOTH,
          }
        );
        break;
      case "fadeIn":
      default:
        tl = gsap.timeline();
        tl.fromTo(
          element,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: DURATION.NORMAL,
            delay,
            ease: EASE.SMOOTH,
          }
        );
    }

    return () => {
      tl.kill();
    };
  }, [animation, delay]);

  return elementRef;
};

// Hook for staggered animation of multiple elements
export const useStaggerAnimation = (shouldAnimate = true) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !shouldAnimate) return;

    const container = containerRef.current;
    const items = container.children;
    const animation = staggerFadeIn(
      Array.from(items) as HTMLElement[],
      0.1,
      DURATION.NORMAL
    );

    return () => {
      animation.kill();
    };
  }, [shouldAnimate]);

  return containerRef;
};

// Hook for card hover animations
export const useCardHoverAnimation = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const hoverTl = cardHoverEffect(card);

    const handleMouseEnter = () => {
      hoverTl.play();
    };

    const handleMouseLeave = () => {
      hoverTl.reverse();
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      hoverTl.kill();
    };
  }, []);

  return cardRef;
};

// Hook for animating header on scroll
export const useHeaderAnimation = (threshold = 50) => {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const header = headerRef.current;
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > threshold) {
        gsap.to(header, {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: "var(--header-bg)",
          backdropFilter: "blur(10px)",
          height: "55px",
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        });
      } else {
        gsap.to(header, {
          boxShadow: "none",
          background: "var(--header-bg)",
          backdropFilter: "blur(0px)",
          height: "60px",
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return headerRef;
};
