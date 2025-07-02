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
            ease: EASE.SMOOTH,
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
            ease: EASE.SMOOTH,
          });
        },
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
    if (item.type === "event") {
      const eventNumber = item.id.split("-")[1];
      return `./images/events/event-${eventNumber}.jpg`;
    } else if (item.type === "exhibit") {
      const exhibitNumber = item.id.split("-")[1];
      return `./images/exhibits/exhibit-${exhibitNumber}.jpg`;
    } else if (item.type === "stall") {
      const stallNumber = item.id.split("-")[1];
      return `./images/stalls/stall-${stallNumber}.jpg`;
    } else if (item.type === "sponsor") {
      const sponsorNumber = item.id.split("-")[1];
      return `./images/sponsors/sponsor-${sponsorNumber}.jpg`;
    }

    return getPlaceholderImage();
  };

  // Component for text with intelligent marquee
  const SmartScrollableText = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const textString =
      typeof children === "string" ? children : String(children);
    const shouldMarquee = textString.length > 30; // Threshold for marquee

    return (
      <div className={`overflow-hidden ${className}`}>
        {shouldMarquee && isHovered ? (
          <div className="whitespace-nowrap animate-marquee">{children}</div>
        ) : (
          <div className="truncate">{children}</div>
        )}
      </div>
    );
  };

  const cardContent = (
    <div
      ref={cardRef}
      className="relative group cursor-pointer rounded-lg overflow-hidden aspect-[4/3] glass-card glass-interactive"
    >
      {/* Background Image */}
      <img
        ref={imageRef}
        src={determineImageSrc()}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent text-white">
        {/* Type Badge - Top Left */}
        <div className="absolute top-2 left-2 glass-subtle rounded-full p-1.5">
          <ItemTypeIcon type={item.type} size="small" />
        </div>

        {/* Bookmark Button - Top Right */}
        <button
          onClick={handleBookmarkToggle}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 glass-button glass-interactive pointer-events-auto z-10 ${
            isBookmarked(item.id) ? "bg-yellow-500/90 text-white" : "text-white"
          }`}
          aria-label={
            isBookmarked(item.id)
              ? t("actions.removeBookmark")
              : t("actions.bookmark")
          }
        >
          <span className="text-sm">{isBookmarked(item.id) ? "★" : "☆"}</span>
        </button>

        {/* Basic Info - Visible when not hovered */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 space-y-1 transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <SmartScrollableText className="font-semibold text-lg">
            {formatText(item.title)}
          </SmartScrollableText>

          <div className="space-y-0.5 text-sm opacity-90">
            <SmartScrollableText> {item.time}</SmartScrollableText>
            <SmartScrollableText> {item.location}</SmartScrollableText>
          </div>
        </div>

        {/* Detailed overlay on hover */}
        <div
          ref={metaRef}
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-center transition-all duration-300 pointer-events-none ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ visibility: isHovered ? "visible" : "hidden" }}
        >
          <div className="space-y-3">
            <SmartScrollableText className="text-lg font-semibold">
              {formatText(item.title)}
            </SmartScrollableText>

            {showDescription && item.description && (
              <p className="text-sm opacity-90 line-clamp-3">
                {formatText(item.description)}
              </p>
            )}

            <div className="space-y-2 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <TimeIcon size={16} />
                <SmartScrollableText>{item.time}</SmartScrollableText>
              </div>
              <div className="flex items-center gap-2">
                <LocationIcon size={16} />
                <SmartScrollableText>{item.location}</SmartScrollableText>
              </div>
              {getOrganization() && (
                <div className="flex items-center gap-2">
                  <PeopleIcon size={16} />
                  <SmartScrollableText>
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
            className={`absolute bottom-3 left-3 right-3 transition-all duration-300 pointer-events-none ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ visibility: isHovered ? "visible" : "hidden" }}
          >
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tagName) => (
                <Tag
                  key={tagName}
                  tag={tagName}
                  size="small"
                  interactive={false}
                />
              ))}
              {item.tags.length > 3 && (
                <span className="px-2 py-1 glass-subtle rounded-full text-xs">
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
    return <div onClick={handleCardClick}>{cardContent}</div>;
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
