import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { dataManager } from "../data/dataManager";
import { Item } from "../types/common";
import CardGrid from "../components/common/CardGrid";
import CardListToggle from "../components/common/CardListToggle";
import TagFilter from "../components/common/TagFilter";
import SelectedTags from "../components/common/SelectedTags";

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
        ...dataManager.getAllStalls()
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

  // Handle type filter change
  const handleTypeFilterChange = (type: "all" | "exhibit" | "stall") => {
    setTypeFilter(type);
  };

  return (
    <div className="exhibits-page">
      <div className="exhibits-header">
        <h1 className="exhibits-title">{t("exhibits.title")}</h1>

        <div className="exhibits-filters">
          <div className="type-filter">
            <button
              className={`type-filter-button ${
                typeFilter === "all" ? "active" : ""
              }`}
              onClick={() => handleTypeFilterChange("all")}
            >
              {t("exhibits.filters.all")}
            </button>
            <button
              className={`type-filter-button ${
                typeFilter === "exhibit" ? "active" : ""
              }`}
              onClick={() => handleTypeFilterChange("exhibit")}
            >
              {t("exhibits.filters.exhibits")}
            </button>
            <button
              className={`type-filter-button ${
                typeFilter === "stall" ? "active" : ""
              }`}
              onClick={() => handleTypeFilterChange("stall")}
            >
              {t("exhibits.filters.stalls")}
            </button>
          </div>

          <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      <div className="exhibits-content">
        <div className="exhibits-sidebar">
          <TagFilter onFilter={() => {}} />
        </div>

        <div className="exhibits-main">
          <SelectedTags />

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
  );
};

export default Exhibits;
