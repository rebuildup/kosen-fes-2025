// src/pages/Sponsors.tsx
import { useEffect, useMemo, useState } from "react";

import CardGrid from "../components/common/CardGrid";
import CardListToggle from "../components/common/CardListToggle";
import { useLanguage } from "../context/LanguageContext";
import { dataManager } from "../data/dataManager";
import sponsors from "../data/sponsors.json";
import { pickRandom } from "../shared/utils/random";
import type { Item } from "../types/common";

function getRandomSponsorImage() {
  const images = sponsors.map((s) => s.imageUrl).filter(Boolean);
  return pickRandom(images) || "";
}

const Sponsors = () => {
  const { t } = useLanguage();

  const [viewMode, setViewMode] = useState<"default" | "compact" | "grid" | "list">("default");
  const [filteredSponsors, setFilteredSponsors] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Choose a random hero image from sponsors

  const heroImage = useMemo(() => getRandomSponsorImage(), []);

  // Get all sponsors
  useEffect(() => {
    setIsLoading(true);

    // Simulate loading delay for demonstration
    const timer = setTimeout(() => {
      const allSponsors = dataManager.getAllSponsors();
      setFilteredSponsors(allSponsors);
      setIsLoading(false);
    }, 500); // 0.5秒のローディング時間

    return () => clearTimeout(timer);
  }, []);

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
              {t("sponsors.title")}
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-[var(--text-secondary)]">
              {t("sponsors.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            {/* Simple header with view toggle */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">スポンサー一覧</h2>
                <span className="rounded-full bg-[var(--primary-color)] px-3 py-1 text-sm font-medium text-white">
                  {filteredSponsors.length} 社
                </span>
              </div>

              <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>

          {/* Sponsors grid */}
          <div className="rounded-xl bg-[var(--bg-primary)]">
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
