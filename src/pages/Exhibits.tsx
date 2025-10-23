import { useEffect, useMemo, useState } from "react";

import CardGrid from "../components/common/CardGrid";
import CardListToggle from "../components/common/CardListToggle";
import SelectedTags from "../components/common/SelectedTags";
import TabButtons from "../components/common/TabButtons";
import TagFilter from "../components/common/TagFilter";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { dataManager } from "../data/dataManager";
import exhibits from "../data/exhibits.json";
import stalls from "../data/stalls.json";
import { pickRandom } from "../shared/utils/random";
import type { Item } from "../types/common";

function getRandomExhibitOrStallImage() {
  const images = [...exhibits.map((e) => e.imageUrl), ...stalls.map((s) => s.imageUrl)].filter(
    Boolean,
  );
  return pickRandom(images) || "";
}

const Exhibits = () => {
  const { t } = useLanguage();
  const { filterItemsByTags, selectedTags } = useTag();

  const [viewMode, setViewMode] = useState<"default" | "compact" | "grid" | "list">("default");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "exhibits" | "stalls">("all");
  // Choose a random hero image from exhibits or stalls

  const heroImage = useMemo(() => getRandomExhibitOrStallImage(), []);

  // Filter exhibits by category and tags
  useEffect(() => {
    setIsLoading(true);

    // Simulate loading delay for demonstration
    const timer = setTimeout(() => {
      let filtered: Item[] = [];

      // Get items based on category filter
      if (categoryFilter === "exhibits") {
        filtered = dataManager.getAllExhibits();
      } else if (categoryFilter === "stalls") {
        filtered = dataManager.getAllStalls();
      } else {
        // "all" - combine both exhibits and stalls
        filtered = [...dataManager.getAllExhibits(), ...dataManager.getAllStalls()];
      }

      // Apply tag filtering
      if (selectedTags.length > 0) {
        filtered = filterItemsByTags(filtered);
      }

      setFilteredItems(filtered);
      setIsLoading(false);
    }, 500); // 0.5秒のローディング時間

    return () => clearTimeout(timer);
  }, [categoryFilter, selectedTags, filterItemsByTags]);

  // Tab options for category filter
  const categoryOptions = [
    { label: t("exhibits.filters.all"), value: "all" },
    { label: t("exhibits.filters.exhibits"), value: "exhibits" },
    { label: t("exhibits.filters.stalls"), value: "stalls" },
  ];

  // Get appropriate empty message based on filter
  const getEmptyMessage = () => {
    if (categoryFilter === "exhibits") {
      return t("exhibits.noExhibits");
    } else if (categoryFilter === "stalls") {
      return t("exhibits.noStalls");
    }
    return t("exhibits.noExhibits");
  };

  // getRandomExhibitOrStallImage defined above

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
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
              {t("exhibits.title")}
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-[var(--text-secondary)]">
              {t("exhibits.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-6">
            {/* Filter Controls - Category selection and View mode */}
            <div className="scrollbar-thin mobile-scroll flex flex-row items-center gap-3 overflow-x-auto pb-2 sm:justify-between">
              {/* Category filter tabs - Left aligned on wide screens */}
              <div className="flex-shrink-0">
                <TabButtons
                  options={categoryOptions}
                  activeValue={categoryFilter}
                  onChange={(value) => setCategoryFilter(value as typeof categoryFilter)}
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

            {/* Exhibits Grid */}
            <div className="rounded-xl bg-[var(--bg-primary)]">
              <CardGrid
                items={filteredItems}
                variant={viewMode}
                showTags={true}
                showDescription={viewMode === "list"}
                emptyMessage={getEmptyMessage()}
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

export default Exhibits;
