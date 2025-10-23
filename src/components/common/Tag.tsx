import { gsap } from "gsap";
import { useEffect, useRef } from "react";

import { useTag } from "../../context/TagContext";
import { DURATION, EASE } from "../../utils/animations";

interface TagProps {
  tag: string;
  count?: number;
  size?: "small" | "medium" | "large";
  onClick?: (tag: string) => void;
  interactive?: boolean;
  role?: string;
  "aria-selected"?: boolean;
}

const Tag = ({ count, interactive = true, onClick, role, size = "medium", tag }: TagProps) => {
  const { isTagSelected, selectTag } = useTag();
  const tagRef = useRef<HTMLButtonElement>(null);

  const isActive = isTagSelected(tag);

  // Apply animation when tag becomes active or inactive
  useEffect(() => {
    if (!tagRef.current) return;

    if (isActive) {
      // Animation for when tag becomes active with scale and glow effect
      gsap.fromTo(
        tagRef.current,
        { scale: 1 },
        {
          duration: DURATION.FAST,
          ease: "back.out(1.7)",
          repeat: 1,
          scale: 1,
          yoyo: true,
        },
      );
    } else {
      // Animation for when tag becomes inactive
      gsap.to(tagRef.current, {
        duration: DURATION.FAST,
        ease: EASE.SMOOTH,
        scale: 1,
      });
    }
  }, [isActive]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Enhanced click animation with ripple effect
    if (tagRef.current) {
      gsap.fromTo(
        tagRef.current,
        { scale: 1 },
        {
          duration: DURATION.FAST / 2,
          ease: "back.out(2)",
          scale: 1,
        },
      );
    }

    if (onClick) {
      onClick(tag);
    } else if (interactive) {
      selectTag(tag);
    }
  };

  // TailwindCSS classes based on size and state
  const sizeClasses = {
    large: "text-base px-3 py-1.5",
    medium: "text-sm px-2.5 py-1",
    small: "text-xs px-2 py-0.5",
  };

  const baseClasses = `
    inline-flex items-center gap-1 rounded-full font-medium 
    transition-all duration-300 border cursor-pointer
  `;

  // Dynamic styling with Instagram gradient for active state
  const getTagClasses = () => {
    return isActive
      ? `
        text-white
        bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)]
        hover:from-[var(--accent-pink)] hover:to-[var(--accent-red)]
      `
      : `
        bg-[var(--bg-secondary)] text-[var(--text-primary)] 
        border-[var(--border-color)]
        hover:bg-[var(--bg-tertiary)] hover:border-[var(--primary-color)]
        hover:text-[var(--primary-color)]
      `;
  };

  const ariaLabel = count === undefined ? tag : `${tag} (${count})`;

  return (
    <button
      type="button"
      className={`${baseClasses} ${sizeClasses[size]} ${getTagClasses()}`}
      onClick={handleClick}
      role={role}
      aria-label={ariaLabel}
      ref={tagRef}
    >
      <span className="font-semibold">#{tag}</span>
      {count !== undefined && (
        <span
          className={`ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${
            isActive
              ? "bg-white/20 text-white"
              : "bg-[var(--primary-color)]/10 text-[var(--primary-color)]"
          } `}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default Tag;
