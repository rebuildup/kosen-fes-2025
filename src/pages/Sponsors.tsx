import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import { sponsors } from "../data/sponsors";
import { Item } from "../types/common";
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
  const [filteredSponsors, setFilteredSponsors] = useState<Item[]>(sponsors);
  const [tierFilter, setTierFilter] = useState<
    "all" | "platinum" | "gold" | "silver" | "bronze"
  >("all");

  // Filter sponsors by selected tier and tags
  useEffect(() => {
    let filtered = [...sponsors] as Item[];

    // Filter by tier
    if (tierFilter !== "all") {
      filtered = filtered.filter(
        (sponsor) => sponsor.type === "sponsor" && sponsor.tier === tierFilter
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
    <div className="sponsors-page">
      <div className="sponsors-header">
        <h1 className="sponsors-title">{t("sponsors.title")}</h1>

        <div className="sponsors-filters">
          <div className="tier-filter">
            <button
              className={`tier-filter-button ${
                tierFilter === "all" ? "active" : ""
              }`}
              onClick={() => handleTierFilterChange("all")}
            >
              {getTierLabel("all")}
            </button>
            <button
              className={`tier-filter-button ${
                tierFilter === "platinum" ? "active" : ""
              }`}
              onClick={() => handleTierFilterChange("platinum")}
            >
              {getTierLabel("platinum")}
            </button>
            <button
              className={`tier-filter-button ${
                tierFilter === "gold" ? "active" : ""
              }`}
              onClick={() => handleTierFilterChange("gold")}
            >
              {getTierLabel("gold")}
            </button>
            <button
              className={`tier-filter-button ${
                tierFilter === "silver" ? "active" : ""
              }`}
              onClick={() => handleTierFilterChange("silver")}
            >
              {getTierLabel("silver")}
            </button>
            <button
              className={`tier-filter-button ${
                tierFilter === "bronze" ? "active" : ""
              }`}
              onClick={() => handleTierFilterChange("bronze")}
            >
              {getTierLabel("bronze")}
            </button>
          </div>

          <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      <div className="sponsors-content">
        <div className="sponsors-sidebar">
          <TagFilter onFilter={() => {}} />
          <SelectedTags />
        </div>

        <div className="sponsors-main">
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
