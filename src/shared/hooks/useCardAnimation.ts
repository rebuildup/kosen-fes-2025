import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../utils/animations";

interface UseCardAnimationOptions {
  variant?: "default" | "compact" | "featured" | "grid" | "list";
  showAnimation?: boolean;
  hasMetaSection?: boolean;
  hasTagsSection?: boolean;
}

interface UseCardAnimationReturn {
  cardRef: React.RefObject<HTMLDivElement>;
  imageRef: React.RefObject<HTMLImageElement>;
  metaRef: React.RefObject<HTMLDivElement>;
  tagsRef: React.RefObject<HTMLDivElement>;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
}

/**
 * Custom hook for card hover animations
 */
export const useCardAnimation = (
  options: UseCardAnimationOptions = {}
): UseCardAnimationReturn => {
  const {
    variant = "default",
    showAnimation = true,
    hasMetaSection = true,
    hasTagsSection = false,
  } = options;

  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);
  
  const isHoveredRef = useRef(false);

  // Set up hover animations
  useEffect(() => {
    if (!cardRef.current || !showAnimation) return;

    const card = cardRef.current;
    const hoverTimeline = gsap.timeline({ paused: true });

    // Calculate animation values based on variant
    const getYOffset = () => {
      switch (variant) {
        case "featured":
          return -8;
        case "compact":
        case "list":
          return -2;
        default:
          return -6;
      }
    };

    const getBoxShadow = () => {
      switch (variant) {
        case "featured":
          return "0 12px 24px rgba(0, 0, 0, 0.2)";
        case "compact":
        case "list":
          return "0 4px 12px rgba(0, 0, 0, 0.1)";
        default:
          return "0 8px 20px rgba(0, 0, 0, 0.15)";
      }
    };

    const getImageScale = () => {
      switch (variant) {
        case "featured":
          return 1.08;
        case "compact":
        case "list":
          return 1.02;
        default:
          return 1.05;
      }
    };

    // Card lift animation
    hoverTimeline.to(card, {
      y: getYOffset(),
      boxShadow: getBoxShadow(),
      duration: DURATION.FAST,
      ease: EASE.SMOOTH,
    });

    // Image scale animation
    if (imageRef.current) {
      hoverTimeline.to(
        imageRef.current,
        {
          scale: getImageScale(),
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        },
        0
      );
    }

    // Meta information fade in (skip for list variant)
    if (metaRef.current && hasMetaSection && variant !== "list") {
      hoverTimeline.to(
        metaRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        },
        0
      );
    }

    // Tags fade in
    if (tagsRef.current && hasTagsSection && variant !== "list") {
      hoverTimeline.to(
        tagsRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        },
        0
      );
    }

    // Store timeline for reuse in handlers
    hoverTimelineRef.current = hoverTimeline;

    return () => {
      hoverTimeline.kill();
      hoverTimelineRef.current = null;
    };
  }, [variant, showAnimation, hasMetaSection, hasTagsSection]);

  // Handle mouse events
  const handleMouseEnter = useCallback(() => {
    if (!showAnimation) return;
    
    isHoveredRef.current = true;
    const timeline = hoverTimelineRef.current;
    if (timeline) {
      timeline.play();
    }
  }, [showAnimation]);

  const handleMouseLeave = useCallback(() => {
    if (!showAnimation) return;
    
    isHoveredRef.current = false;
    const timeline = hoverTimelineRef.current;
    if (timeline) {
      timeline.reverse();
    }
  }, [showAnimation]);

  const setIsHovered = useCallback((hovered: boolean) => {
    isHoveredRef.current = hovered;
  }, []);

  return {
    cardRef,
    imageRef,
    metaRef,
    tagsRef,
    handleMouseEnter,
    handleMouseLeave,
    isHovered: isHoveredRef.current,
    setIsHovered,
  };
};
