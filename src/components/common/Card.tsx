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

  // Generate unique class names based on props using TailwindCSS
  const cardClasses = [
    "card bg-white dark:bg-slate-800 rounded-lg overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md h-full relative",
    variant === "compact" ? "text-sm" : "",
    variant === "featured" ? "text-lg" : "",
    variant === "list" ? "flex flex-row h-auto items-center" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses} ref={cardRef}>
      <Link
        to={`/detail/${item.type}/${item.id}`}
        className="block text-slate-900 dark:text-slate-100 no-underline h-full"
        onClick={handleCardClick}
      >
        <div className={`relative overflow-hidden ${variant === "list" ? "w-30 min-w-30 h-24" : ""}`}>
          <div
            className={`relative bg-slate-100 dark:bg-slate-700 ${
              variant === "compact" ? "aspect-[4/3]" : 
              variant === "featured" ? "aspect-[2/1]" : 
              variant === "grid" ? "aspect-square" : 
              variant === "list" ? "h-full" : "aspect-video"
            } ${isImageLoaded ? "loaded" : "loading"}`}
          >
            <img
              src={imageSrc}
              alt={item.title}
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onLoad={handleImageLoad}
              onError={handleImageError}
              ref={imageRef}
            />
            {!isImageLoaded && !hasImageError && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                <div className="w-8 h-8 border-2 border-slate-300 border-t-primary-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-opacity duration-200">
            <ItemTypeIcon type={item.type} size="small" />
            <span className="font-medium">{getTypeLabel()}</span>
          </div>

          <button
            className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 dark:bg-black/70 flex items-center justify-center cursor-pointer text-xl transition-all duration-200 z-10 ${
              isBookmarked(item.id) ? "opacity-100 text-accent-500" : "opacity-0 group-hover:opacity-100 text-slate-600 dark:text-slate-300"
            } hover:bg-white dark:hover:bg-black hover:scale-110`}
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

        <div className={`p-3 ${variant === "featured" ? "p-5" : variant === "compact" ? "p-2.5" : variant === "list" ? "flex-1 p-3" : "p-4"}`}>
          <h3 className={`font-semibold text-slate-900 dark:text-slate-100 leading-tight mb-2 line-clamp-2 ${
            variant === "featured" ? "text-xl mb-3" : 
            variant === "compact" ? "text-sm mb-1.5 line-clamp-1" : 
            variant === "list" ? "text-base mb-1.5 line-clamp-1" : "text-base"
          }`}>{formatText(item.title)}</h3>

          {showDescription && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-3 leading-relaxed">{formatText(item.description)}</p>
          )}

          <div
            className={`text-xs text-slate-500 dark:text-slate-400 mt-2 transition-all duration-300 overflow-hidden ${
              isHovered || variant === "list" ? "opacity-100 translate-y-0 max-h-48" : "opacity-0 translate-y-2 max-h-0"
            }`}
            ref={metaRef}
            style={{
              opacity: variant === "list" ? 1 : undefined,
              transform: variant === "list" ? "none" : undefined,
            }}
          >
            <div className="flex items-center mb-1">
              <span className="mr-1.5 flex items-center justify-center min-w-4">
                <TimeIcon size={16} />
              </span>
              <span>
                {item.date} | {item.time}
              </span>
            </div>

            <div className="flex items-center mb-1">
              <span className="mr-1.5 flex items-center justify-center min-w-4">
                <LocationIcon size={16} />
              </span>
              <span>{formatText(item.location)}</span>
            </div>

            {getOrganization() && (
              <div className="flex items-center mb-1">
                <span className="mr-1.5 flex items-center justify-center min-w-4">
                  <PeopleIcon size={16} />
                </span>
                <span>
                  {getOrganizationLabel()}: {formatText(getOrganization())}
                </span>
              </div>
            )}
          </div>

          {showTags && item.tags && item.tags.length > 0 && (
            <div
              className={`flex flex-wrap gap-1.5 mt-3 transition-all duration-300 overflow-hidden ${
                isHovered ? "opacity-100 translate-y-0 max-h-24" : "opacity-0 translate-y-2 max-h-0"
              }`}
              ref={tagsRef}
              style={{
                opacity: 0,
                transform: "translateY(10px)",
              }}
            >
              {item.tags.slice(0, 3).map((tag) => (
                <Tag key={tag} tag={tag} size="small" />
              ))}
              {item.tags.length > 3 && (
                <span className="text-xs text-slate-500 dark:text-slate-400 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">+{item.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Card;
