import React from "react";
import { useBookmark } from "../../context/BookmarkContext";
import { useLanguage } from "../../context/LanguageContext";

interface BookmarkButtonProps {
  itemId: string;
  size?: "small" | "medium" | "large";
  showText?: boolean;
  className?: string;
}

const BookmarkButton = ({
  itemId,
  size = "medium",
  showText = false,
  className = "",
}: BookmarkButtonProps) => {
  const { isBookmarked, toggleBookmark } = useBookmark();
  const { t } = useLanguage();

  const isActive = isBookmarked(itemId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(itemId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleBookmark(itemId);
    }
  };

  const ariaLabel = isActive
    ? t("actions.removeBookmark")
    : t("actions.bookmark");

  const buttonText = isActive
    ? t("actions.removeBookmark")
    : t("actions.bookmark");

  const sizeClass = `bookmark-button-${size}`;

  return (
    <button
      className={`bookmark-button ${sizeClass} ${
        isActive ? "bookmarked" : ""
      } ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      title={ariaLabel}
      role="switch"
    >
      <span className="bookmark-icon" aria-hidden="true">
        {isActive ? "★" : "☆"}
      </span>
      {showText && <span className="bookmark-text">{buttonText}</span>}
    </button>
  );
};

export default React.memo(BookmarkButton);
