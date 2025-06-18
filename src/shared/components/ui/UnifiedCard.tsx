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
import { TimeIcon } from "../../../components/icons/TimeIcon";
import { LocationIcon } from "../../../components/icons/LocationIcon";
import { PeopleIcon } from "../../../components/icons/PeopleIcon";

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
    showAnimation = true,
    highlightText,
    onClick,
    className = "",
  }: UnifiedCardProps) => {
    const { t } = useLanguage();
    const { isBookmarked, toggleBookmark } = useBookmark();

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
        case "sponsor":
          return "/images/placeholder-sponsor.jpg";
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

      // Card scale and shadow animation
      hoverTimeline.to(card, {
        y: variant === "featured" ? -8 : variant === "timeline" ? -4 : -6,
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
          return `schedule-card group cursor-pointer relative overflow-hidden transition-all duration-300 ease-out border rounded-lg ${
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
      const textString =
        typeof children === "string" ? children : String(children);
      const shouldMarquee = textString.length > 30 && variant !== "timeline";

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

    // Render Featured Card variant
    if (variant === "featured") {
      const cardContent = (
        <article
          ref={cardRef}
          className={`group relative rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-64 ${className}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
        >
          {/* Full Background Image */}
          <div className="absolute inset-0">
            <img
              ref={imageRef}
              src={imageSrc}
              alt={item.title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative h-full flex flex-col justify-between p-6 text-white">
            {/* Type Badge and Bookmark - Top */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <ItemTypeIcon type={item.type} size="small" />
                <span className="text-xs font-medium">{typeLabel}</span>
              </div>

              {/* Bookmark Button */}
              <button
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isBookmarked(item.id)
                    ? "bg-yellow-500 text-white"
                    : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                }`}
                onClick={handleBookmarkClick}
                aria-label={
                  isBookmarked(item.id)
                    ? t("actions.removeBookmark")
                    : t("actions.bookmark")
                }
              >
                <span className="text-lg">
                  {isBookmarked(item.id) ? "★" : "☆"}
                </span>
              </button>
            </div>

            {/* Always visible basic content */}
            <div className="space-y-2 group-hover:opacity-0 transition-opacity duration-300">
              <h2 className="text-xl font-bold leading-tight line-clamp-2">
                {formatText(item.title)}
              </h2>

              <div className="flex items-center space-x-4 text-sm opacity-90">
                <div className="flex items-center space-x-1">
                  <TimeIcon size={16} />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LocationIcon size={16} />
                  <span className="truncate">{formatText(item.location)}</span>
                </div>
              </div>
            </div>

            {/* Hover overlay with detailed information */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="space-y-3">
                {/* Title */}
                <h2 className="text-xl font-bold leading-tight line-clamp-2">
                  {formatText(item.title)}
                </h2>

                {/* Description */}
                {showDescription && item.description && (
                  <p className="text-sm leading-relaxed line-clamp-2 opacity-90">
                    {formatText(item.description)}
                  </p>
                )}

                {/* Meta Information */}
                <div className="grid grid-cols-1 gap-1 text-xs opacity-80">
                  <div className="flex items-center space-x-2">
                    <TimeIcon size={16} />
                    <span>
                      {item.date} | {item.time}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <LocationIcon size={16} />
                    <span className="truncate">
                      {formatText(item.location)}
                    </span>
                  </div>

                  {organization && (
                    <div className="flex items-center space-x-2">
                      <PeopleIcon size={16} />
                      <span className="truncate">
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
                        className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* View Details Button */}
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium group-hover:bg-white/30 transition-all duration-200">
                    {t("actions.viewDetails")}
                    <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
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
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Gradient overlay with content */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent text-white">
            {/* Always visible basic content */}
            <div
              className={`
              absolute bottom-0 left-0 right-0 p-3 transition-all duration-300
              ${isHovered ? "opacity-0 pointer-events-none" : "opacity-100"}
            `}
            >
              <div className="schedule-card-time">{item.time}</div>
              <h3 className="schedule-card-title mb-1">
                {formatText(item.title)}
              </h3>
              <div className="flex items-center gap-1 text-xs opacity-80">
                <LocationIcon size={12} />
                <span className="truncate">{formatText(item.location)}</span>
              </div>
            </div>

            {/* Expanded content on hover */}
            <div
              className={`
              absolute inset-0 p-4 flex flex-col justify-center
              transition-all duration-300 ease-out
              ${
                isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }
            `}
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
              }}
            >
              <div className="space-y-3 max-h-full overflow-hidden">
                <h3 className="text-lg font-semibold">
                  {formatText(item.title)}
                </h3>

                {showDescription && item.description && (
                  <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
                    {formatText(item.description)}
                  </p>
                )}

                <div className="space-y-2 text-sm opacity-80">
                  <div className="flex items-center gap-2">
                    <TimeIcon size={16} />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LocationIcon size={16} />
                    <span>{formatText(item.location)}</span>
                  </div>
                  {organization && (
                    <div className="flex items-center gap-2">
                      <PeopleIcon size={16} />
                      <span className="truncate">
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
                        className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium">
                    {t("actions.viewDetails")}
                    <span>→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Type Badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
            <ItemTypeIcon type={item.type} size="small" />
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 ${
              isBookmarked(item.id)
                ? "bg-yellow-500 text-white"
                : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            }`}
            aria-label={
              isBookmarked(item.id)
                ? t("actions.removeBookmark")
                : t("actions.bookmark")
            }
          >
            <span className="text-sm">{isBookmarked(item.id) ? "★" : "☆"}</span>
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

    // Render List variant
    if (variant === "list") {
      const cardContent = (
        <div
          ref={cardRef}
          className={`${getCardClasses()} ${className}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
        >
          {/* Image Section */}
          <div className="card-image-container w-32 h-32 flex-shrink-0">
            <img
              ref={imageRef}
              src={imageSrc}
              alt={item.title}
              className="card-image w-full h-full rounded-lg"
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />

            {/* Type Badge */}
            <div className="card-type-badge">
              <ItemTypeIcon type={item.type} size="small" />
              <span className="ml-1 text-xs">{typeLabel}</span>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={handleBookmarkClick}
              className={`card-bookmark-button ${
                isBookmarked(item.id) ? "bookmarked" : ""
              }`}
              aria-label={
                isBookmarked(item.id)
                  ? t("actions.removeBookmark")
                  : t("actions.bookmark")
              }
            >
              {isBookmarked(item.id) ? "★" : "☆"}
            </button>
          </div>

          {/* Content Section */}
          <div className="card-content flex-1">
            <h3 className="card-title">{formatText(item.title)}</h3>

            {showDescription && item.description && (
              <p className="card-description">{formatText(item.description)}</p>
            )}

            {/* Meta Information */}
            <div className="card-meta">
              <TimeIcon size={16} />
              <span>
                {item.date} | {item.time}
              </span>
            </div>

            <div className="card-meta">
              <LocationIcon size={16} />
              <span>{formatText(item.location)}</span>
            </div>

            {organization && (
              <div className="card-meta">
                <PeopleIcon size={16} />
                <span>
                  {organizationLabel}: {formatText(organization)}
                </span>
              </div>
            )}

            {/* Tags */}
            {showTags && item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <Tag key={tag} tag={tag} size="small" />
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs opacity-60">
                    +{item.tags.length - 3}
                  </span>
                )}
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

    // Render Default/Compact/Grid variant (glassmorphism style like original Card.tsx)
    const cardContent = (
      <div
        ref={cardRef}
        className={`relative group cursor-pointer rounded-lg overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 ${
          variant === "compact" ? "aspect-[4/3]" : "aspect-[4/3]"
        } ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        {/* Background Image */}
        <img
          ref={imageRef}
          src={imageSrc}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent text-white">
          {/* Type Badge - Top Left */}
          <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-md rounded-full p-1.5 border border-white/20">
            <ItemTypeIcon type={item.type} size="small" />
          </div>

          {/* Bookmark Button - Top Right */}
          <button
            onClick={handleBookmarkClick}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 backdrop-blur-md border border-white/20 pointer-events-auto z-10 ${
              isBookmarked(item.id)
                ? "bg-yellow-500/90 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
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
              <SmartScrollableText>🕒 {item.time}</SmartScrollableText>
              <SmartScrollableText>📍 {item.location}</SmartScrollableText>
            </div>
          </div>

          {/* Detailed overlay on hover */}
          <div
            ref={metaRef}
            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-center transition-all duration-300 pointer-events-none ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
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
                {organization && (
                  <div className="flex items-center gap-2">
                    <PeopleIcon size={16} />
                    <SmartScrollableText>
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
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs border border-white/10">
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
