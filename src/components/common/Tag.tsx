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
          backgroundColor: "var(--secondary)",
          color: "white",
          duration: DURATION.FAST,
          ease: "back.out(1.7)",
        }
      );
    } else {
      // Animation for when tag becomes inactive
      gsap.to(tagRef.current, {
        scale: 1,
        backgroundColor: "var(--bg-tertiary)",
        color: "var(--text-secondary)",
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

  const sizeClass = `tag-${size}`;

  return (
    <button
      className={`tag ${sizeClass} ${isActive ? "tag-active" : ""}`}
      onClick={handleClick}
      type="button"
      role={role}
      aria-selected={ariaSelected !== undefined ? ariaSelected : isActive}
      aria-label={`${tag}${count ? ` (${count})` : ""}`}
      ref={tagRef}
    >
      <span className="tag-text">#{tag}</span>
      {count !== undefined && <span className="tag-count">{count}</span>}
    </button>
  );
};

export default Tag;
