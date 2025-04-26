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
    <div className={`featured-card ${className}`}>
      <div className="featured-card-content">
        <div className="featured-card-info">
          <div className="featured-card-type">
            <ItemTypeIcon type={item.type} size="medium" />
            <span className="featured-card-type-label">{getTypeLabel()}</span>
          </div>

          <h2 className="featured-card-title">{formatText(item.title)}</h2>

          <p className="featured-card-description">
            {formatText(item.description)}
          </p>

          <div className="featured-card-details">
            <div className="featured-detail">
              <span className="detail-icon">🕒</span>
              <span>
                {item.date} | {item.time}
              </span>
            </div>

            <div className="featured-detail">
              <span className="detail-icon">📍</span>
              <span>{formatText(item.location)}</span>
            </div>

            {getOrganization() && (
              <div className="featured-detail">
                <span className="detail-icon">👥</span>
                <span>
                  {getOrganizationLabel()}: {formatText(getOrganization())}
                </span>
              </div>
            )}
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="featured-card-tags">
              {item.tags.slice(0, 5).map((tag) => (
                <Tag key={tag} tag={tag} size="small" />
              ))}
            </div>
          )}

          <div className="featured-card-actions">
            <Link
              to={`/detail/${item.type}/${item.id}`}
              className="featured-card-link"
            >
              {t("actions.viewDetails")}
            </Link>

            <button
              className={`featured-card-bookmark ${
                isBookmarked(item.id) ? "bookmarked" : ""
              }`}
              onClick={handleBookmarkToggle}
              aria-label={
                isBookmarked(item.id)
                  ? t("actions.removeBookmark")
                  : t("actions.bookmark")
              }
            >
              {isBookmarked(item.id) ? "★" : "☆"}
              <span>
                {isBookmarked(item.id)
                  ? t("actions.removeBookmark")
                  : t("actions.bookmark")}
              </span>
            </button>
          </div>
        </div>

        <div className="featured-card-image">
          <img src={imageSrc} alt={item.title} onError={handleImageError} />
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;
