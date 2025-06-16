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
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [typeFilter, setTypeFilter] = useState<"all" | "exhibit" | "stall">(
    "all"
  );

  // Filter items by selected type and tags
  useEffect(() => {
    let filtered: Item[] = [];

    // Filter by type using dataManager
    if (typeFilter === "all") {
      filtered = [
        ...dataManager.getAllExhibits(),
        ...dataManager.getAllStalls(),
      ];
    } else if (typeFilter === "exhibit") {
      filtered = dataManager.getAllExhibits();
    } else {
      filtered = dataManager.getAllStalls();
    }

    // Apply tag filtering
    if (selectedTags.length > 0) {
      filtered = filterItemsByTags(filtered);
    }

    setFilteredItems(filtered);
  }, [typeFilter, selectedTags, filterItemsByTags]);

  // Tab options for type filter
  const typeOptions = [
    { value: "all", label: t("exhibits.filters.all") },
    { value: "exhibit", label: t("exhibits.filters.exhibits") },
    { value: "stall", label: t("exhibits.filters.stalls") },
  ];

  return (
    <div className="min-h-screen">
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="section-title">{t("exhibits.title")}</h1>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <TabButtons
                options={typeOptions}
                activeValue={typeFilter}
                onChange={(value) => setTypeFilter(value as typeof typeFilter)}
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
                items={filteredItems}
                variant={viewMode}
                showTags={true}
                showDescription={viewMode === "list"}
                emptyMessage={
                  typeFilter === "exhibit"
                    ? t("exhibits.noExhibits")
                    : typeFilter === "stall"
                    ? t("exhibits.noStalls")
                    : t("common.noItems")
                }
                filterType={typeFilter === "all" ? undefined : typeFilter}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Exhibits;
