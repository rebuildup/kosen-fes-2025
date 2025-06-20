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

const Exhibits = () => {
  const { t } = useLanguage();
  const { filterItemsByTags, selectedTags } = useTag();

  const [viewMode, setViewMode] = useState<
    "default" | "compact" | "grid" | "list"
  >("default");
  const [filteredExhibits, setFilteredExhibits] = useState<Item[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "exhibits" | "stalls"
  >("all");

  // Filter exhibits by category and tags
  useEffect(() => {
    let filtered: Item[] = [];

    // Get items based on category filter
    if (categoryFilter === "exhibits") {
      filtered = dataManager.getAllExhibits() as Item[];
    } else if (categoryFilter === "stalls") {
      filtered = dataManager.getAllStalls() as Item[];
    } else {
      // "all" - combine both exhibits and stalls
      filtered = [
        ...dataManager.getAllExhibits(),
        ...dataManager.getAllStalls(),
      ] as Item[];
    }

    // Apply tag filtering
    if (selectedTags.length > 0) {
      filtered = filterItemsByTags(filtered);
    }

    setFilteredExhibits(filtered);
  }, [categoryFilter, selectedTags, filterItemsByTags]);

  // Tab options for category filter
  const categoryOptions = [
    { value: "all", label: t("exhibits.filters.all") },
    { value: "exhibits", label: t("exhibits.filters.exhibits") },
    { value: "stalls", label: t("exhibits.filters.stalls") },
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

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: "var(--instagram-gradient)" }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              {t("exhibits.title")}
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              {t("exhibits.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Filter Controls - Category selection and View mode */}
            <div className="flex flex-row items-center sm:justify-between gap-3 overflow-x-auto pb-2 scrollbar-thin mobile-scroll">
              {/* Category filter tabs - Left aligned on wide screens */}
              <div className="flex-shrink-0">
                <TabButtons
                  options={categoryOptions}
                  activeValue={categoryFilter}
                  onChange={(value) =>
                    setCategoryFilter(value as typeof categoryFilter)
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

            {/* Exhibits Grid */}
            <div className="bg-[var(--bg-primary)] rounded-xl">
              <CardGrid
                items={filteredExhibits}
                variant={viewMode}
                showTags={true}
                showDescription={viewMode === "list"}
                emptyMessage={getEmptyMessage()}
                filterType="all"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Exhibits;
