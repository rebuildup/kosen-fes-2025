import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Item } from "../../types/common";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import Tag from "./Tag";
import ItemTypeIcon from "./ItemTypeIcon";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../utils/animations";
import { TimeIcon } from "../icons/TimeIcon";
import { LocationIcon } from "../icons/LocationIcon";
import { PeopleIcon } from "../icons/PeopleIcon";

interface CardProps {
  item: Item;
  variant?: "default" | "compact" | "featured" | "grid" | "list";
  showTags?: boolean;
  showDescription?: boolean;
  highlightText?: (text: string) => React.ReactNode;
  onClick?: () => void;
}

const Card = ({
  item,
  variant = "default",
  showTags = false,
  showDescription = false,
  highlightText,
  onClick,
}: CardProps) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  // Set up hover animations
  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const hoverTimeline = gsap.timeline({ paused: true });

    // Card scale and shadow animation
    hoverTimeline.to(card, {
      y: -6,
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
      duration: DURATION.FAST,
      ease: EASE.SMOOTH,
    });

    // Image scale animation
    if (imageRef.current) {
      hoverTimeline.to(
        imageRef.current,
        {
          scale: 1.05,
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

    // Mouse enter/leave events
    const handleMouseEnter = () => {
      setIsHovered(true);
      hoverTimeline.play();
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      hoverTimeline.reverse();
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      hoverTimeline.kill();
    };
  }, [variant, showTags]);

  // Get placeholder image based on item type
  const getPlaceholderImage = () => {
    switch (item.type) {
      case "event":
        return "./images/events/placeholder-event.jpg";
      case "exhibit":
        return "./images/exhibits/placeholder-exhibit.jpg";
      case "stall":
        return "./images/stalls/placeholder-stall.jpg";
      case "sponsor":
        return "./images/sponsors/placeholder-sponsor.jpg";
      default:
        return "./images/placeholder.jpg";
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

  // Handle bookmark toggle with animation
  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget as HTMLButtonElement;
    const isCurrentlyBookmarked = isBookmarked(item.id);

    // Animation for toggling bookmark
    if (isCurrentlyBookmarked) {
      // Removing bookmark animation
      gsap.to(target, {
        scale: 0.8,
        duration: DURATION.FAST / 2,
        ease: EASE.SMOOTH,
        onComplete: () => {
          toggleBookmark(item.id);
          gsap.to(target, {
            scale: 1,
            duration: DURATION.FAST / 2,
            ease: "back.out(1.7)",
          });
        },
      });
    } else {
      // Adding bookmark animation
      gsap.to(target, {
        scale: 1.2,
        duration: DURATION.FAST / 2,
        ease: EASE.SMOOTH,
        onComplete: () => {
          toggleBookmark(item.id);
          gsap.to(target, {
            scale: 1,
            duration: DURATION.FAST / 2,
            ease: "elastic.out(1, 0.3)",
          });
        },
      });
    }
  };

  // Handle image load event with fade-in animation
  const handleImageLoad = () => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: DURATION.NORMAL,
          ease: EASE.SMOOTH,
          onComplete: () => setIsImageLoaded(true),
        }
      );
    } else {
      setIsImageLoaded(true);
    }
  };

  // Handle image error event
  const handleImageError = () => {
    console.warn(`Failed to load image for ${item.title}`, item.imageUrl);
    setHasImageError(true);
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

  // Get variant-specific classes
  const getCardClasses = () => {
    const baseClasses = "card group cursor-pointer transform transition-all duration-200";
    
    switch (variant) {
      case "compact":
        return `${baseClasses} hover:-translate-y-2`;
      case "featured":
        return `${baseClasses} md:flex md:h-64 hover:-translate-y-3 shadow-lg`;
      case "list":
        return `${baseClasses} flex flex-row hover:-translate-y-1`;
      case "grid":
        return `${baseClasses} max-w-sm mx-auto hover:-translate-y-2`;
      default:
        return `${baseClasses} hover:-translate-y-2`;
    }
  };

  const getImageClasses = () => {
    switch (variant) {
      case "featured":
        return "card-image md:w-1/2 md:h-full group-hover:scale-105 transition-transform duration-200";
      case "list":
        return "w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200";
      case "compact":
        return "card-image group-hover:scale-105 transition-transform duration-200";
      default:
        return "card-image group-hover:scale-105 transition-transform duration-200";
    }
  };

  const getContentClasses = () => {
    switch (variant) {
      case "featured":
        return "card-content md:w-1/2 flex flex-col justify-between p-6";
      case "list":
        return "flex-1 px-4 py-2 min-w-0";
      case "compact":
        return "card-content p-3";
      default:
        return "card-content";
    }
  };

  return (
    <article ref={cardRef} className={getCardClasses()}>
      <Link to={`/detail/${item.type}/${item.id}`} onClick={handleCardClick} className="block h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={imageSrc}
            alt={item.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            ref={imageRef}
            className={getImageClasses()}
            style={{ opacity: isImageLoaded ? 1 : 0 }}
          />
          
          {/* Loading Skeleton */}
          {!isImageLoaded && !hasImageError && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse">
              <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"></div>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium">
            <ItemTypeIcon type={item.type} size="small" />
            <span className="text-gray-700 dark:text-gray-300">{getTypeLabel()}</span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-lg transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            aria-label={
              isBookmarked(item.id)
                ? t("actions.removeBookmark")
                : t("actions.bookmark")
            }
          >
            <span className={isBookmarked(item.id) ? "text-[var(--second)]" : "text-gray-400 dark:text-gray-500"}>
              {isBookmarked(item.id) ? "★" : "☆"}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className={getContentClasses()}>
          <div>
            <h3 className="card-title group-hover:text-[var(--accent)] transition-colors duration-200">
              {formatText(item.title)}
            </h3>

            {showDescription && (
              <p className="card-description">
                {formatText(item.description)}
              </p>
            )}

            {/* Meta Information */}
            <div
              ref={metaRef}
              className="space-y-2"
              style={{
                opacity: variant === "list" ? 1 : undefined,
                transform: variant === "list" ? "none" : undefined,
              }}
            >
              <div className="card-meta">
                <TimeIcon size={16} className="card-meta-icon" />
                <span className="truncate">
                  {item.date} | {item.time}
                </span>
              </div>

              <div className="card-meta">
                <LocationIcon size={16} className="card-meta-icon" />
                <span className="truncate">{formatText(item.location)}</span>
              </div>

              {getOrganization() && (
                <div className="card-meta">
                  <PeopleIcon size={16} className="card-meta-icon" />
                  <span className="truncate">
                    {getOrganizationLabel()}: {formatText(getOrganization())}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {showTags && item.tags && item.tags.length > 0 && (
              <div
                ref={tagsRef}
                className="flex flex-wrap gap-1.5 mt-3"
                style={{
                  opacity: 0,
                  transform: "translateY(10px)",
                }}
              >
                {item.tags.slice(0, 3).map((tag) => (
                  <Tag key={tag} tag={tag} size="small" />
                ))}
                {item.tags.length > 3 && (
                  <span className="tag tag-default text-xs">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default Card;
