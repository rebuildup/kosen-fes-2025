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
import TabButtons from "../components/common/TabButtons";

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

  // Tab options for tier filter
  const tierOptions = [
    { value: "all", label: t("sponsors.filters.all") },
    { value: "platinum", label: t("sponsors.filters.platinum") },
    { value: "gold", label: t("sponsors.filters.gold") },
    { value: "silver", label: t("sponsors.filters.silver") },
    { value: "bronze", label: t("sponsors.filters.bronze") },
  ];

  return (
    <div className="min-h-screen">
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="section-title">{t("sponsors.title")}</h1>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <TabButtons
                options={tierOptions}
                activeValue={tierFilter}
                onChange={(value) => setTierFilter(value as typeof tierFilter)}
                className="rounded-lg overflow-hidden"
              />

              <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>

          <div className="space-y-6">
            {/* Tag filter at the top - single column */}
            <div className="space-y-4">
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
      </section>
    </div>
  );
};

export default Sponsors;
