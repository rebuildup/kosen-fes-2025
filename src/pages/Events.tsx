import { useEffect, useMemo, useState } from "react";

import CardGrid from "../components/common/CardGrid";
import CardListToggle from "../components/common/CardListToggle";
import SelectedTags from "../components/common/SelectedTags";
import TabButtons from "../components/common/TabButtons";
import TagFilter from "../components/common/TagFilter";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { dataManager } from "../data/dataManager";
import events from "../data/events.json";
import { pickRandom } from "../shared/utils/random";
import type { Item } from "../types/common";

// CSS removed - using TailwindCSS classes instead

const getRandomEventImage = () => {
  const images = events.map((e) => e.imageUrl).filter(Boolean);
  return pickRandom(images) || "";
};

const Events = () => {
  const { t } = useLanguage();
  const { filterItemsByTags, selectedTags } = useTag();

  const [viewMode, setViewMode] = useState<"default" | "compact" | "grid" | "list">("default");
  const [filteredEvents, setFilteredEvents] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<"all" | "day1" | "day2">("all");
  const heroImage = useMemo(() => getRandomEventImage(), []);

  // Filter events by selected day and tags
  useEffect(() => {
    setIsLoading(true);

    // Simulate loading delay for demonstration
    const timer = setTimeout(() => {
      // Get all events from dataManager
      let filtered = dataManager.getAllEvents();

      // Filter by day
      if (dateFilter !== "all") {
        filtered = filtered.filter((event) => {
          if (event.type !== "event") {
            return false;
          }

          const dayAvailability = event.dayAvailability;
          if (dayAvailability === "both") {
            return true;
          }

          return dayAvailability === dateFilter;
        });
      }

      // Apply tag filtering
      if (selectedTags.length > 0) {
        filtered = filterItemsByTags(filtered);
      }

      setFilteredEvents(filtered);
      setIsLoading(false);
    }, 500); // 0.5秒のローディング時間

    return () => clearTimeout(timer);
  }, [dateFilter, selectedTags, filterItemsByTags]);

  // Tab options for date filter
  const dateOptions = [
    { label: t("events.filters.all"), value: "all" },
    { label: t("events.filters.day1"), value: "day1" },
    { label: t("events.filters.day2"), value: "day2" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-lg py-16">
        {/* 透かし画像 */}
        <img
          src={heroImage}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-20"
          alt=""
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: "var(--instagram-gradient)" }}
        ></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
              {t("events.title")}
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-[var(--text-secondary)]">
              {t("events.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-6">
            {/* Filter Controls - Day selection and View mode */}
            <div className="scrollbar-thin mobile-scroll flex flex-row items-center gap-3 overflow-x-auto pb-2 sm:justify-between">
              {/* Date filter tabs - Left aligned on wide screens */}
              <div className="flex-shrink-0">
                <TabButtons
                  options={dateOptions}
                  activeValue={dateFilter}
                  onChange={(value) => setDateFilter(value as typeof dateFilter)}
                  className="overflow-hidden rounded-lg shadow-sm"
                />
              </div>

              {/* View mode toggle - Right aligned on wide screens */}
              <div className="flex flex-shrink-0 items-center justify-end">
                <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Tag Filtering */}
            <TagFilter compact={true} />
            <SelectedTags />

            {/* Events Grid */}
            <div className="rounded-xl bg-[var(--bg-primary)]">
              <CardGrid
                items={filteredEvents}
                variant={viewMode}
                showTags={true}
                showDescription={viewMode === "list"}
                emptyMessage={t("events.noEventsFound")}
                filterType="all"
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
