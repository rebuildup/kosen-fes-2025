import { useBookmark } from "../../context/BookmarkContext";
import { useLanguage } from "../../context/LanguageContext";

interface BookmarkButtonProps {
  itemId: string;
  size?: "small" | "medium" | "large";
  showText?: boolean;
}

const BookmarkButton = ({
  itemId,
  size = "medium",
  showText = false,
}: BookmarkButtonProps) => {
  const { isBookmarked, toggleBookmark } = useBookmark();
  const { t } = useLanguage();

  const isActive = isBookmarked(itemId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(itemId);
  };

  // Determine class based on size
  const sizeClass = `bookmark-button-${size}`;

  return (
    <button
      className={`bookmark-button ${sizeClass} ${isActive ? "bookmarked" : ""}`}
      onClick={handleClick}
      aria-label={
        isActive ? t("actions.removeBookmark") : t("actions.bookmark")
      }
      title={isActive ? t("actions.removeBookmark") : t("actions.bookmark")}
    >
      {isActive ? "★" : "☆"}
      {showText && (
        <span className="bookmark-text">
          {isActive ? t("actions.removeBookmark") : t("actions.bookmark")}
        </span>
      )}
    </button>
  );
};

export default BookmarkButton;
