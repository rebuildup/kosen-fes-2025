import React, { useState } from "react";
import { SearchResult } from "../../../types/common";
import { useLanguage } from "../../../hooks/useLanguage";
import ImageWithFallback from "../../common/ImageWithFallback";
import Tag from "../../common/Tag";

interface TimelineItemProps {
  item: SearchResult;
  onClick: () => void;
  className?: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  item,
  onClick,
  className = "",
}) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Extract time from date (e.g. "2025-05-15 10:00" -> "10:00")
  const getTime = (dateString?: string) => {
    if (!dateString || !dateString.includes(" ")) return "";
    return dateString.split(" ")[1] || "";
  };

  // Get type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "event":
        return t("header.events");
      case "exhibition":
        return t("exhibitions.exhibitions");
      case "foodStall":
        return t("exhibitions.foodStalls");
      default:
        return "";
    }
  };

  return (
    <div
      className={`timeline-item cursor-pointer transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className={`bg-background-card rounded-lg shadow-md overflow-hidden transition-all duration-300
                      ${isHovered ? "shadow-lg translate-x-1" : ""}`}
      >
        <div className="p-4">
          {/* Item header */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {getTime(item.date)}
            </div>
          </div>

          {/* Type badge */}
          <div className="mb-2">
            <span
              className={`inline-block text-xs font-medium px-2 py-1 rounded-full
                           ${
                             item.type === "event"
                               ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                               : item.type === "exhibition"
                               ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                               : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                           }`}
            >
              {getTypeLabel(item.type)}
            </span>
          </div>

          {/* Location */}
          {item.location && (
            <div className="mb-2 text-sm flex items-center text-gray-600 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {item.location}
            </div>
          )}

          {/* Expanded content when hovered */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isHovered ? "max-h-60" : "max-h-0"
            }`}
          >
            {/* Image */}
            <div className="mt-3 mb-3 rounded-md overflow-hidden">
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                className="w-full h-32 object-cover"
              />
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <Tag key={index} label={tag} size="small" />
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
