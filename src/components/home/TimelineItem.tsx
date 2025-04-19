import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import { Item } from "../../types/common";
import ItemTypeIcon from "../common/ItemTypeIcon";
import Tag from "../common/Tag";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../utils/animations";

interface TimelineItemProps {
  item: Item;
}

const TimelineItem = ({ item }: TimelineItemProps) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();
  const [expanded, setExpanded] = useState(false);

  const itemRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  // Animation for expand/collapse
  useEffect(() => {
    if (!expandedRef.current) return;

    const expandedContent = expandedRef.current;
    const tl = gsap.timeline();

    if (expanded) {
      // Set initial state
      tl.set(expandedContent, {
        display: "block",
        autoAlpha: 0,
        height: 0,
      });

      // Measure content height
      const height = expandedContent.scrollHeight;

      // Animate expansion
      tl.to(expandedContent, {
        autoAlpha: 1,
        height,
        duration: DURATION.NORMAL,
        ease: EASE.SMOOTH,
        onComplete: () => {
          // Clear inline height to allow responsive behavior
          gsap.set(expandedContent, { height: "auto", clearProps: "height" });
        },
      });
    } else {
      // Only run collapse animation if element exists and is visible
      if (expandedContent && expandedContent.style.display !== "none") {
        // Measure current height
        const height = expandedContent.offsetHeight;

        // Set fixed height to allow animation
        gsap.set(expandedContent, { height });

        // Animate collapse
        tl.to(expandedContent, {
          height: 0,
          autoAlpha: 0,
          duration: DURATION.NORMAL,
          ease: EASE.SMOOTH,
          onComplete: () => {
            gsap.set(expandedContent, { display: "none" });
          },
        });
      }
    }

    return () => {
      tl.kill();
    };
  }, [expanded]);

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

  // Toggle expanded state with animation
  const handleToggleExpand = () => {
    setExpanded(!expanded);

    // Add animation to the card itself when expanding/collapsing
    if (itemRef.current) {
      if (!expanded) {
        // Expanding animation
        gsap.to(itemRef.current, {
          backgroundColor: "var(--card-bg)",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        });
      } else {
        // Collapsing animation
        gsap.to(itemRef.current, {
          backgroundColor: "var(--card-bg)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        });
      }
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
        rotation: 36,
        duration: DURATION.FAST,
        ease: EASE.SMOOTH,
        onComplete: () => {
          toggleBookmark(item.id);
          gsap.to(target, {
            scale: 1,
            rotation: 0,
            duration: DURATION.FAST,
            ease: "elastic.out(1, 0.3)",
          });
        },
      });
    }
  };

  return (
    <div
      className={`timeline-item ${expanded ? "expanded" : ""}`}
      onClick={handleToggleExpand}
      ref={itemRef}
    >
      <div className="timeline-item-header">
        <div className="timeline-item-type">
          <ItemTypeIcon type={item.type} size="small" />
          <span className="timeline-item-type-label">{getTypeLabel()}</span>
        </div>

        <button
          className={`timeline-item-bookmark ${
            isBookmarked(item.id) ? "bookmarked" : ""
          }`}
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

      <h3 className="timeline-item-title">
        <Link
          to={`/detail/${item.type}/${item.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {item.title}
        </Link>
      </h3>

      <div className="timeline-item-meta">
        <div className="timeline-item-time">
          <span className="timeline-item-icon">🕒</span>
          <span>{item.time}</span>
        </div>

        <div className="timeline-item-location">
          <span className="timeline-item-icon">📍</span>
          <span>{item.location}</span>
        </div>
      </div>

      <div
        className="timeline-item-expanded"
        ref={expandedRef}
        style={{ display: "none", opacity: 0 }}
      >
        {item.imageUrl && (
          <div className="timeline-item-image">
            <img src={item.imageUrl} alt={item.title} />
          </div>
        )}

        <p className="timeline-item-description">{item.description}</p>

        {getOrganization() && (
          <div className="timeline-item-organization">
            <span className="timeline-item-icon">👥</span>
            <span>
              {getOrganizationLabel()}: {getOrganization()}
            </span>
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="timeline-item-tags">
            {item.tags.map((tag) => (
              <Tag key={tag} tag={tag} size="small" />
            ))}
          </div>
        )}

        <Link
          to={`/detail/${item.type}/${item.id}`}
          className="timeline-item-link"
          onClick={(e) => e.stopPropagation()}
        >
          {t("actions.viewDetails")}
        </Link>
      </div>
    </div>
  );
};

export default TimelineItem;
