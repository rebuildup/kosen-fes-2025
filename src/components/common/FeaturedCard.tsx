import { useState } from "react";
import { Link } from "react-router-dom";
import { Item } from "../../types/common";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import ItemTypeIcon from "./ItemTypeIcon";
import Tag from "./Tag";

interface FeaturedCardProps {
  item: Item;
  highlightText?: (text: string) => React.ReactNode;
  className?: string;
}

const FeaturedCard = ({
  item,
  highlightText,
  className = "",
}: FeaturedCardProps) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();
  const [hasImageError, setHasImageError] = useState(false);

  // Format text with highlighting if provided
  const formatText = (text: string) => {
    return highlightText ? highlightText(text) : text;
  };

  // Get organization name based on item type
  const getOrganization = () => {
    if (item.type === "event") {
      return item.organizer;
    } else if (item.type === "exhibit") {
      return item.creator;
    } else if (item.type === "stall") {
      return item.products?.length > 0 ? item.products.join(", ") : "";
    }
    return "";
  };

  // Get organization label based on item type
  const getOrganizationLabel = () => {
    if (item.type === "event") {
      return t("detail.organizer");
    } else if (item.type === "exhibit") {
      return t("detail.creator");
    } else if (item.type === "stall") {
      return t("detail.products");
    }
    return "";
  };

  // Get type label
  const getTypeLabel = () => {
    if (item.type === "event") {
      return t("detail.event");
    } else if (item.type === "exhibit") {
      return t("detail.exhibit");
    } else {
      return t("detail.stall");
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleBookmark(item.id);
  };

  // Handle image error
  const handleImageError = () => {
    setHasImageError(true);
  };

  // Get placeholder image based on item type
  const getPlaceholderImage = () => {
    switch (item.type) {
      case "event":
        return "./images/placeholder-event.jpg";
      case "exhibit":
        return "./images/placeholder-exhibit.jpg";
      case "stall":
        return "./images/placeholder-stall.jpg";
      case "sponsor":
        return "./images/placeholder-sponsor.jpg";
      default:
        return "./images/placeholder.jpg";
    }
  };

  // Determine image source
  const imageSrc = hasImageError
    ? getPlaceholderImage()
    : item.imageUrl || getPlaceholderImage();

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:h-64">
        <div className="flex-1 p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <ItemTypeIcon type={item.type} size="medium" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {getTypeLabel()}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">
            {formatText(item.title)}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
            {formatText(item.description)}
          </p>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>🕒</span>
              <span>
                {item.date} | {item.time}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>📍</span>
              <span>{formatText(item.location)}</span>
            </div>

            {getOrganization() && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>👥</span>
                <span>
                  {getOrganizationLabel()}: {formatText(getOrganization())}
                </span>
              </div>
            )}
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.slice(0, 5).map((tag) => (
                <Tag key={tag} tag={tag} size="small" />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <Link
              to={`/detail/${item.type}/${item.id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {t("actions.viewDetails")}
            </Link>

            <button
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isBookmarked(item.id)
                  ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={handleBookmarkToggle}
              aria-label={
                isBookmarked(item.id)
                  ? t("actions.removeBookmark")
                  : t("actions.bookmark")
              }
            >
              <span className="text-lg">{isBookmarked(item.id) ? "★" : "☆"}</span>
              <span className="hidden sm:inline">
                {isBookmarked(item.id)
                  ? t("actions.removeBookmark")
                  : t("actions.bookmark")}
              </span>
            </button>
          </div>
        </div>

        <div className="lg:w-80 h-48 lg:h-full bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          <img 
            src={imageSrc} 
            alt={item.title} 
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;
