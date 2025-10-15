import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { Item } from "../../../types/common";
import { useLanguage } from "../../../context/LanguageContext";
import { useBookmark } from "../../../context/BookmarkContext";
import Tag from "../../../components/common/Tag";
import ItemTypeIcon from "../../../components/common/ItemTypeIcon";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../../utils/animations";
import { TimeIcon, LocationIcon, PeopleIcon } from "../../../components/icons";

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
    item,
    variant = "default",
    showTags = false,
    showDescription = false,
    showAnimation = false,
    highlightText,
    onClick,
    className = "",
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

    const typeLabel = useMemo(() => {
      if (item.type === "event") {
        return t("detail.event");
      } else if (item.type === "exhibit") {
        return t("detail.exhibit");
      } else if (item.type === "stall") {
        return t("detail.stall");
      } else if (item.type === "sponsor") {
        return t("detail.sponsor");
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

      return placeholderImage;
    }, [hasImageError, item, placeholderImage]);

    // Format text with highlighting if provided
    const formatText = useCallback(
      (text: string) => {
        return highlightText ? highlightText(text) : text;
      },
      [highlightText]
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
            scale:
              variant === "featured"
                ? 1.08
                : variant === "timeline"
                ? 1.03
                : 1.05,
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
      },
      [item.id, toggleBookmark, isBookmarked]
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
      [onClick]
    );

    // Get card classes based on variant
    const getCardClasses = () => {
      const baseClasses = "card cursor-pointer";

      switch (variant) {
        case "featured":
          return `${baseClasses} h-64`;
        case "timeline":
          return `schedule-card cursor-pointer relative overflow-hidden border rounded-lg ${
            isHovered ? "h-64" : "h-32"
          }`;
        case "compact":
          return `${baseClasses} aspect-[4/3]`;
        case "list":
          return `${baseClasses} flex gap-4 h-32`;
        default:
          return `${baseClasses} aspect-[4/3]`;
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
          className={`relative rounded-xl overflow-hidden h-64 transition-all duration-300 ease-[cubic-bezier(0,1,0.5,1)] ${className}`}
          style={{
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
            boxShadow: isHovered
              ? "0 12px 24px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
        >
          {/* Full Background Image */}
          <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
            <img
              ref={imageRef}
              src={imageSrc}
              alt={item.title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="card-image-no-invert transition-all duration-300 ease-[cubic-bezier(0,1,0.5,1)]"
              style={{
                width: isHovered ? "100%" : "110%",
                height: isHovered ? "100%" : "110%",
                objectFit: "cover",
                minWidth: "100%",
                minHeight: "100%",
              }}
              loading="lazy"
            />
          </div>

          {/* Content Overlay */}
          <div className="relative h-full flex flex-col justify-between p-4 text-white">
            {/* Type Badge and Bookmark - Top */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 card-foreground">
                <ItemTypeIcon type={item.type} size="small" />
                <span className="text-xs font-medium">{typeLabel}</span>
              </div>

              {/* Bookmark Button */}
              <button
                className="flex items-center card-foreground"
                onClick={handleBookmarkClick}
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
            </div>

            {/* Always visible basic content */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold leading-tight line-clamp-2 card-foreground">
                {formatText(item.title)}
              </h2>

              <div className="flex items-center space-x-4 text-sm opacity-90 card-foreground">
                <div className="flex items-center space-x-1">
                  <TimeIcon size={16} />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LocationIcon size={16} />
                  <span className="truncate card-foreground">
                    {formatText(item.location)}
                  </span>
                </div>
              </div>
            </div>

            {/* Hover overlay with detailed information */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <div className="space-y-2">
                {/* Title */}
                <h2 className="text-xl font-bold leading-tight line-clamp-2 card-foreground">
                  {formatText(item.title)}
                </h2>

                {/* Description */}
                {showDescription && item.description && (
                  <p className="text-sm leading-relaxed line-clamp-2 opacity-90 card-foreground">
                    {formatText(item.description)}
                  </p>
                )}

                {/* Meta Information */}
                <div className="grid grid-cols-1 gap-1 text-xs opacity-80 card-foreground">
                  <div className="flex items-center space-x-2">
                    <TimeIcon size={16} />
                    <span className="card-foreground">
                      {item.date} | {item.time}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <LocationIcon size={16} />
                    <span className="truncate card-foreground">
                      {formatText(item.location)}
                    </span>
                  </div>

                  {organization && (
                    <div className="flex items-center space-x-2">
                      <PeopleIcon size={16} />
                      <span className="truncate card-foreground">
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
                        className="px-2 py-1  rounded-full text-xs font-medium card-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-2 py-1  rounded-full text-xs font-medium card-foreground">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* View Details Button */}
                <div className="pt-1">
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium card-foreground">
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
            className="w-full h-full object-cover card-image-no-invert"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Content overlay */}
          <div className="absolute inset-0">
            {/* Basic content (hide via display when hovered to avoid overlap) */}
            <div
              className="absolute bottom-0 left-0 right-0 p-3"
              style={{
                display: isHovered ? "none" : "block",
                opacity: !isInitialized ? 0 : 1,
                transition: "opacity 120ms linear",
              }}
            >
              <div className="schedule-card-time card-foreground">
                {item.time}
              </div>
              <h3 className="schedule-card-title mb-1 card-foreground">
                {formatText(item.title)}
              </h3>
              <div className="flex items-center gap-1 text-xs opacity-80 card-foreground">
                <LocationIcon size={12} />
                <span className="truncate">{formatText(item.location)}</span>
              </div>
            </div>

            {/* Content container - show only when hovered (use display to avoid overlap) */}
            <div
              className="absolute inset-0 p-3 pt-10 flex flex-col justify-center"
              style={{
                display: !isInitialized ? "none" : isHovered ? "flex" : "none",
                opacity: !isInitialized ? 0 : isHovered ? 1 : 0,
                pointerEvents: !isInitialized
                  ? "none"
                  : isHovered
                  ? "auto"
                  : "none",
                transition: "opacity 120ms linear",
              }}
            >
              <div className="space-y-2 max-h-full overflow-y-auto scrollbar-thin pr-2">
                <h3 className="text-lg font-semibold card-foreground">
                  {formatText(item.title)}
                </h3>

                {showDescription && item.description && (
                  <p className="text-sm leading-relaxed opacity-90 line-clamp-3 card-foreground">
                    {formatText(item.description)}
                  </p>
                )}

                <div className="space-y-2 text-sm opacity-80 card-foreground">
                  <div className="flex items-center gap-2">
                    <TimeIcon size={16} />
                    <span className="card-foreground">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LocationIcon size={16} />
                    <span className="card-foreground">
                      {formatText(item.location)}
                    </span>
                  </div>
                  {organization && (
                    <div className="flex items-center gap-2 card-foreground">
                      <PeopleIcon size={16} />
                      <span className="truncate card-foreground">
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
                        className="px-2 py-1  rounded-full text-xs card-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-2 py-1  rounded-full text-xs card-foreground">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-1">
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium card-foreground">
                    {t("actions.viewDetails")}
                    <span>→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Type Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 card-foreground">
            <ItemTypeIcon type={item.type} size="small" />
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className="absolute top-1.5 right-2.5 flex items-center card-foreground"
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
          className={`schedule-card group cursor-pointer relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0,1,0.5,1)] border rounded-lg ${
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
            className="w-full h-full object-cover card-image-no-invert"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Content overlay */}
          <div className="absolute inset-0">
            {/* Basic content (hidden when hovered to avoid overlap) */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-3`}
              style={{
                display: isHovered ? "none" : "block",
                opacity: !isInitialized ? 0 : 1,
              }}
            >
              <div className="schedule-card-time card-foreground">
                {item.time}
              </div>
              <h3 className="schedule-card-title mb-1 card-foreground">
                {formatText(item.title)}
              </h3>
              <div className="flex items-center gap-1 text-xs opacity-80 card-foreground">
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
                opacity: !isInitialized ? 0 : 1,
              }}
            >
              <div className="space-y-2 max-h-full overflow-y-auto scrollbar-thin pr-2">
                <h3 className="text-lg font-semibold card-foreground">
                  {formatText(item.title)}
                </h3>

                {showDescription && item.description && (
                  <p className="text-sm leading-relaxed opacity-90 line-clamp-3 card-foreground">
                    {formatText(item.description)}
                  </p>
                )}

                <div className="space-y-1 text-sm opacity-80 card-foreground">
                  <div className="flex items-center gap-2">
                    <TimeIcon size={16} />
                    <span className="card-foreground">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LocationIcon size={16} />
                    <span className="card-foreground">
                      {formatText(item.location)}
                    </span>
                  </div>
                  {organization && (
                    <div className="flex items-center gap-2 card-foreground">
                      <PeopleIcon size={16} />
                      <span className="truncate card-foreground">
                        {organizationLabel}: {formatText(organization)}
                      </span>
                    </div>
                  )}
                </div>

                {showTags && item.tags && item.tags.length > 0 && (
                  <div
                    style={{ display: isHovered ? "flex" : "none" }}
                    className="flex gap-1 overflow-x-auto scrollbar-hide"
                  >
                    {item.tags.map((tagName) => (
                      <span
                        key={tagName}
                        className="flex-shrink-0 card-foreground"
                      >
                        <Tag tag={tagName} size="small" interactive={false} />
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium card-foreground border border-white/40 rounded-md">
                    {t("actions.viewDetails")}
                    <span>→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Type Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 card-foreground">
            <ItemTypeIcon type={item.type} size="small" />
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className="absolute top-1.5 right-2.5 flex items-center card-foreground"
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
          className={`relative group cursor-pointer rounded-lg overflow-hidden bg-white/5 border border-white/10 aspect-[4/3] transition-all duration-300 ease-[cubic-bezier(0,1,0.5,1)] ${className}`}
          style={{
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
            boxShadow: isHovered
              ? "0 10px 20px rgba(0, 0, 0, 0.15)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
        >
          {/* Background Image */}
          <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
            <img
              ref={imageRef}
              src={imageSrc}
              alt={item.title}
              className="card-image-no-invert transition-all duration-300 ease-[cubic-bezier(0,1,0.5,1)]"
              style={{
                width: isHovered ? "100%" : "110%",
                height: isHovered ? "100%" : "110%",
                objectFit: "cover",
                minWidth: "100%",
                minHeight: "100%",
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0 text-white">
            {/* Type Badge - Top Left */}
            <div className="absolute top-2.5 left-2.5 card-foreground">
              <ItemTypeIcon type={item.type} size="small" />
            </div>

            {/* Bookmark Button - Top Right */}
            <button
              onClick={handleBookmarkClick}
              className="absolute top-1.5 right-2.5 flex items-center pointer-events-auto z-10 card-foreground"
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

            {/* Title Only - Always Visible (hide when hovered) */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-3`}
              style={{
                display: isHovered ? "none" : "block",
                opacity: !isInitialized ? 0 : 1,
              }}
            >
              <h3 className="font-semibold text-lg truncate card-foreground">
                {formatText(item.title)}
              </h3>
            </div>

            {/* Hover overlay with view details button (show when hovered) */}
            <div
              className="absolute inset-0 p-3 pb-4"
              style={{
                display: isHovered ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                opacity: !isInitialized ? 0 : 1,
              }}
            >
              <div className="text-center space-y-2 w-full">
                <div className="overflow-hidden">
                  <h3
                    className={`text-base font-semibold whitespace-nowrap truncate card-foreground`}
                  >
                    {formatText(item.title)}
                  </h3>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium card-foreground border border-white/40 rounded-md">
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
        className={`relative group cursor-pointer rounded-lg overflow-hidden bg-white/5 border border-white/10 aspect-[4/3] transition-all duration-300 ease-[cubic-bezier(0,1,0.5,1)] ${className}`}
        style={{
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 10px 20px rgba(0, 0, 0, 0.15)"
            : "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
          <img
            ref={imageRef}
            src={imageSrc}
            alt={item.title}
            className="card-image-no-invert transition-all duration-300 ease-[cubic-bezier(0,1,0.5,1)]"
            style={{
              width: isHovered ? "100%" : "110%",
              height: isHovered ? "100%" : "110%",
              objectFit: "cover",
              minWidth: "100%",
              minHeight: "100%",
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 text-white">
          {/* Type Badge - Top Left */}
          <div className="absolute top-2.5 left-2.5 card-foreground">
            <ItemTypeIcon type={item.type} size="small" />
          </div>
          {/* Bookmark Button - Top Right */}
          <button
            onClick={handleBookmarkClick}
            className="absolute top-1.5 right-2.5 flex items-center pointer-events-auto z-10 card-foreground"
            aria-label={
              isBookmarked(item.id)
                ? t("actions.removeBookmark")
                : t("actions.bookmark")
            }
          >
            <span className="text-base">
              {isBookmarked(item.id) ? "★" : "☆"}
            </span>
          </button>{" "}
          {/* Basic Info - Visible when not hovered (use visibility to fully hide on hover) */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 space-y-1`}
            style={{
              display: isHovered ? "none" : "block",
              opacity: !isInitialized ? 0 : 1,
            }}
          >
            <SmartScrollableText className="font-semibold text-lg card-foreground">
              {formatText(item.title)}
            </SmartScrollableText>

            <div className="space-y-0.5 text-sm opacity-90 card-foreground">
              <SmartScrollableText className="card-foreground">
                {" "}
                {item.time}
              </SmartScrollableText>
              <SmartScrollableText className="card-foreground">
                {" "}
                {item.location}
              </SmartScrollableText>
            </div>
          </div>
          {/* Detailed overlay on hover */}
          <div
            ref={metaRef}
            className="absolute inset-0 p-3 pb-8"
            style={{
              display: isHovered ? "flex" : "none",
              flexDirection: "column",
              justifyContent: "flex-end",
              opacity: !isInitialized ? 0 : 1,
            }}
          >
            <div className="space-y-1">
              <SmartScrollableText className="text-lg font-semibold card-foreground">
                {formatText(item.title)}
              </SmartScrollableText>

              {showDescription && item.description && (
                <p className="text-sm opacity-90 line-clamp-3 card-foreground">
                  {formatText(item.description)}
                </p>
              )}

              <div className="space-y-1 text-sm opacity-80 card-foreground">
                <div className="flex items-center gap-2">
                  <TimeIcon size={16} />
                  <SmartScrollableText className="card-foreground">
                    {item.time}
                  </SmartScrollableText>
                </div>
                <div className="flex items-center gap-2">
                  <LocationIcon size={16} />
                  <SmartScrollableText className="card-foreground">
                    {item.location}
                  </SmartScrollableText>
                </div>
                {organization && (
                  <div className="flex items-center gap-2 card-foreground">
                    <PeopleIcon size={16} />
                    <SmartScrollableText className="card-foreground">
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
              className={`absolute bottom-1 left-3 right-3`}
              style={{
                display: isHovered ? "block" : "none",
                opacity: !isInitialized ? 0 : 1,
              }}
            >
              <div
                className="flex gap-1 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
  }
);

UnifiedCard.displayName = "UnifiedCard";

export default UnifiedCard;
