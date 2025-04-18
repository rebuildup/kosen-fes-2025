import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { events } from "../data/events";
import { Event, Item } from "../types/common";
import CardGrid from "../components/common/CardGrid";
import CardListToggle from "../components/common/CardListToggle";
import TagFilter from "../components/common/TagFilter";
import SelectedTags from "../components/common/SelectedTags";

const Events = () => {
  const { t } = useLanguage();
  const { filterItemsByTags, selectedTags } = useTag();

  const [viewMode, setViewMode] = useState<
    "default" | "compact" | "grid" | "list"
  >("default");
  const [filteredEvents, setFilteredEvents] = useState<Item[]>(events);
  const [dayFilter, setDayFilter] = useState<"all" | "day1" | "day2">("all");

  // Filter events by selected day and tags
  useEffect(() => {
    let filtered = [...events] as Item[];

    // Filter by day
    if (dayFilter !== "all") {
      const day = dayFilter === "day1" ? "2025-06-15" : "2025-06-16";
      filtered = filtered.filter((event) => event.date === day);
    }

    // Apply tag filtering
    if (selectedTags.length > 0) {
      filtered = filterItemsByTags(filtered);
    }

    setFilteredEvents(filtered);
  }, [dayFilter, selectedTags, filterItemsByTags]);

  // Handle day filter change
  const handleDayFilterChange = (day: "all" | "day1" | "day2") => {
    setDayFilter(day);
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <h1 className="events-title">{t("events.title")}</h1>

        <div className="events-filters">
          <div className="day-filter">
            <button
              className={`day-filter-button ${
                dayFilter === "all" ? "active" : ""
              }`}
              onClick={() => handleDayFilterChange("all")}
            >
              {t("events.filters.all")}
            </button>
            <button
              className={`day-filter-button ${
                dayFilter === "day1" ? "active" : ""
              }`}
              onClick={() => handleDayFilterChange("day1")}
            >
              {t("events.filters.day1")}
            </button>
            <button
              className={`day-filter-button ${
                dayFilter === "day2" ? "active" : ""
              }`}
              onClick={() => handleDayFilterChange("day2")}
            >
              {t("events.filters.day2")}
            </button>
          </div>

          <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      <div className="events-content">
        <div className="events-sidebar">
          <TagFilter onFilter={() => {}} />
        </div>

        <div className="events-main">
          <SelectedTags />

          <CardGrid
            items={filteredEvents}
            variant={viewMode}
            showTags={true}
            showDescription={viewMode === "list"}
            emptyMessage={t("events.noEvents")}
            filterType="event"
          />
        </div>
      </div>
    </div>
  );
};

export default Events;
