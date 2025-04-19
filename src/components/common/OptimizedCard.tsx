import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Item } from "../../types/common";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import Tag from "./Tag";
import ItemTypeIcon from "./ItemTypeIcon";
import { getTypeLabel } from "../../utils/formatters";

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
  const { t, translations } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Memoize placeholder image to avoid recalculating on each render
  const placeholderImage = useMemo(() => {
    switch (item.type) {
      case "event":
        return "/images/placeholder-event.jpg";
      case "exhibit":
        return "/images/placeholder-exhibit.jpg";
      case "stall":
        return "/images/placeholder-stall.jpg";
      default:
        return "/images/placeholder.jpg";
    }
  }, [item.type]);

  // Memoize organization details to avoid recalculating on each render
  const organizationDetails = useMemo(() => {
    let label = "";
    let value = "";

    if (item.type === "event") {
      label = t("detail.organizer");
      value = item.organizer;
    } else if (item.type === "exhibit") {
      label = t("detail.creator");
      value = item.creator;
    } else if (item.type === "stall") {
      label = t("detail.products");
      value = item.products?.length > 0 ? item.products.join(", ") : "";
    }

    return { label, value };
  }, [item, t]);

  // Memoize type label
  const typeLabel = useMemo(() => {
    return getTypeLabel(item.type, translations);
  }, [item.type, translations]);

  // Format text with highlighting if provided
  const formatText = useCallback(
    (text: string) => {
      return highlightText ? highlightText(text) : text;
    },
    [highlightText]
  );

  // Memoize image source to avoid recalculating on each render
  const imageSrc = useMemo(() => {
    return hasImageError ? placeholderImage : item.imageUrl || placeholderImage;
  }, [hasImageError, item.imageUrl, placeholderImage]);

  // Event handlers using useCallback
  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  const handleBookmarkToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleBookmark(item.id);
    },
    [item.id, toggleBookmark]
  );

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setHasImageError(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Generate card classes
  const cardClasses = useMemo(() => {
    return [
      "card",
      `card-${variant}`,
      showDescription ? "card-with-description" : "",
      isHovered ? "card-hovered" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");
  }, [variant, showDescription, isHovered, className]);

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
            <span className="card-badge-text">{typeLabel}</span>
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

            {organizationDetails.value && (
              <div className="card-organization">
                <span className="card-icon">👥</span>
                <span>
                  {organizationDetails.label}:{" "}
                  {formatText(organizationDetails.value)}
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

// Export memoized component to avoid unnecessary re-renders
export default React.memo(Card);
