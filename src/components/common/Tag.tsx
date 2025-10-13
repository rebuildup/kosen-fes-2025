import { useTag } from "../../context/TagContext";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
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

const Tag = ({
  tag,
  count,
  size = "medium",
  onClick,
  interactive = true,
  role,
  "aria-selected": ariaSelected,
}: TagProps) => {
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
          scale: 1.0,
          duration: DURATION.FAST,
          ease: "back.out(1.7)",
          yoyo: true,
          repeat: 1,
        }
      );
    } else {
      // Animation for when tag becomes inactive
      gsap.to(tagRef.current, {
        scale: 1,
        duration: DURATION.FAST,
        ease: EASE.SMOOTH,
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
          scale: 1,
          duration: DURATION.FAST / 2,
          ease: "back.out(2)",
        }
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
    small: "text-xs px-2 py-0.5",
    medium: "text-sm px-2.5 py-1",
    large: "text-base px-3 py-1.5",
  };

  const baseClasses = `
    inline-flex items-center gap-1 rounded-full font-medium 
    transition-all duration-300 border cursor-pointer
  `;

  // Dynamic styling with Instagram gradient for active state
  const getTagClasses = () => {
    if (isActive) {
      return `
        text-white
        bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)]
        hover:from-[var(--accent-pink)] hover:to-[var(--accent-red)]
      `;
    } else {
      return `
        bg-[var(--bg-secondary)] text-[var(--text-primary)] 
        border-[var(--border-color)]
        hover:bg-[var(--bg-tertiary)] hover:border-[var(--primary-color)]
        hover:text-[var(--primary-color)]
      `;
    }
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${getTagClasses()}`}
      onClick={handleClick}
      type="button"
      role={role}
      aria-selected={ariaSelected !== undefined ? ariaSelected : isActive}
      aria-label={`${tag}${count ? ` (${count})` : ""}`}
      ref={tagRef}
    >
      <span className="font-semibold">#{tag}</span>
      {count !== undefined && (
        <span
          className={`
            ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium
            ${
              isActive
                ? "bg-white/20 text-white"
                : "bg-[var(--primary-color)]/10 text-[var(--primary-color)]"
            }
          `}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default Tag;
