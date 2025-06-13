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
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 hover:shadow-md ${
        expanded ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      }`}
      onClick={handleToggleExpand}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ItemTypeIcon type={item.type} size="small" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {getTypeLabel()}
            </span>
          </div>
          <button
            className={`p-1 rounded-lg transition-colors ${
              isBookmarked(item.id)
                ? "text-yellow-500 hover:text-yellow-600"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">
          <Link
            to={`/detail/${item.type}/${item.id}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {item.title}
          </Link>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span>🕒</span>
            <span>{item.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <span>{item.location}</span>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            {item.imageUrl && (
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {item.description}
            </p>
            
            {getOrganization() && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>👥</span>
                <span>
                  {getOrganizationLabel()}: {getOrganization()}
                </span>
              </div>
            )}
            
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Tag key={tag} tag={tag} size="small" />
                ))}
              </div>
            )}
            
            <Link
              to={`/detail/${item.type}/${item.id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {t("actions.viewDetails")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;
