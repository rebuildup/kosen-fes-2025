import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

interface TagProps {
  label: string;
  size?: "small" | "medium" | "large";
  clickable?: boolean;
  active?: boolean;
  onTagClick?: (tag: string) => void;
  className?: string;
  filterPath?: string; // Path to use for filtering
}

const Tag: React.FC<TagProps> = ({
  label,
  size = "medium",
  clickable = false,
  active = false,
  onTagClick,
  className = "",
  filterPath,
}) => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  // Determine size classes
  const sizeClasses = {
    small: "text-xs px-2 py-0.5",
    medium: "text-sm px-2.5 py-0.5",
    large: "text-sm px-3 py-1",
  };

  // Base tag styles
  const baseClasses = `
    inline-flex items-center rounded-full
    font-medium
    transition-colors duration-200
    ${sizeClasses[size]}
  `;

  // Active/inactive state styles
  const stateClasses = active
    ? "bg-primary-500 text-white dark:bg-primary-600"
    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";

  // Hover effect only for clickable tags
  const hoverClasses = clickable
    ? "hover:bg-primary-400 hover:text-white dark:hover:bg-primary-700 cursor-pointer"
    : "";

  // Combine all classes
  const tagClasses = `${baseClasses} ${stateClasses} ${hoverClasses} ${className}`;

  // Handle tag click
  const handleClick = (e: React.MouseEvent) => {
    if (!clickable) return;

    if (onTagClick) {
      e.preventDefault();
      onTagClick(label);
    }
  };

  // If filterPath is provided, make it a Link
  if (clickable && filterPath) {
    // Construct new search params
    const newSearchParams = new URLSearchParams(searchParams);

    if (active) {
      // If tag is already active, clicking should remove it
      newSearchParams.delete("tag");
    } else {
      // Set the tag as the filter
      newSearchParams.set("tag", label);
    }

    return (
      <Link
        to={`${filterPath}?${newSearchParams.toString()}`}
        className={tagClasses}
        aria-label={
          active
            ? t("tags.removeFilter", { tag: label })
            : t("tags.filterBy", { tag: label })
        }
      >
        {label}
      </Link>
    );
  }

  // If onTagClick is provided, make it a button
  if (clickable && onTagClick) {
    return (
      <button
        className={tagClasses}
        onClick={handleClick}
        aria-label={
          active
            ? t("tags.removeFilter", { tag: label })
            : t("tags.filterBy", { tag: label })
        }
      >
        {label}
      </button>
    );
  }

  // Otherwise, render as a span
  return <span className={tagClasses}>{label}</span>;
};

export default Tag;
