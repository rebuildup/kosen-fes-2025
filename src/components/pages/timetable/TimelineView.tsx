import React from "react";
import { SearchResult } from "../../../types/common";
import TimelineItem from "./TimelineItem";

interface TimelineViewProps {
  items: SearchResult[];
  onItemClick: (item: SearchResult) => void;
  className?: string;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  items,
  onItemClick,
  className = "",
}) => {
  // Group items by hour to create time blocks
  const groupedByHour: Record<string, SearchResult[]> = {};

  items.forEach((item) => {
    if (!item.date) return;

    // Extract hour from date (e.g. "2025-05-15 10:00" -> "10:00")
    const timePart = item.date.split(" ")[1] || "";
    const hour = timePart.split(":")[0] || "";

    if (!groupedByHour[hour]) {
      groupedByHour[hour] = [];
    }

    groupedByHour[hour].push(item);
  });

  // Sort hours
  const sortedHours = Object.keys(groupedByHour).sort();

  return (
    <div className={`timeline-view ${className}`}>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-16 sm:left-24 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800"></div>

        {/* Time blocks */}
        <div className="space-y-8">
          {sortedHours.map((hour) => (
            <div key={hour} className="time-block">
              {/* Hour label */}
              <div className="flex items-start mb-4">
                <div className="w-16 sm:w-24 flex-shrink-0 pr-4 font-semibold text-right text-gray-600 dark:text-gray-400">
                  {`${hour}:00`}
                </div>
                <div className="relative">
                  <div className="absolute -left-[9px] top-1.5 h-3 w-3 rounded-full bg-primary-500"></div>
                </div>
              </div>

              {/* Events in this hour */}
              <div className="ml-16 sm:ml-24 space-y-4">
                {groupedByHour[hour].map((item) => (
                  <TimelineItem
                    key={`${item.type}-${item.id}`}
                    item={item}
                    onClick={() => onItemClick(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
