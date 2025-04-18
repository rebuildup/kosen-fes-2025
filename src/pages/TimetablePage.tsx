import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { events } from "../data/events";
import { exhibitions } from "../data/exhibitions";
import { foodStalls } from "../data/foodStalls";
import TimelineView from "../components/pages/timetable/TimelineView";
import TimetableHeader from "../components/pages/timetable/TimetableHeader";
import DaySelector from "../components/pages/timetable/DaySelector";
import { SearchResult } from "../types/common";

// Define festival days
const FESTIVAL_DAYS = ["2025-05-15", "2025-05-16", "2025-05-17"];

const TimetablePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get day from URL params or default to day 1
  const dayParam = searchParams.get("day");
  const initialDayIndex =
    FESTIVAL_DAYS.indexOf(dayParam || "") !== -1
      ? FESTIVAL_DAYS.indexOf(dayParam || "")
      : 0;

  const [activeDay, setActiveDay] = useState(initialDayIndex);
  const [timelineItems, setTimelineItems] = useState<SearchResult[]>([]);

  // Combine all items
  useEffect(() => {
    const allItems: SearchResult[] = [
      ...events.map((event) => ({ ...event, type: "event" as const })),
      ...exhibitions.map((exhibition) => ({
        ...exhibition,
        type: "exhibition" as const,
      })),
      ...foodStalls.map((foodStall) => ({
        ...foodStall,
        type: "foodStall" as const,
      })),
    ];

    // Filter items for the selected day
    const filtered = allItems.filter((item) => {
      if (!item.date) return false;
      return item.date.startsWith(FESTIVAL_DAYS[activeDay]);
    });

    // Sort by time
    const sorted = [...filtered].sort((a, b) => {
      if (a.date && b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0;
    });

    setTimelineItems(sorted);
  }, [activeDay]);

  // Handle day change
  const handleDayChange = (dayIndex: number) => {
    setActiveDay(dayIndex);

    // Update URL params
    searchParams.set("day", FESTIVAL_DAYS[dayIndex]);
    setSearchParams(searchParams);
  };

  // Handle item click
  const handleItemClick = (item: SearchResult) => {
    let path = "";

    switch (item.type) {
      case "event":
        path = `/events/${item.id}`;
        break;
      case "exhibition":
        path = `/exhibitions/${item.id}`;
        break;
      case "foodStall":
        path = `/food-stalls/${item.id}`;
        break;
    }

    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="timetable-page pb-8">
      {/* Timetable Header */}
      <TimetableHeader />

      <div className="container mx-auto px-4">
        {/* Day Selector */}
        <div className="mb-8">
          <DaySelector
            days={FESTIVAL_DAYS.map((day, index) => ({
              date: day,
              label: `${t(`timetable.day`)} ${index + 1}`,
            }))}
            activeDay={activeDay}
            onChange={handleDayChange}
          />
        </div>

        {/* Timeline View */}
        {timelineItems.length > 0 ? (
          <TimelineView items={timelineItems} onItemClick={handleItemClick} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {t("timetable.noEvents")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetablePage;
