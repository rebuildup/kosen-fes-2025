import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchResult } from "../../../types/common";
import { useLanguage } from "../../../hooks/useLanguage";
import ImageWithFallback from "../../common/ImageWithFallback";
import Tag from "../../common/Tag";

interface TimelineProps {
  items: SearchResult[];
  className?: string;
}

interface GroupedItems {
  [date: string]: SearchResult[];
}

const Timeline: React.FC<TimelineProps> = ({ items, className = "" }) => {
  const { t, language } = useLanguage();
  const [groupedItems, setGroupedItems] = useState<GroupedItems>({});
  const [dates, setDates] = useState<string[]>([]);

  // Function to format date based on current language
  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Group items by date
  useEffect(() => {
    const grouped: GroupedItems = {};

    items.forEach((item) => {
      if (!item.date) return;

      // Extract the date part (ignore time)
      const datePart = item.date.split(" ")[0];

      if (!grouped[datePart]) {
        grouped[datePart] = [];
      }

      grouped[datePart].push(item);
    });

    // Sort dates
    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    setGroupedItems(grouped);
    setDates(sortedDates);
  }, [items]);

  // Get link path for each item based on its type
  const getLinkPath = (item: SearchResult) => {
    switch (item.type) {
      case "event":
        return `/events/${item.id}`;
      case "exhibition":
        return `/exhibitions/${item.id}`;
      case "foodStall":
        return `/food-stalls/${item.id}`;
      default:
        return "#";
    }
  };

  // If no items, show a placeholder
  if (dates.length === 0) {
    return (
      <div className={`timeline-empty ${className} py-8 text-center`}>
        <p className="text-gray-600 dark:text-gray-400">{t("home.noEvents")}</p>
      </div>
    );
  }

  return (
    <div className={`timeline ${className}`}>
      {dates.map((date, dateIndex) => (
        <div key={date} className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">{formatDate(date)}</h3>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-800"></div>

            {/* Timeline items */}
            <div className="space-y-4">
              {groupedItems[date].map((item, itemIndex) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  to={getLinkPath(item)}
                  className="block"
                >
                  <div className="flex">
                    {/* Timeline dot */}
                    <div className="relative mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary-500"></div>
                    </div>

                    {/* Card */}
                    <div className="flex-grow overflow-hidden rounded-lg bg-background-card shadow-md transition-transform duration-200 hover:translate-x-1 hover:shadow-lg">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image (hidden on small screens) */}
                        <div className="h-24 w-full sm:h-auto sm:w-32 md:w-48">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <h4 className="text-base font-semibold">
                              {item.title}
                            </h4>
                            <div className="ml-2 shrink-0 text-xs text-gray-500 dark:text-gray-400">
                              {item.date && item.date.includes(" ")
                                ? item.date.split(" ")[1]
                                : ""}
                            </div>
                          </div>

                          {item.location && (
                            <div className="mb-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-1 h-4 w-4"
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

                          {item.description && (
                            <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                              {item.description}
                            </p>
                          )}

                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-auto flex flex-wrap gap-1">
                              {item.tags.slice(0, 2).map((tag, tagIndex) => (
                                <Tag key={tagIndex} label={tag} size="small" />
                              ))}
                              {item.tags.length > 2 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  +{item.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Show line end for last date */}
            {dateIndex === dates.length - 1 && (
              <div className="absolute bottom-0 left-3 h-3 w-0.5 rounded-b bg-background-primary"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
