import { gsap } from "gsap";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useBookmark } from "../../context/BookmarkContext";
import { useLanguage } from "../../context/LanguageContext";
import type { Item } from "../../types/common";
import { DURATION, EASE } from "../../utils/animations";
import { LocationIcon, PeopleIcon, TimeIcon } from "../icons";
import ItemTypeIcon from "./ItemTypeIcon";
import Tag from "./Tag";

interface CardProps {
  item: Item;
  variant?: "default" | "compact" | "featured" | "grid" | "list";
  showTags?: boolean;
  showDescription?: boolean;
  highlightText?: (text: string) => React.ReactNode;
  onClick?: () => void;
}

// Component for text with intelligent marquee
const SmartScrollableText = ({
  children,
  className = "",
  isHovered,
}: {
  children: React.ReactNode;
  className?: string;
  isHovered: boolean;
}) => {
  const textString = typeof children === "string" ? children : String(children);
  const shouldMarquee = textString.length > 30; // Threshold for marquee

  return (
    <div className={`overflow-hidden ${className}`}>
      {shouldMarquee && isHovered ? (
        <div className="animate-marquee whitespace-nowrap">{children}</div>
      ) : (
        <div className="truncate">{children}</div>
      )}
    </div>
  );
};

const Card = ({
  highlightText,
  item,
  onClick,
  showDescription = false,
  showTags = false,
  variant = "default",
}: CardProps) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();

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
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
      duration: DURATION.FAST,
      ease: EASE.SMOOTH,
      y: -6,
    });

    // Image scale animation
    if (imageRef.current) {
      hoverTimeline.to(
        imageRef.current,
        {
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
          scale: 1.05,
        },
        0,
      );
    }

    // Meta information fade in
    if (metaRef.current && variant !== "list") {
      hoverTimeline.to(
        metaRef.current,
        {
          autoAlpha: 1,
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
          y: 0,
        },
        0,
      );
    }

    // Tags fade in
    if (tagsRef.current && showTags) {
      hoverTimeline.to(
        tagsRef.current,
        {
          autoAlpha: 1,
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
          y: 0,
        },
        0,
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
      case "event": {
        return "./images/events/placeholder-event.jpg";
      }
      case "exhibit": {
        return "./images/exhibits/placeholder-exhibit.jpg";
      }
      case "stall": {
        return "./images/stalls/placeholder-stall.jpg";
      }
      case "sponsor": {
        return "./images/sponsors/placeholder-sponsor.jpg";
      }
      default: {
        return "./images/placeholder.jpg";
      }
    }
  };

  // Format text with highlighting if provided
  const formatText = (text: string) => {
    return highlightText ? highlightText(text) : text;
  };

  // Get organization name based on item type
  const getOrganization = () => {
    switch (item.type) {
      case "event": {
        return item.organizer;
      }
      case "exhibit": {
        return item.creator;
      }
      case "stall": {
        return item.products?.length > 0 ? item.products.join(", ") : "";
      }
      // No default
    }
    return "";
  };

  // Get organization label based on item type
  const getOrganizationLabel = () => {
    switch (item.type) {
      case "event": {
        return t("detail.organizer");
      }
      case "exhibit": {
        return t("detail.creator");
      }
      case "stall": {
        return t("detail.products");
      }
      // No default
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
        duration: DURATION.FAST / 2,
        ease: EASE.SMOOTH,
        onComplete: () => {
          toggleBookmark(item.id);
          gsap.to(target, {
            duration: DURATION.FAST / 2,
            ease: EASE.SMOOTH,
            scale: 1,
          });
        },
        scale: 0.8,
      });
    } else {
      // Adding bookmark animation
      gsap.to(target, {
        duration: DURATION.FAST / 2,
        ease: EASE.SMOOTH,
        onComplete: () => {
          toggleBookmark(item.id);
          gsap.to(target, {
            duration: DURATION.FAST / 2,
            ease: EASE.SMOOTH,
            scale: 1,
          });
        },
        scale: 1.2,
      });
    }
  };

  // Determine image source with fallback
  const handleImageLoad = () => {
    setHasImageError(false);
  };

  const handleImageError = () => {
    setHasImageError(true);
  };

  const determineImageSrc = () => {
    if (hasImageError) {
      return getPlaceholderImage();
    }

    if (item.imageUrl) {
      return item.imageUrl;
    }

    // Create path to the item image based on type and ID
    switch (item.type) {
      case "event": {
        const eventNumber = item.id.split("-")[1];
        return `./images/events/event-${eventNumber}.jpg`;
      }
      case "exhibit": {
        const exhibitNumber = item.id.split("-")[1];
        return `./images/exhibits/exhibit-${exhibitNumber}.jpg`;
      }
      case "stall": {
        const stallNumber = item.id.split("-")[1];
        return `./images/stalls/stall-${stallNumber}.jpg`;
      }
      case "sponsor": {
        const sponsorNumber = item.id.split("-")[1];
        return `./images/sponsors/sponsor-${sponsorNumber}.jpg`;
      }
      // No default
    }

    return getPlaceholderImage();
  };

  const cardContent = (
    <div
      ref={cardRef}
      className="card group glass-card glass-interactive relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg"
    >
      {/* Background Image */}
      <img
        ref={imageRef}
        src={determineImageSrc()}
        alt={item.title}
        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />

      {/* Type Badge - Top Left (outside overlay for mix-blend-mode) */}
      <div className="absolute top-2 left-2 z-20">
        <ItemTypeIcon type={item.type} size="small" />
      </div>

      {/* Bookmark Button - Top Right (outside overlay for mix-blend-mode) */}
      <button
        type="button"
        onClick={handleBookmarkToggle}
        className="pointer-events-auto absolute top-2 right-2 z-20 transition-all duration-200"
        aria-label={isBookmarked(item.id) ? t("actions.removeBookmark") : t("actions.bookmark")}
      >
        <span className="card-foreground text-sm">{isBookmarked(item.id) ? "★" : "☆"}</span>
      </button>

      {/* Glassmorphism overlay (use shared .card-gradient-overlay for consistent theming) */}
      <div className="card-gradient-overlay text-white">
        <div
          className={`absolute right-0 bottom-0 left-0 space-y-1 p-3 transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <SmartScrollableText className="mix-diff text-lg font-semibold" isHovered={isHovered}>
            {formatText(item.title)}
          </SmartScrollableText>

          <div className="space-y-0.5 text-sm opacity-90">
            <SmartScrollableText isHovered={isHovered}> {item.time}</SmartScrollableText>
            <SmartScrollableText isHovered={isHovered}> {item.location}</SmartScrollableText>
          </div>
        </div>

        {/* Detailed overlay on hover */}
        <div
          ref={metaRef}
          className={`pointer-events-none absolute inset-0 flex flex-col justify-center bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ visibility: isHovered ? "visible" : "hidden" }}
        >
          <div className="space-y-3">
            <SmartScrollableText className="mix-diff text-lg font-semibold" isHovered={isHovered}>
              {formatText(item.title)}
            </SmartScrollableText>

            {showDescription && item.description && (
              <p className="line-clamp-3 text-sm opacity-90">{formatText(item.description)}</p>
            )}

            <div className="space-y-2 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <TimeIcon size={16} />
                <SmartScrollableText isHovered={isHovered}>{item.time}</SmartScrollableText>
              </div>
              <div className="flex items-center gap-2">
                <LocationIcon size={16} />
                <SmartScrollableText isHovered={isHovered}>{item.location}</SmartScrollableText>
              </div>
              {getOrganization() && (
                <div className="flex items-center gap-2">
                  <PeopleIcon size={16} />
                  <SmartScrollableText isHovered={isHovered}>
                    {getOrganizationLabel()}: {getOrganization()}
                  </SmartScrollableText>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags overlay */}
        {showTags && item.tags && item.tags.length > 0 && (
          <div
            ref={tagsRef}
            className={`pointer-events-none absolute right-3 bottom-3 left-3 transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ visibility: isHovered ? "visible" : "hidden" }}
          >
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tagName) => (
                <Tag key={tagName} tag={tagName} size="small" interactive={false} />
              ))}
              {item.tags.length > 3 && (
                <span className="glass-subtle rounded-full px-2 py-1 text-xs">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={handleCardClick} className="block w-full">
        {cardContent}
      </button>
    );
  }

  return (
    <Link
      to={`/detail/${item.type}/${item.id}`}
      className="block"
      aria-label={`${getTypeLabel()}: ${item.title}`}
    >
      {cardContent}
    </Link>
  );
};

export default Card;
