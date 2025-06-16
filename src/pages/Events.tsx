import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { dataManager } from "../data/dataManager";
import { Item } from "../types/common";
import CardGrid from "../components/common/CardGrid";
import CardListToggle from "../components/common/CardListToggle";
import TagFilter from "../components/common/TagFilter";
import SelectedTags from "../components/common/SelectedTags";
import TabButtons from "../components/common/TabButtons";

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

  // Tab options for date filter
  const dateOptions = [
    { value: "all", label: t("events.allDays") },
    { value: "2025-06-15", label: t("events.day1") },
    { value: "2025-06-16", label: t("events.day2") },
  ];

  return (
    <div className="min-h-screen">
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="section-title">{t("events.title")}</h1>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <TabButtons
                options={dateOptions}
                activeValue={dateFilter}
                onChange={(value) => setDateFilter(value as typeof dateFilter)}
                className="rounded-lg overflow-hidden"
              />

              <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <TagFilter onFilter={() => {}} compact={true} />
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
      </section>
    </div>
  );
};

export default Events;
