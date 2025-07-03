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
import { events } from "../data/events";

// CSS removed - using TailwindCSS classes instead

const getRandomEventImage = () => {
  const images = events.map((e) => e.imageUrl).filter(Boolean);
  return images[Math.floor(Math.random() * images.length)] || "";
};

const Events = () => {
  const { t } = useLanguage();
  const { filterItemsByTags, selectedTags } = useTag();

  const [viewMode, setViewMode] = useState<
    "default" | "compact" | "grid" | "list"
  >("default");
  const [filteredEvents, setFilteredEvents] = useState<Item[]>([]);
  const [dateFilter, setDateFilter] = useState<
    "all" | "2025-11-08" | "2025-11-09"
  >("all");

  // Filter events by selected day and tags
  useEffect(() => {
    // Get all events from dataManager
    let filtered = dataManager.getAllEvents() as Item[];

    // Filter by day
    if (dateFilter !== "all") {
      const day = dateFilter === "2025-11-08" ? "2025-11-08" : "2025-11-09";
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
    { value: "all", label: t("events.filters.all") },
    { value: "2025-11-08", label: t("events.filters.day1") },
    { value: "2025-11-09", label: t("events.filters.day2") },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16">
        {/* 透かし画像 */}
        <img
          src={getRandomEventImage()}
          className="absolute inset-0 w-full h-full object-cover opacity-20 z-0 pointer-events-none"
          alt=""
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: "var(--instagram-gradient)" }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              {t("events.title")}
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              {t("events.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Filter Controls - Day selection and View mode */}
            <div className="flex flex-row items-center sm:justify-between gap-3 overflow-x-auto pb-2 scrollbar-thin mobile-scroll">
              {/* Date filter tabs - Left aligned on wide screens */}
              <div className="flex-shrink-0">
                <TabButtons
                  options={dateOptions}
                  activeValue={dateFilter}
                  onChange={(value) =>
                    setDateFilter(value as typeof dateFilter)
                  }
                  className="rounded-lg overflow-hidden shadow-sm"
                />
              </div>

              {/* View mode toggle - Right aligned on wide screens */}
              <div className="flex items-center justify-end flex-shrink-0">
                <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Tag Filtering */}
            <TagFilter onFilter={() => {}} compact={true} />
            <SelectedTags />

            {/* Events Grid */}
            <div className="bg-[var(--bg-primary)] rounded-xl">
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
