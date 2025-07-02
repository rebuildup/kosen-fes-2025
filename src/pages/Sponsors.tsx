// src/pages/Sponsors.tsx
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { dataManager } from "../data/dataManager";
import { Item } from "../types/common";
import CardGrid from "../components/common/CardGrid";
import CardListToggle from "../components/common/CardListToggle";

const Sponsors = () => {
  const { t } = useLanguage();

  const [viewMode, setViewMode] = useState<
    "default" | "compact" | "grid" | "list"
  >("default");
  const [sponsors, setSponsors] = useState<Item[]>([]);

  // Get all sponsors
  useEffect(() => {
    const allSponsors = dataManager.getAllSponsors() as Item[];
    setSponsors(allSponsors);
  }, []);

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
              {t("sponsors.title")}
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              {t("sponsors.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            {/* Simple header with view toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  スポンサー一覧
                </h2>
                <span className="px-3 py-1 bg-[var(--primary-color)] text-white rounded-full text-sm font-medium">
                  {sponsors.length} 社
                </span>
              </div>

              <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>

          {/* Sponsors grid */}
          <div className="bg-[var(--bg-primary)] rounded-xl">
            <CardGrid
              items={sponsors}
              variant={viewMode}
              showTags={false}
              showDescription={viewMode === "list"}
              emptyMessage={t("sponsors.noSponsors")}
              filterType="all"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sponsors;
