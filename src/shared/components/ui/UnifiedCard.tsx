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
import { getTypeLabel, formatDuration } from "../../../utils/formatters";
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
  }: UnifiedCardProps) => {
    const { t, language } = useLanguage();
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

    const typeLabel = useMemo(() => getTypeLabel(item.type, t), [item.type, t]);

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
        y: variant === "featured" ? -8 : -6,
        boxShadow:
          variant === "featured"
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
    const handleBookmarkClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(item.id);
      },
      [item.id, toggleBookmark]
    );

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
      return "";
    }, [variant, isHovered, isImageLoaded]);

    const cardContent = (
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div>
          <img
            ref={imageRef}
            src={hasImageError ? placeholderImage : item.imageUrl}
            alt={item.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />

          {/* Type Label */}
          <div>
            <ItemTypeIcon type={item.type} size="small" />
            <span>{typeLabel}</span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            aria-label={
              isBookmarked(item.id) ? t("bookmarks.remove") : t("bookmarks.add")
            }
          >
            {isBookmarked(item.id) ? "★" : "☆"}
          </button>
        </div>

        {/* Content Section */}
        <div>
          <h3>{formatText(item.title)}</h3>

          {showDescription && item.description && (
            <p>{formatText(item.description)}</p>
          )}

          {/* Meta Information */}
          <div ref={metaRef}>
            <div>
              <TimeIcon size={16} />
              <span>{formatDuration(parseInt(item.time, 10), language)}</span>
            </div>

            <div>
              <LocationIcon size={16} />
              <span>{item.location}</span>
            </div>

            {organization && (
              <div>
                <PeopleIcon size={16} />
                <span>{formatText(organization)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {showTags && item.tags?.length > 0 && (
            <div ref={tagsRef}>
              {item.tags.slice(0, 3).map((tag, idx) => (
                <Tag key={idx} tag={tag} size="small" />
              ))}
              {item.tags.length > 3 && <span>+{item.tags.length - 3}</span>}
            </div>
          )}
        </div>
      </div>
    );

    // Wrap with Link if no custom onClick handler
    if (!onClick) {
      return <Link to={`/detail/${item.type}/${item.id}`}>{cardContent}</Link>;
    }

    return cardContent;
  }
);

UnifiedCard.displayName = "UnifiedCard";

export default UnifiedCard;
