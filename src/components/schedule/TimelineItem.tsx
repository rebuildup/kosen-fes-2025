import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import { Item } from "../../types/common";
import ItemTypeIcon from "../common/ItemTypeIcon";
import Tag from "../common/Tag";

interface TimelineItemProps {
  item: Item;
}

const TimelineItem = ({ item }: TimelineItemProps) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();
  const [expanded, setExpanded] = useState(false);

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

  // Toggle expanded state
  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(item.id);
  };

  return (
    <div
      className={`timeline-item ${expanded ? "expanded" : ""}`}
      onClick={handleToggleExpand}
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

      {expanded && (
        <div className="timeline-item-expanded">
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
      )}
    </div>
  );
};

export default TimelineItem;
