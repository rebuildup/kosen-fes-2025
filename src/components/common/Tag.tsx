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
      // Animation for when tag becomes active
      gsap.fromTo(
        tagRef.current,
        { scale: 0.95 },
        {
          scale: 1,
          duration: DURATION.FAST,
          ease: "back.out(1.7)",
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

    // Click animation
    if (tagRef.current) {
      gsap.fromTo(
        tagRef.current,
        { scale: 0.9 },
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
    large: "text-base px-3 py-1.5"
  };

  const baseClasses = "inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200 border cursor-pointer";
  const inactiveClasses = "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600";
  const activeClasses = "bg-[var(--accent)] text-white border-[var(--accent)] hover:bg-[var(--accent)]/90";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={handleClick}
      type="button"
      role={role}
      aria-selected={ariaSelected !== undefined ? ariaSelected : isActive}
      aria-label={`${tag}${count ? ` (${count})` : ""}`}
      ref={tagRef}
    >
      <span>#{tag}</span>
      {count !== undefined && <span className="ml-1 px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded text-xs">{count}</span>}
    </button>
  );
};

export default Tag;
