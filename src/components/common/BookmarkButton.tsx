import { useBookmark } from "../../context/BookmarkContext";
import { useLanguage } from "../../context/LanguageContext";
import { BookmarkIcon } from "../icons/BookmarkIcon";

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

  const sizeClass = `bookmark-button-${size}`;

  return (
    <button
      className={`bookmark-button ${sizeClass} ${
        isActive ? "bookmarked" : ""
      } ${className}`}
      onClick={handleClick}
      aria-label={
        isActive ? t("actions.removeBookmark") : t("actions.bookmark")
      }
      title={isActive ? t("actions.removeBookmark") : t("actions.bookmark")}
    >
      <span className="bookmark-icon">
        <BookmarkIcon size={16} fill={isActive ? "currentColor" : "none"} />
      </span>
      {showText && (
        <span className="bookmark-text">
          {isActive ? t("actions.removeBookmark") : t("actions.bookmark")}
        </span>
      )}
    </button>
  );
};

export default BookmarkButton;
