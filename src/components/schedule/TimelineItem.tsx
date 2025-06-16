import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import { Item } from "../../types/common";
import ItemTypeIcon from "../common/ItemTypeIcon";

interface TimelineItemProps {
  item: Item;
}

const TimelineItem = ({ item }: TimelineItemProps) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

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

  // Determine image source with proper fallback
  const getImageSrc = () => {
    if (item.imageUrl) {
      return item.imageUrl;
    }

    // Create path to the item image based on type and ID
    if (item.type === "event") {
      const eventNumber = item.id.split("-")[1];
      return `/images/events/event-${eventNumber}.jpg`;
    } else if (item.type === "exhibit") {
      const exhibitNumber = item.id.split("-")[1];
      return `/images/exhibits/exhibit-${exhibitNumber}.jpg`;
    } else if (item.type === "stall") {
      const stallNumber = item.id.split("-")[1];
      return `/images/stalls/stall-${stallNumber}.jpg`;
    }

    return `/images/placeholder.jpg`;
  };

  // Handle card click to navigate to detail page
  const handleCardClick = () => {
    navigate(`/detail/${item.type}/${item.id}`);
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(item.id);
  };

  return (
    <div
      className={`
        schedule-card group cursor-pointer relative overflow-hidden
        transition-all duration-300 ease-out border rounded-lg
        ${isHovered ? "h-64" : "h-32"}
      `}
      style={{
        backgroundColor: "var(--color-bg-primary)",
        borderColor: "var(--color-border-primary)",
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full background image */}
      <img
        src={getImageSrc()}
        alt={item.title}
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay with content */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent text-white">
        {/* Always visible basic content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="schedule-card-time">{item.time}</div>
          <h3 className="schedule-card-title mb-1">{item.title}</h3>
          <div className="flex items-center gap-1 text-xs opacity-80">
            <span>📍</span>
            <span className="truncate">{item.location}</span>
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
          <div className="space-y-3 max-h-full overflow-y-auto">
            <h3 className="text-lg font-semibold">{item.title}</h3>

            <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
              {item.description}
            </p>

            <div className="space-y-2 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <span>🕒</span>
                <span>{item.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{item.location}</span>
              </div>
              {getOrganization() && (
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span className="truncate">
                    {getOrganizationLabel()}: {getOrganization()}
                  </span>
                </div>
              )}
            </div>

            {item.tags && item.tags.length > 0 && (
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
        onClick={handleBookmarkToggle}
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
};

export default TimelineItem;
