import { gsap } from "gsap";
import { useEffect, useRef } from "react";

import { cardHoverEffect, DURATION, EASE, staggerFadeIn } from "../utils/animations";

// Hook for applying animation to an element on mount
export const useAnimateOnMount = (
  animation: "fadeIn" | "slideUp" | "slideRight" = "fadeIn",
  delay = 0,
) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    let tl: gsap.core.Timeline;

    if (animation === "slideUp") {
      tl = gsap.timeline();
      tl.fromTo(
        element,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          delay,
          duration: DURATION.NORMAL,
          ease: EASE.SMOOTH,
          y: 0,
        },
      );
    } else if (animation === "slideRight") {
      tl = gsap.timeline();
      tl.fromTo(
        element,
        { autoAlpha: 0, x: -30 },
        {
          autoAlpha: 1,
          delay,
          duration: DURATION.NORMAL,
          ease: EASE.SMOOTH,
          x: 0,
        },
      );
    } else {
      tl = gsap.timeline();
      tl.fromTo(
        element,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          delay,
          duration: DURATION.NORMAL,
          ease: EASE.SMOOTH,
        },
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
    const animation = staggerFadeIn([...items] as HTMLElement[], 0.1, DURATION.NORMAL);

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
          backdropFilter: "blur(10px)",
          background: "var(--header-bg)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
          height: "55px",
        });
      } else {
        gsap.to(header, {
          backdropFilter: "blur(0px)",
          background: "var(--header-bg)",
          boxShadow: "none",
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
          height: "60px",
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
