import { useState } from "react";
import { Link } from "react-router-dom";
import { Item } from "../../types/common";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import ItemTypeIcon from "./ItemTypeIcon";

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
        className={`group relative rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-64 ${className}`}
      >
        {/* Full Background Image */}
        <div className="absolute inset-0">
          <img
            src={imageSrc}
            alt={item.title}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-between p-6 text-white">
          {/* Type Badge and Bookmark - Top */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <ItemTypeIcon type={item.type} size="small" />
            </div>

            {/* Bookmark Button */}
            <button
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                isBookmarked(item.id)
                  ? "bg-yellow-500 text-white"
                  : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              }`}
              onClick={handleBookmarkToggle}
              aria-label={
                isBookmarked(item.id)
                  ? t("actions.removeBookmark")
                  : t("actions.bookmark")
              }
            >
              <span className="text-lg">
                {isBookmarked(item.id) ? "★" : "☆"}
              </span>
            </button>
          </div>

          {/* Always visible basic content */}
          <div className="space-y-2 group-hover:opacity-0 transition-opacity duration-300">
            <h2 className="text-xl font-bold leading-tight line-clamp-2">
              {formatText(item.title)}
            </h2>

            <div className="flex items-center space-x-4 text-sm opacity-90">
              <div className="flex items-center space-x-1">
                <span>🕒</span>
                <span>{item.time}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>📍</span>
                <span className="truncate">{formatText(item.location)}</span>
              </div>
            </div>
          </div>

          {/* Hover overlay with detailed information */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="space-y-3">
              {/* Title */}
              <h2 className="text-xl font-bold leading-tight line-clamp-2">
                {formatText(item.title)}
              </h2>

              {/* Description */}
              <p className="text-sm leading-relaxed line-clamp-2 opacity-90">
                {formatText(item.description)}
              </p>

              {/* Meta Information */}
              <div className="grid grid-cols-1 gap-1 text-xs opacity-80">
                <div className="flex items-center space-x-2">
                  <span>🕒</span>
                  <span>
                    {item.date} | {item.time}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span>📍</span>
                  <span className="truncate">{formatText(item.location)}</span>
                </div>

                {getOrganization() && (
                  <div className="flex items-center space-x-2">
                    <span>👥</span>
                    <span className="truncate">
                      {getOrganizationLabel()}: {formatText(getOrganization())}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* View Details Button */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium group-hover:bg-white/30 transition-all duration-200">
                  {t("actions.viewDetails")}
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default FeaturedCard;
