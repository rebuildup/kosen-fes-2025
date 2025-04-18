import React, { useState } from "react";
import { SearchResult } from "../../../types/common";
import { useLanguage } from "../../../hooks/useLanguage";
import ImageWithFallback from "../../common/ImageWithFallback";

interface LocationCardProps {
  item: SearchResult;
  onClick: () => void;
  className?: string;
}

const LocationCard: React.FC<LocationCardProps> = ({
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

  // Get type label and color
  const getTypeInfo = () => {
    switch (item.type) {
      case "event":
        return {
          label: t("header.events"),
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        };
      case "exhibition":
        return {
          label: t("exhibitions.exhibitions"),
          color:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        };
      case "foodStall":
        return {
          label: t("exhibitions.foodStalls"),
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        };
      default:
        return {
          label: "",
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        };
    }
  };

  const typeInfo = getTypeInfo();

  return (
    <div
      className={`location-card cursor-pointer transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className={`bg-background-card rounded-lg shadow-sm overflow-hidden transition-all duration-300
                      ${isHovered ? "shadow-md translate-x-1" : ""}`}
      >
        <div className="p-3">
          {/* Card header */}
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">{item.title}</h4>
            {item.date && (
              <div className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                {getTime(item.date)}
              </div>
            )}
          </div>

          {/* Type badge */}
          <div className="mb-2">
            <span
              className={`inline-block text-xs px-2 py-0.5 rounded-full ${typeInfo.color}`}
            >
              {typeInfo.label}
            </span>
          </div>

          {/* Expanded content when hovered */}
          <div
            className={`overflow-hidden transition-all duration-300 
                         ${
                           isHovered
                             ? "max-h-60 opacity-100"
                             : "max-h-0 opacity-0"
                         }`}
          >
            {/* Image */}
            <div className="mt-2 mb-2 rounded-md overflow-hidden">
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                className="w-full h-24 object-cover"
              />
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
