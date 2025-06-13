import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { dataManager } from "../data/dataManager";
import { Item } from "../types/common";
import CardGrid from "../components/common/CardGrid";
import CardListToggle from "../components/common/CardListToggle";
import TagFilter from "../components/common/TagFilter";
import SelectedTags from "../components/common/SelectedTags";

// CSS removed - using TailwindCSS classes instead

const Events = () => {
  const { t } = useLanguage();
  const { filterItemsByTags, selectedTags } = useTag();

  const [viewMode, setViewMode] = useState<
    "default" | "compact" | "grid" | "list"
  >("default");
  const [filteredEvents, setFilteredEvents] = useState<Item[]>([]);
  const [dateFilter, setDateFilter] = useState<
    "all" | "2025-06-15" | "2025-06-16"
  >("all");

  // Filter events by selected day and tags
  useEffect(() => {
    // Get all events from dataManager
    let filtered = dataManager.getAllEvents() as Item[];

    // Filter by day
    if (dateFilter !== "all") {
      const day = dateFilter === "2025-06-15" ? "2025-06-15" : "2025-06-16";
      filtered = filtered.filter((event) => event.date === day);
    }

    // Apply tag filtering
    if (selectedTags.length > 0) {
      filtered = filterItemsByTags(filtered);
    }

    setFilteredEvents(filtered);
  }, [dateFilter, selectedTags, filterItemsByTags]);

  // Handle day filter change
  const handleDayFilterChange = (day: "all" | "2025-06-15" | "2025-06-16") => {
    setDateFilter(day);
  };

  return (
    <div>
      <div>
        <h1>{t("events.title")}</h1>

        <div>
          <div>
            <button onClick={() => setDateFilter("all")}>
              {t("events.allDays")}
            </button>
            <button onClick={() => setDateFilter("2025-06-15")}>
              {t("events.day1")}
            </button>
            <button onClick={() => setDateFilter("2025-06-16")}>
              {t("events.day2")}
            </button>
          </div>

          <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      <div>
        <div>
          <TagFilter onFilter={() => {}} />
          <SelectedTags />
        </div>

        <div>
          <CardGrid
            items={filteredEvents}
            variant={viewMode}
            showTags={true}
            showDescription={viewMode === "list"}
            emptyMessage={t("events.noEventsFound")}
            filterType="all"
          />
        </div>
      </div>
    </div>
  );
};

export default Events;
