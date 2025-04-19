import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Item } from "../../types/common";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import Tag from "./Tag";
import ItemTypeIcon from "./ItemTypeIcon";

interface CardProps {
  item: Item;
  variant?: "default" | "compact" | "featured" | "grid" | "list";
  showTags?: boolean;
  showDescription?: boolean;
  highlightText?: (text: string) => React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Card = ({
  item,
  variant = "default",
  showTags = false,
  showDescription = false,
  highlightText,
  onClick,
  className = "",
}: CardProps) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();
  const navigate = useNavigate();

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get placeholder image based on item type
  const getPlaceholderImage = () => {
    switch (item.type) {
      case "event":
        return "/images/events/placeholder-event.jpg";
      case "exhibit":
        return "/images/exhibits/placeholder-exhibit.jpg";
      case "stall":
        return "/images/stalls/placeholder-stall.jpg";
      default:
        return "/images/placeholder.jpg";
    }
  };

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

  // Handle card click
  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(item.id);
  };

  // Handle image load event
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  // Handle image error event
  const handleImageError = () => {
    console.warn(`Failed to load image for ${item.title}`, item.imageUrl);
    setHasImageError(true);
  };

  // Handle mouse enter
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Correctly determine image source with proper fallback
  // This attempts to use the item's imageUrl first, or falls back to a type-specific image
  const determineImageSrc = () => {
    // First try the item's specified image URL
    if (item.imageUrl && !hasImageError) {
      return item.imageUrl;
    }

    // If there's no imageUrl or loading failed, use type-specific placeholder
    if (item.type === "event") {
      // Create path to the event image based on ID (for example, event-1.jpg)
      const eventNumber = item.id.split("-")[1];
      return `/images/events/event-${eventNumber}.jpg`;
    } else if (item.type === "exhibit") {
      const exhibitNumber = item.id.split("-")[1];
      return `/images/exhibits/exhibit-${exhibitNumber}.jpg`;
    } else if (item.type === "stall") {
      const stallNumber = item.id.split("-")[1];
      return `/images/stalls/stall-${stallNumber}.jpg`;
    }

    // Final fallback to generic placeholder
    return getPlaceholderImage();
  };

  // Get the actual image source
  const imageSrc = determineImageSrc();

  // Generate unique class names based on props
  const cardClasses = [
    "card",
    `card-${variant}`,
    showDescription ? "card-with-description" : "",
    isHovered ? "card-hovered" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cardClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/detail/${item.type}/${item.id}`}
        className="card-link"
        onClick={handleCardClick}
      >
        <div className="card-image-container">
          <div
            className={`card-image-wrapper ${
              isImageLoaded ? "loaded" : "loading"
            }`}
          >
            <img
              src={imageSrc}
              alt={item.title}
              className="card-image"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {!isImageLoaded && !hasImageError && (
              <div className="card-image-loading">
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>

          <div className="card-badge">
            <ItemTypeIcon type={item.type} size="small" />
            <span className="card-badge-text">{getTypeLabel()}</span>
          </div>

          <button
            className={`card-bookmark-button ${
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
          </button>
        </div>

        <div className="card-content">
          <h3 className="card-title">{formatText(item.title)}</h3>

          {showDescription && (
            <p className="card-description">{formatText(item.description)}</p>
          )}

          <div
            className={`card-meta ${
              isHovered || variant === "list" ? "card-meta-visible" : ""
            }`}
          >
            <div className="card-date-time">
              <span className="card-icon">🕒</span>
              <span>
                {item.date} | {item.time}
              </span>
            </div>

            <div className="card-location">
              <span className="card-icon">📍</span>
              <span>{formatText(item.location)}</span>
            </div>

            {getOrganization() && (
              <div className="card-organization">
                <span className="card-icon">👥</span>
                <span>
                  {getOrganizationLabel()}: {formatText(getOrganization())}
                </span>
              </div>
            )}
          </div>

          {showTags && item.tags && item.tags.length > 0 && (
            <div
              className={`card-tags ${isHovered ? "card-tags-visible" : ""}`}
            >
              {item.tags.slice(0, 3).map((tag) => (
                <Tag key={tag} tag={tag} size="small" />
              ))}
              {item.tags.length > 3 && (
                <span className="card-tags-more">+{item.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Card;
