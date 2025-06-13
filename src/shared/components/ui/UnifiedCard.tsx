import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Item } from "../../../types/common";
import { useLanguage } from "../../../context/LanguageContext";
import { useBookmark } from "../../../context/BookmarkContext";
import Tag from "../../../components/common/Tag";
import ItemTypeIcon from "../../../components/common/ItemTypeIcon";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../../utils/animations";
import { getTypeLabel, formatTime, formatDate } from "../../../utils/formatters";
import { TimeIcon } from "../../../components/icons/TimeIcon";
import { LocationIcon } from "../../../components/icons/LocationIcon";
import { PeopleIcon } from "../../../components/icons/PeopleIcon";

interface UnifiedCardProps {
  item: Item;
  variant?: "default" | "compact" | "featured" | "grid" | "list";
  showTags?: boolean;
  showDescription?: boolean;
  showAnimation?: boolean;
  highlightText?: (text: string) => React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const UnifiedCard = React.memo(({
  item,
  variant = "default",
  showTags = false,
  showDescription = false,
  showAnimation = true,
  highlightText,
  onClick,
  className = "",
}: UnifiedCardProps) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  // Memoized derived values
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

  const organization = useMemo(() => {
    if (item.type === "event") {
      return item.organizer;
    } else if (item.type === "exhibit") {
      return item.creator;
    } else if (item.type === "stall") {
      return item.products?.length > 0 ? item.products.join(", ") : "";
    }
    return "";
  }, [item]);

  const organizationLabel = useMemo(() => {
    if (item.type === "event") {
      return t("detail.organizer");
    } else if (item.type === "exhibit") {
      return t("detail.creator");
    } else if (item.type === "stall") {
      return t("detail.products");
    }
    return "";
  }, [item.type, t]);

  const typeLabel = useMemo(() => getTypeLabel(item.type, t), [item.type, t]);

  // Format text with highlighting if provided
  const formatText = useCallback((text: string) => {
    return highlightText ? highlightText(text) : text;
  }, [highlightText]);

  // Set up hover animations
  useEffect(() => {
    if (!cardRef.current || !showAnimation) return;

    const card = cardRef.current;
    const hoverTimeline = gsap.timeline({ paused: true });

    // Card scale and shadow animation
    hoverTimeline.to(card, {
      y: variant === "featured" ? -8 : -6,
      boxShadow: variant === "featured" 
        ? "0 12px 24px rgba(0, 0, 0, 0.2)" 
        : "0 8px 20px rgba(0, 0, 0, 0.15)",
      duration: DURATION.FAST,
      ease: EASE.SMOOTH,
    });

    // Image scale animation
    if (imageRef.current) {
      hoverTimeline.to(
        imageRef.current,
        {
          scale: variant === "featured" ? 1.08 : 1.05,
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        },
        0
      );
    }

    // Meta information fade in
    if (metaRef.current && variant !== "list") {
      hoverTimeline.to(
        metaRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        },
        0
      );
    }

    // Tags fade in
    if (tagsRef.current && showTags) {
      hoverTimeline.to(
        tagsRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        },
        0
      );
    }

    // Store timeline for cleanup
    (card as any)._hoverTimeline = hoverTimeline;

    return () => {
      hoverTimeline.kill();
    };
  }, [variant, showTags, showAnimation]);

  // Handle mouse events
  const handleMouseEnter = useCallback(() => {
    if (!showAnimation) return;
    setIsHovered(true);
    const timeline = (cardRef.current as any)?._hoverTimeline;
    if (timeline) {
      timeline.play();
    }
  }, [showAnimation]);

  const handleMouseLeave = useCallback(() => {
    if (!showAnimation) return;
    setIsHovered(false);
    const timeline = (cardRef.current as any)?._hoverTimeline;
    if (timeline) {
      timeline.reverse();
    }
  }, [showAnimation]);

  // Handle bookmark toggle
  const handleBookmarkClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(item.id, item.type);
  }, [item.id, item.type, toggleBookmark]);

  // Handle image loading
  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setHasImageError(true);
    setIsImageLoaded(true);
  }, []);

  // Handle card click
  const handleCardClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  // Generate class names
  const cardClasses = useMemo(() => {
    const classes = [
      "unified-card",
      `unified-card--${variant}`,
      className,
    ];
    
    if (isHovered) classes.push("unified-card--hovered");
    if (!isImageLoaded) classes.push("unified-card--loading");
    
    return classes.filter(Boolean).join(" ");
  }, [variant, className, isHovered, isImageLoaded]);

  const cardContent = (
    <div
      ref={cardRef}
      className={cardClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="unified-card__image-container">
        <img
          ref={imageRef}
          src={hasImageError ? placeholderImage : item.imageUrl}
          alt={item.title}
          className="unified-card__image"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Type Label */}
        <div className="unified-card__type-badge">
          <ItemTypeIcon type={item.type} size="small" />
          <span>{typeLabel}</span>
        </div>
        
        {/* Bookmark Button */}
        <button
          className={`unified-card__bookmark ${
            isBookmarked(item.id, item.type) ? "unified-card__bookmark--active" : ""
          }`}
          onClick={handleBookmarkClick}
          aria-label={
            isBookmarked(item.id, item.type)
              ? t("bookmarks.remove")
              : t("bookmarks.add")
          }
        >
          {isBookmarked(item.id, item.type) ? "★" : "☆"}
        </button>
      </div>

      {/* Content Section */}
      <div className="unified-card__content">
        <h3 className="unified-card__title">
          {formatText(item.title)}
        </h3>

        {showDescription && item.description && (
          <p className="unified-card__description">
            {formatText(item.description)}
          </p>
        )}

        {/* Meta Information */}
        <div
          ref={metaRef}
          className="unified-card__meta"
        >
          <div className="unified-card__meta-item">
            <TimeIcon size="small" />
            <span>{formatTime(item.time)}</span>
          </div>
          
          <div className="unified-card__meta-item">
            <LocationIcon size="small" />
            <span>{item.location}</span>
          </div>
          
          {organization && (
            <div className="unified-card__meta-item">
              <PeopleIcon size="small" />
              <span>{formatText(organization)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {showTags && item.tags?.length > 0 && (
          <div
            ref={tagsRef}
            className="unified-card__tags"
          >
            {item.tags.slice(0, 3).map((tag, idx) => (
              <Tag key={idx} text={tag} size="small" />
            ))}
            {item.tags.length > 3 && (
              <span className="unified-card__tags-more">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Wrap with Link if no custom onClick handler
  if (!onClick) {
    return (
      <Link
        to={`/detail/${item.type}/${item.id}`}
        className="unified-card__link"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
});

UnifiedCard.displayName = "UnifiedCard";

export default UnifiedCard;