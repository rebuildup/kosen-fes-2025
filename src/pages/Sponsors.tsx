// src/pages/Sponsors.tsx
import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { dataManager } from "../data/dataManager";
import { Item } from "../types/common";
import CardGrid from "../components/common/CardGrid";
import CardListToggle from "../components/common/CardListToggle";
import { sponsors } from "../data/sponsors";

const Sponsors = () => {
  const { t } = useLanguage();

  const [viewMode, setViewMode] = useState<
    "default" | "compact" | "grid" | "list"
  >("default");
  const [filteredSponsors, setFilteredSponsors] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Choose a random hero image from sponsors
  function getRandomSponsorImage() {
    const images = sponsors.map((s) => s.imageUrl).filter(Boolean as any);
    return images[Math.floor(Math.random() * images.length)] || "";
  }

  const heroImage = useMemo(() => getRandomSponsorImage(), []);

  // Get all sponsors
  useEffect(() => {
    setIsLoading(true);

    // Simulate loading delay for demonstration
    const timer = setTimeout(() => {
      const allSponsors = dataManager.getAllSponsors() as Item[];
      setFilteredSponsors(allSponsors);
      setIsLoading(false);
    }, 500); // 0.5秒のローディング時間

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 rounded-lg">
        {/* 透かし画像 */}
        <img
          src={heroImage}
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
                  {filteredSponsors.length} 社
                </span>
              </div>

              <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>

          {/* Sponsors grid */}
          <div className="bg-[var(--bg-primary)] rounded-xl">
            <CardGrid
              items={filteredSponsors}
              variant={viewMode}
              showTags={false}
              showDescription={viewMode === "list"}
              emptyMessage={t("sponsors.noSponsors")}
              filterType="all"
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sponsors;
