import { gsap } from "gsap";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

import ItemTypeIcon from "../../../components/common/ItemTypeIcon";
import Tag from "../../../components/common/Tag";
import { LocationIcon, PeopleIcon, TimeIcon } from "../../../components/icons";
import { useBookmark } from "../../../context/BookmarkContext";
import { useLanguage } from "../../../context/LanguageContext";
import type { Item } from "../../../types/common";
import { DURATION, EASE } from "../../../utils/animations";

interface UnifiedCardProps {
  item: Item;
  variant?: "default" | "compact" | "featured" | "grid" | "list" | "timeline";
  showTags?: boolean;
  showDescription?: boolean;
  showAnimation?: boolean;
  highlightText?: (text: string) => React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const UnifiedCard = React.memo(
  ({
    className = "",
    highlightText,
    item,
    onClick,
    showAnimation = false,
    showDescription = false,
    showTags = false,
    variant = "default",
  }: UnifiedCardProps) => {
    const { t } = useLanguage();
    const { isBookmarked, toggleBookmark } = useBookmark();

    const [hasImageError, setHasImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const metaRef = useRef<HTMLDivElement>(null);
    const tagsRef = useRef<HTMLDivElement>(null);
    const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);

    // Initialize component after first render to prevent flash
    useEffect(() => {
      setIsInitialized(true);
    }, []);

    // Memoized derived values
    const placeholderImage = useMemo(() => {
      switch (item.type) {
        case "event": {
          return "./images/placeholder-event.jpg";
        }
        case "exhibit": {
          return "./images/placeholder-exhibit.jpg";
        }
        case "stall": {
          return "./images/placeholder-stall.jpg";
        }
        case "sponsor": {
          return "./images/placeholder-sponsor.jpg";
        }
        default: {
          return "./images/placeholder.jpg";
        }
      }
    }, [item.type]);

    const organization = useMemo(() => {
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
    }, [item]);

    const organizationLabel = useMemo(() => {
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
    }, [item.type, t]);

    const typeLabel = useMemo(() => {
      switch (item.type) {
        case "event": {
          return t("detail.event");
        }
        case "exhibit": {
          return t("detail.exhibit");
        }
        case "stall": {
          return t("detail.stall");
        }
        case "sponsor": {
          return t("detail.sponsor");
        }
        // No default
      }
      return "";
    }, [item.type, t]);

    // Determine image source with fallback
    const imageSrc = useMemo(() => {
      if (hasImageError) {
        return placeholderImage;
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

      return placeholderImage;
    }, [hasImageError, item, placeholderImage]);

    // Format text with highlighting if provided
    const formatText = useCallback(
      (text: string) => {
        return highlightText ? highlightText(text) : text;
      },
      [highlightText],
    );

    // Set up hover animations
    useEffect(() => {
      if (!cardRef.current || !showAnimation) return;

      const card = cardRef.current;
      const hoverTimeline = gsap.timeline({ paused: true });

      // Card shadow animation (avoid animating transform on the card itself
      // because that creates a new stacking/compositing context and breaks
      // child mix-blend-mode rendering)
      hoverTimeline.to(card, {
        boxShadow:
          variant === "featured"
            ? "0 12px 24px rgba(0, 0, 0, 0.2)"
            : variant === "timeline"
              ? "0 6px 16px rgba(0, 0, 0, 0.12)"
              : "0 8px 20px rgba(0, 0, 0, 0.15)",
        duration: DURATION.FAST,
        ease: EASE.SMOOTH,
      });

      // Image scale animation
      if (imageRef.current) {
        hoverTimeline.to(
          imageRef.current,
          {
            duration: DURATION.FAST,
            ease: EASE.SMOOTH,
            scale:
              variant === "featured"
                ? 1.08
                : variant === "timeline"
                  ? 1.03
                  : 1.05,
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

      // Store timeline for cleanup
      hoverTimelineRef.current = hoverTimeline;

      return () => {
        hoverTimeline.kill();
        hoverTimelineRef.current = null;
      };
    }, [variant, showTags, showAnimation]);

    // Handle mouse events
    const handleMouseEnter = useCallback(() => {
      // Always set hovered state so UI can show/hide details.
      setIsHovered(true);

      // If animations enabled, play timeline
      if (!showAnimation) return;
      const timeline = hoverTimelineRef.current;
      if (timeline) {
        timeline.play();
      }
    }, [showAnimation]);

    const handleMouseLeave = useCallback(() => {
      // Always clear hovered state so UI can hide details.
      setIsHovered(false);

      // If animations enabled, reverse timeline
      if (!showAnimation) return;
      const timeline = hoverTimelineRef.current;
      if (timeline) {
        timeline.reverse();
      }
    }, [showAnimation]);

    // Handle bookmark toggle with animation
    const handleBookmarkClick = useCallback(
      (e: React.MouseEvent) => {
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
      },
      [item.id, toggleBookmark, isBookmarked],
    );

    // Handle image loading
    const handleImageLoad = useCallback(() => {
      setHasImageError(false);
    }, []);

    const handleImageError = useCallback(() => {
      setHasImageError(true);
    }, []);

    // Handle card click
    const handleCardClick = useCallback(
      (e: React.MouseEvent) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      },
      [onClick],
    );

    // Get card classes based on variant
    const getCardClasses = () => {
      const baseClasses = "card cursor-pointer";

      switch (variant) {
        case "featured": {
          return `${baseClasses} h-64`;
        }
        case "timeline": {
          return `schedule-card cursor-pointer relative overflow-hidden border rounded-lg ${
            isHovered ? "h-64" : "h-32"
          }`;
        }
        case "compact": {
          return `${baseClasses} aspect-[4/3]`;
        }
        case "list": {
          return `${baseClasses} flex gap-4 h-32`;
        }
        default: {
          return `${baseClasses} aspect-[4/3]`;
        }
      }
    };

    // Component for text with intelligent marquee
    const SmartScrollableText = ({
      children,
      className = "",
    }: {
      children: React.ReactNode;
      className?: string;
    }) => {
      return (
        <div className={`overflow-hidden ${className}`}>
          <div className="truncate">{children}</div>
        </div>
      );
    };

    // Render Featured Card variant
    if (variant === "featured") {
      const cardContent = (
        <article
          ref={cardRef}
          className={`relative h-64 overflow-hidden rounded-xl transition-all duration-300 ease-[cubic-bezier(0,1,0.5,1)] ${className}`}
          style={{
            boxShadow: isHovered
              ? "0 12px 24px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px rgba(0, 0, 0, 0.1)",
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
        >
          {/* Full Background Image */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <img
              ref={imageRef}
              src={imageSrc}
              alt={item.title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="card-image-no-invert transition-all duration-300 ease-[cubic-bezier(0,1,0.5,1)]"
              style={{
                height: isHovered ? "100%" : "110%",
                minHeight: "100%",
                minWidth: "100%",
                objectFit: "cover",
                width: isHovered ? "100%" : "110%",
              }}
              loading="lazy"
            />
          </div>

          {/* Static gradient overlay for better text visibility - must be before content */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 50%, transparent 100%)",
            }}
          ></div>

          {/* Type Badge - After gradient overlay to be visually on top */}
          <div
            className="absolute top-2.5 left-2.5 z-20"
            style={{ mixBlendMode: "difference" }}
          >
            <span style={{ color: "#eeeeee" }}>
              <ItemTypeIcon type={item.type} size="small" />
            </span>
          </div>

          {/* Bookmark Button - After gradient overlay to be visually on top */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleBookmarkClick(e);
            }}
            className="pointer-events-auto absolute top-1.5 right-2.5 z-[100] transition-all duration-200"
            style={{ color: "#eeeeee", mixBlendMode: "difference" }}
            aria-label={
              isBookmarked(item.id)
                ? t("actions.removeBookmark")
                : t("actions.bookmark")
            }
          >
            <span className="text-base">
              {isBookmarked(item.id) ? "★" : "☆"}
            </span>
          </button>

          {/* Content Overlay */}
          <div className="relative z-20 flex h-full flex-col justify-between p-4 text-white">
            {/* Always visible basic content */}
            <div className="mt-6 space-y-2">
              <h2 className="line-clamp-2 text-xl leading-tight font-bold text-white">
                {formatText(item.title)}
              </h2>

              <div className="flex items-center space-x-4 text-sm text-white opacity-90">
                <div className="flex items-center space-x-1">
                  <TimeIcon size={16} />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LocationIcon size={16} />
                  <span className="truncate text-white">
                    {formatText(item.location)}
                  </span>
                </div>
              </div>
            </div>

            {/* Hover overlay with detailed information */}
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="space-y-2">
                {/* Title */}
                <h2 className="line-clamp-2 text-xl leading-tight font-bold text-white">
                  {formatText(item.title)}
                </h2>

                {/* Description */}
                {showDescription && item.description && (
                  <p className="line-clamp-2 text-sm leading-relaxed text-white opacity-90">
                    {formatText(item.description)}
                  </p>
                )}

                {/* Meta Information */}
                <div className="grid grid-cols-1 gap-1 text-xs text-white opacity-80">
                  <div className="flex items-center space-x-2">
                    <TimeIcon size={16} />
                    <span className="text-white">
                      {item.date} | {item.time}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <LocationIcon size={16} />
                    <span className="truncate text-white">
                      {formatText(item.location)}
                    </span>
                  </div>

                  {organization && (
                    <div className="flex items-center space-x-2">
                      <PeopleIcon size={16} />
                      <span className="truncate text-white">
                        {organizationLabel}: {formatText(organization)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {showTags && item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2 py-1 text-xs font-medium text-white"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="rounded-full px-2 py-1 text-xs font-medium text-white">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* View Details Button */}
                <div className="pt-1">
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-white">
                    {t("actions.viewDetails")}
                    <span>→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      );

      if (onClick) {
        return <div>{cardContent}</div>;
      }

      return (
        <Link
          to={`/detail/${item.type}/${item.id}`}
          className="block"
          aria-label={`${typeLabel}: ${item.title}`}
        >
          {cardContent}
        </Link>
      );
    }

    // Render Timeline Card variant
    if (variant === "timeline") {
      const cardContent = (
        <div
          ref={cardRef}
          className={`${getCardClasses()} ${className}`}
          style={{
            backgroundColor: "var(--color-bg-primary)",
            borderColor: "var(--color-border-primary)",
          }}
          onClick={handleCardClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Full background image */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt={item.title}
            className="card-image-no-invert h-full w-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Static gradient overlay - must be before content (horizontal for timeline) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(50deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 80%, transparent 100%)",
            }}
          ></div>

          {/* Type Badge - After gradient overlay to be visually on top */}
          <div
            className="absolute top-2.5 left-2.5 z-20"
            style={{ mixBlendMode: "difference" }}
          >
            <span style={{ color: "#eeeeee" }}>
              <ItemTypeIcon type={item.type} size="small" />
            </span>
          </div>

          {/* Bookmark Button - After gradient overlay to be visually on top */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleBookmarkClick(e);
            }}
            className="pointer-events-auto absolute top-1.5 right-2.5 z-[100] transition-all duration-200"
            style={{ color: "#eeeeee", mixBlendMode: "difference" }}
            aria-label={
              isBookmarked(item.id)
                ? t("actions.removeBookmark")
                : t("actions.bookmark")
            }
          >
            <span className="text-base">
              {isBookmarked(item.id) ? "★" : "☆"}
            </span>
          </button>

          {/* Content overlay */}
          <div className="absolute inset-0 z-20">
            {/* Basic content (hide via display when hovered to avoid overlap) */}
            <div
              className="absolute right-0 bottom-0 left-0 p-3"
              style={{
                display: isHovered ? "none" : "block",
                opacity: isInitialized ? 1 : 0,
                transition: "opacity 120ms linear",
              }}
            >
              <div className="schedule-card-time text-white">{item.time}</div>
              <h3 className="schedule-card-title mb-1 text-white">
                {formatText(item.title)}
              </h3>
              <div className="flex items-center gap-1 text-xs text-white opacity-80">
                <LocationIcon size={12} />
                <span className="truncate">{formatText(item.location)}</span>
              </div>
            </div>

            {/* Content container - show only when hovered (use display to avoid overlap) */}
            <div
              className="absolute inset-0 flex flex-col justify-center p-3 pt-10"
              style={{
                display: isInitialized ? (isHovered ? "flex" : "none") : "none",
                opacity: isInitialized ? (isHovered ? 1 : 0) : 0,
                pointerEvents: isInitialized
                  ? isHovered
                    ? "auto"
                    : "none"
                  : "none",
                transition: "opacity 120ms linear",
              }}
            >
              <div className="scrollbar-thin max-h-full space-y-2 overflow-y-auto pr-2">
                <h3 className="text-lg font-semibold text-white">
                  {formatText(item.title)}
                </h3>

                {showDescription && item.description && (
                  <p className="line-clamp-3 text-sm leading-relaxed text-white opacity-90">
                    {formatText(item.description)}
                  </p>
                )}

                <div className="space-y-2 text-sm text-white opacity-80">
                  <div className="flex items-center gap-2">
                    <TimeIcon size={16} />
                    <span className="text-white">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LocationIcon size={16} />
                    <span className="text-white">
                      {formatText(item.location)}
                    </span>
                  </div>
                  {organization && (
                    <div className="flex items-center gap-2 text-white">
                      <PeopleIcon size={16} />
                      <span className="truncate text-white">
                        {organizationLabel}: {formatText(organization)}
                      </span>
                    </div>
                  )}
                </div>

                {showTags && item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2 py-1 text-xs text-white"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="rounded-full px-2 py-1 text-xs text-white">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-1">
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-white">
                    {t("actions.viewDetails")}
                    <span>→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      if (onClick) {
        return cardContent;
      }

      return (
        <Link
          to={`/detail/${item.type}/${item.id}`}
          className="block"
          aria-label={`${typeLabel}: ${item.title}`}
        >
          {cardContent}
        </Link>
      );
    }

    // Render List variant (same as timeline with dual animation)
    if (variant === "list") {
      const cardContent = (
        <div
          ref={cardRef}
          className={`schedule-card group relative cursor-pointer overflow-hidden rounded-lg border transition-all duration-500 ease-[cubic-bezier(0,1,0.5,1)] ${
            isHovered ? "h-64" : "h-32"
          } ${className}`}
          style={{
            backgroundColor: "var(--color-bg-primary)",
            borderColor: "var(--color-border-primary)",
          }}
          onClick={handleCardClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Full background image */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt={item.title}
            className="card-image-no-invert h-full w-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Static gradient overlay - must be before content */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(50deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 50%, transparent 100%)",
            }}
          ></div>

          {/* Type Badge - After gradient overlay to be visually on top */}
          <div
            className="absolute top-2.5 left-2.5 z-20"
            style={{ mixBlendMode: "difference" }}
          >
            <span style={{ color: "#eeeeee" }}>
              <ItemTypeIcon type={item.type} size="small" />
            </span>
          </div>

          {/* Bookmark Button - After gradient overlay to be visually on top */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleBookmarkClick(e);
            }}
            className="pointer-events-auto absolute top-1.5 right-2.5 z-[100] transition-all duration-200"
            style={{ color: "#eeeeee", mixBlendMode: "difference" }}
            aria-label={
              isBookmarked(item.id)
                ? t("actions.removeBookmark")
                : t("actions.bookmark")
            }
          >
            <span className="text-base">
              {isBookmarked(item.id) ? "★" : "☆"}
            </span>
          </button>

          {/* Content overlay */}
          <div className="absolute inset-0 z-20">
            {/* Basic content (hidden when hovered to avoid overlap) */}
            <div
              className={`absolute right-0 bottom-0 left-0 p-3`}
              style={{
                display: isHovered ? "none" : "block",
                opacity: isInitialized ? 1 : 0,
              }}
            >
              <div className="schedule-card-time text-white">{item.time}</div>
              <h3 className="schedule-card-title mb-1 text-white">
                {formatText(item.title)}
              </h3>
              <div className="flex items-center gap-1 text-xs text-white opacity-80">
                <LocationIcon size={12} />
                <span className="truncate">{formatText(item.location)}</span>
              </div>
            </div>

            {/* Content container - show only when hovered */}
            <div
              className={`absolute inset-0 p-3 pt-10`}
              style={{
                display: isHovered ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "center",
                opacity: isInitialized ? 1 : 0,
              }}
            >
              <div className="scrollbar-thin max-h-full space-y-2 overflow-y-auto pr-2">
                <h3 className="text-lg font-semibold text-white">
                  {formatText(item.title)}
                </h3>

                {showDescription && item.description && (
                  <p className="line-clamp-3 text-sm leading-relaxed text-white opacity-90">
                    {formatText(item.description)}
                  </p>
                )}

                <div className="space-y-1 text-sm text-white opacity-80">
                  <div className="flex items-center gap-2">
                    <TimeIcon size={16} />
                    <span className="text-white">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LocationIcon size={16} />
                    <span className="text-white">
                      {formatText(item.location)}
                    </span>
                  </div>
                  {organization && (
                    <div className="flex items-center gap-2 text-white">
                      <PeopleIcon size={16} />
                      <span className="truncate text-white">
                        {organizationLabel}: {formatText(organization)}
                      </span>
                    </div>
                  )}
                </div>

                {showTags && item.tags && item.tags.length > 0 && (
                  <div
                    style={{ display: isHovered ? "flex" : "none" }}
                    className="scrollbar-hide flex gap-1 overflow-x-auto"
                  >
                    {item.tags.map((tagName) => (
                      <span key={tagName} className="flex-shrink-0 text-white">
                        <Tag tag={tagName} size="small" interactive={false} />
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-1">
                  <div className="inline-flex items-center gap-2 rounded-md border border-white/40 px-3 py-1 text-sm font-medium text-white">
                    {t("actions.viewDetails")}
                    <span>→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      if (onClick) {
        return cardContent;
      }

      return (
        <Link
          to={`/detail/${item.type}/${item.id}`}
          className="block"
          aria-label={`${typeLabel}: ${item.title}`}
        >
          {cardContent}
        </Link>
      );
    }

    // Render Compact variant (simplified - title only with hover details button)
    if (variant === "compact") {
      const cardContent = (
        <div
          ref={cardRef}
          className={`group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all duration-300 ease-[cubic-bezier(0,1,0.5,1)] ${className}`}
          style={{
            boxShadow: isHovered
              ? "0 10px 20px rgba(0, 0, 0, 0.15)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
        >
          {/* Background Image */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <img
              ref={imageRef}
              src={imageSrc}
              alt={item.title}
              className="card-image-no-invert transition-all duration-300 ease-[cubic-bezier(0,1,0.5,1)]"
              style={{
                height: isHovered ? "100%" : "110%",
                minHeight: "100%",
                minWidth: "100%",
                objectFit: "cover",
                width: isHovered ? "100%" : "110%",
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          </div>

          {/* Static gradient overlay - must be before content */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(15deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0) 80%, transparent 100%)",
            }}
          ></div>

          {/* Type Badge - After gradient overlay to be visually on top */}
          <div
            className="absolute top-2.5 left-2.5 z-20"
            style={{ mixBlendMode: "difference" }}
          >
            <span style={{ color: "#eeeeee" }}>
              <ItemTypeIcon type={item.type} size="small" />
            </span>
          </div>

          {/* Bookmark Button - After gradient overlay to be visually on top */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleBookmarkClick(e);
            }}
            className="pointer-events-auto absolute top-1.5 right-2.5 z-[100] transition-all duration-200"
            style={{ color: "#eeeeee", mixBlendMode: "difference" }}
            aria-label={
              isBookmarked(item.id)
                ? t("actions.removeBookmark")
                : t("actions.bookmark")
            }
          >
            <span className="text-base">
              {isBookmarked(item.id) ? "★" : "☆"}
            </span>
          </button>

          {/* Content overlay */}
          <div className="absolute inset-0 z-20 text-white">
            {/* Title Only - Always Visible (hide when hovered) */}
            <div
              className={`absolute right-0 bottom-0 left-0 p-3`}
              style={{
                display: isHovered ? "none" : "block",
                opacity: isInitialized ? 1 : 0,
              }}
            >
              <h3 className="truncate text-lg font-semibold text-white">
                {formatText(item.title)}
              </h3>
            </div>

            {/* Hover overlay with view details button (show when hovered) */}
            <div
              className="absolute inset-0 p-3 pb-4"
              style={{
                alignItems: "center",
                display: isHovered ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "flex-end",
                opacity: isInitialized ? 1 : 0,
              }}
            >
              <div className="w-full space-y-2 text-center">
                <div className="overflow-hidden">
                  <h3
                    className={`truncate text-base font-semibold whitespace-nowrap text-white`}
                  >
                    {formatText(item.title)}
                  </h3>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-md border border-white/40 px-3 py-1.5 text-xs font-medium text-white">
                  {t("actions.viewDetails")}
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      if (onClick) {
        return cardContent;
      }

      return (
        <Link
          to={`/detail/${item.type}/${item.id}`}
          className="block"
          aria-label={`${typeLabel}: ${item.title}`}
        >
          {cardContent}
        </Link>
      );
    }

    // Render Default/Grid variant (glassmorphism style like original Card.tsx)
    const cardContent = (
      <div
        ref={cardRef}
        className={`group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all duration-300 ease-[cubic-bezier(0,1,0.5,1)] ${className}`}
        style={{
          boxShadow: isHovered
            ? "0 10px 20px rgba(0, 0, 0, 0.15)"
            : "0 2px 4px rgba(0, 0, 0, 0.1)",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        {/* Background Image */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <img
            ref={imageRef}
            src={imageSrc}
            alt={item.title}
            className="card-image-no-invert transition-all duration-300 ease-[cubic-bezier(0,1,0.5,1)]"
            style={{
              height: isHovered ? "100%" : "110%",
              minHeight: "100%",
              minWidth: "100%",
              objectFit: "cover",
              width: isHovered ? "100%" : "110%",
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </div>

        {/* Static gradient overlay - must be before content */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(20deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0) 80%, transparent 100%)",
          }}
        ></div>

        {/* Type Badge - After gradient overlay to be visually on top */}
        <div
          className="absolute top-2.5 left-2.5 z-20"
          style={{ mixBlendMode: "difference" }}
        >
          <span style={{ color: "#eeeeee" }}>
            <ItemTypeIcon type={item.type} size="small" />
          </span>
        </div>

        {/* Bookmark Button - After gradient overlay to be visually on top */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleBookmarkClick(e);
          }}
          className="pointer-events-auto absolute top-1.5 right-2.5 z-[100] transition-all duration-200"
          style={{ color: "#eeeeee", mixBlendMode: "difference" }}
          aria-label={
            isBookmarked(item.id)
              ? t("actions.removeBookmark")
              : t("actions.bookmark")
          }
        >
          <span className="text-base">{isBookmarked(item.id) ? "★" : "☆"}</span>
        </button>

        {/* Content overlay */}
        <div className="absolute inset-0 z-20 text-white">
          {/* Basic Info - Visible when not hovered (use visibility to fully hide on hover) */}
          <div
            className={`absolute right-0 bottom-0 left-0 space-y-1 p-3`}
            style={{
              display: isHovered ? "none" : "block",
              opacity: isInitialized ? 1 : 0,
            }}
          >
            <SmartScrollableText className="text-lg font-semibold text-white">
              {formatText(item.title)}
            </SmartScrollableText>

            <div className="space-y-0.5 text-sm text-white opacity-90">
              <SmartScrollableText className="text-white">
                {" "}
                {item.time}
              </SmartScrollableText>
              <SmartScrollableText className="text-white">
                {" "}
                {item.location}
              </SmartScrollableText>
            </div>
          </div>
          {/* Detailed overlay on hover */}
          <div
            ref={metaRef}
            className="absolute inset-0 p-3 pb-10"
            style={{
              display: isHovered ? "flex" : "none",
              flexDirection: "column",
              justifyContent: "flex-end",
              opacity: isInitialized ? 1 : 0,
            }}
          >
            <div className="space-y-1">
              <SmartScrollableText className="text-lg font-semibold text-white">
                {formatText(item.title)}
              </SmartScrollableText>

              {showDescription && item.description && (
                <p className="line-clamp-3 text-sm text-white opacity-90">
                  {formatText(item.description)}
                </p>
              )}

              <div className="space-y-1 text-sm text-white opacity-80">
                <div className="flex items-center gap-2">
                  <TimeIcon size={16} />
                  <SmartScrollableText className="text-white">
                    {item.time}
                  </SmartScrollableText>
                </div>
                <div className="flex items-center gap-2">
                  <LocationIcon size={16} />
                  <SmartScrollableText className="text-white">
                    {item.location}
                  </SmartScrollableText>
                </div>
                {organization && (
                  <div className="flex items-center gap-2 text-white">
                    <PeopleIcon size={16} />
                    <SmartScrollableText className="text-white">
                      {organizationLabel}: {organization}
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
              className={`absolute right-3 bottom-1 left-3`}
              style={{
                display: isHovered ? "block" : "none",
                opacity: isInitialized ? 1 : 0,
              }}
            >
              <div
                className="scrollbar-hide flex gap-1 overflow-x-auto"
                style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
              >
                {item.tags.map((tagName) => (
                  <span key={tagName} className="flex-shrink-0">
                    <Tag tag={tagName} size="small" interactive={false} />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );

    if (onClick) {
      return cardContent;
    }

    return (
      <Link
        to={`/detail/${item.type}/${item.id}`}
        className="block"
        aria-label={`${typeLabel}: ${item.title}`}
      >
        {cardContent}
      </Link>
    );
  },
);

UnifiedCard.displayName = "UnifiedCard";

export default UnifiedCard;
