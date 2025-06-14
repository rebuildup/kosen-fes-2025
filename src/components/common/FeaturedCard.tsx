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
    <Link to={`/detail/${item.type}/${item.id}`}>
      <article
        className={`group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}
      >
        <div className="flex flex-col lg:flex-row lg:h-64">
          {/* Content */}
          <div className="flex-1 p-6 space-y-4">
            {/* Type Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ItemTypeIcon type={item.type} size="medium" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {getTypeLabel()}
                </span>
              </div>
              
              {/* Bookmark Button */}
              <button
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isBookmarked(item.id)
                    ? "text-[var(--second)] bg-[var(--second)]/10"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={handleBookmarkToggle}
                aria-label={
                  isBookmarked(item.id)
                    ? t("actions.removeBookmark")
                    : t("actions.bookmark")
                }
              >
                <span className="text-xl">
                  {isBookmarked(item.id) ? "★" : "☆"}
                </span>
              </button>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-200">
              {formatText(item.title)}
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
              {formatText(item.description)}
            </p>

            {/* Meta Information */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="w-4 h-4 flex items-center justify-center">🕒</span>
                <span>{item.date} | {item.time}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="w-4 h-4 flex items-center justify-center">📍</span>
                <span className="truncate">{formatText(item.location)}</span>
              </div>

              {getOrganization() && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="w-4 h-4 flex items-center justify-center">👥</span>
                  <span className="truncate">
                    {getOrganizationLabel()}: {formatText(getOrganization())}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {item.tags.slice(0, 5).map((tag) => (
                  <Tag key={tag} tag={tag} size="small" />
                ))}
                {item.tags.length > 5 && (
                  <span className="tag tag-default text-xs">
                    +{item.tags.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* View Details Button */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 text-[var(--accent)] font-medium text-sm group-hover:gap-3 transition-all duration-200">
                {t("actions.viewDetails")}
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:w-80 h-48 lg:h-full bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
            <img
              src={imageSrc}
              alt={item.title}
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default FeaturedCard;
