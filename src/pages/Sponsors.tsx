// src/pages/Sponsors.tsx
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { dataManager } from "../data/dataManager";
import { Item, Sponsor } from "../types/common";
import CardGrid from "../components/common/CardGrid";
import CardListToggle from "../components/common/CardListToggle";
import TagFilter from "../components/common/TagFilter";
import SelectedTags from "../components/common/SelectedTags";

const Sponsors = () => {
  const { t } = useLanguage();
  const { filterItemsByTags, selectedTags } = useTag();

  const [viewMode, setViewMode] = useState<
    "default" | "compact" | "grid" | "list"
  >("default");
  const [filteredSponsors, setFilteredSponsors] = useState<Item[]>([]);
  const [tierFilter, setTierFilter] = useState<
    "all" | "platinum" | "gold" | "silver" | "bronze"
  >("all");

  // Filter sponsors by selected tier and tags
  useEffect(() => {
    let filtered = dataManager.getAllSponsors() as Item[];

    // Filter by tier
    if (tierFilter !== "all") {
      filtered = filtered.filter(
        (sponsor) => (sponsor as Sponsor).tier === tierFilter
      );
    }

    // Apply tag filtering
    if (selectedTags.length > 0) {
      filtered = filterItemsByTags(filtered);
    }

    setFilteredSponsors(filtered);
  }, [tierFilter, selectedTags, filterItemsByTags]);

  // Handle tier filter change
  const handleTierFilterChange = (
    tier: "all" | "platinum" | "gold" | "silver" | "bronze"
  ) => {
    setTierFilter(tier);
  };

  // Translations for tier labels
  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "all":
        return t("sponsors.filters.all");
      case "platinum":
        return t("sponsors.filters.platinum");
      case "gold":
        return t("sponsors.filters.gold");
      case "silver":
        return t("sponsors.filters.silver");
      case "bronze":
        return t("sponsors.filters.bronze");
      default:
        return tier;
    }
  };

  return (
    <div>
      <div>
        <h1>{t("sponsors.title")}</h1>

        <div>
          <div>
            <button onClick={() => handleTierFilterChange("all")}>
              {getTierLabel("all")}
            </button>
            <button onClick={() => handleTierFilterChange("platinum")}>
              {getTierLabel("platinum")}
            </button>
            <button onClick={() => handleTierFilterChange("gold")}>
              {getTierLabel("gold")}
            </button>
            <button onClick={() => handleTierFilterChange("silver")}>
              {getTierLabel("silver")}
            </button>
            <button onClick={() => handleTierFilterChange("bronze")}>
              {getTierLabel("bronze")}
            </button>
          </div>

          <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      <div>
        {/* Tag filter at the top - single column */}
        <div>
          <TagFilter onFilter={() => {}} />
          <SelectedTags />
        </div>

        {/* Sponsors grid below */}
        <div>
          <CardGrid
            items={filteredSponsors}
            variant={viewMode}
            showTags={true}
            showDescription={viewMode === "list"}
            emptyMessage={t("sponsors.noSponsors")}
            filterType="all"
          />
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
