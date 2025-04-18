import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Item } from "../../types/common";
import { useLanguage } from "../../context/LanguageContext";
import BookmarkButton from "./BookmarkButton";

interface CardProps {
  item: Item;
  variant?: "default" | "compact" | "featured";
  highlightText?: (text: string) => React.ReactNode;
  showDescription?: boolean;
  showTags?: boolean;
  onClick?: () => void;
}

const Card = ({
  item,
  variant = "default",
  highlightText,
  showDescription = false,
  showTags = false,
  onClick,
}: CardProps) => {
  const { t } = useLanguage();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const renderText = (text: string) => {
    return highlightText ? highlightText(text) : text;
  };

  // Get organization name based on item type
  const getOrganization = () => {
    if (item.type === "event") {
      return item.organizer;
    } else if (item.type === "exhibit") {
      return item.creator;
    } else if (item.type === "stall") {
      return item.products.join(", ");
    }
    return "";
  };

  // Generate type label
  const getTypeLabel = () => {
    if (item.type === "event") {
      return t("detail.event");
    } else if (item.type === "exhibit") {
      return t("detail.exhibit");
    } else {
      return t("detail.stall");
    }
  };

  // Card class based on variant
  const cardClass = `card card-${variant} ${
    showDescription ? "card-with-description" : ""
  }`;

  // Handle card click
  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // Handle image loading
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  // Handle image error
  const handleImageError = () => {
    setHasImageError(true);
  };

  // Determine image src
  const imageSrc = hasImageError
    ? "/images/placeholder.jpg"
    : item.imageUrl || "/images/placeholder.jpg";

  return (
    <div className={cardClass}>
      <div className="card-inner">
        <Link
          to={`/detail/${item.type}/${item.id}`}
          className="card-link"
          onClick={handleCardClick}
        >
          <div className="card-header">
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
              <div className="card-badge">{getTypeLabel()}</div>
              <div className="card-bookmark-container">
                <BookmarkButton itemId={item.id} size="small" />
              </div>
            </div>
          </div>

          <div className="card-content">
            <h3 className="card-title">{renderText(item.title)}</h3>

            {showDescription && (
              <p className="card-description">{renderText(item.description)}</p>
            )}

            <div className="card-meta">
              <div className="card-time">
                <span className="card-meta-icon">🕒</span>
                <span>
                  {item.date} | {item.time}
                </span>
              </div>
              <div className="card-location">
                <span className="card-meta-icon">📍</span>
                <span>{renderText(item.location)}</span>
              </div>
              <div className="card-organization">
                <span className="card-meta-icon">👥</span>
                <span>{renderText(getOrganization())}</span>
              </div>
            </div>

            {showTags && item.tags && item.tags.length > 0 && (
              <div className="card-tags">
                {item.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?tag=${tag}`}
                    className="card-tag"
                    onClick={(e) => e.stopPropagation()}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Card;
