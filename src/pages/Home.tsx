import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PillButton from "../components/common/PillButton";
import TagCloud from "../components/common/TagCloud";
import { useData } from "../context/DataContext";
import { useLanguage } from "../context/LanguageContext";
import { events } from "../data/events";
import UnifiedCard from "../shared/components/ui/UnifiedCard";
import { pickRandom } from "../shared/utils/random";
import type { Item } from "../types/common";
import type { EventCore, ExhibitCore, ItemCore } from "../types/data";

// ItemCoreをItem型に変換するヘルパー関数
const convertItemCoreToItem = (itemCore: ItemCore): Item => {
  const baseItem = {
    date: itemCore.date || "",
    description: "", // ItemCoreにはdescriptionがないので空にする
    id: itemCore.id,
    imageUrl: itemCore.imageUrl,
    location: itemCore.location,
    tags: itemCore.tags,
    time: itemCore.time || "",
    title: itemCore.title,
  };

  switch (itemCore.type) {
    case "event": {
      const eventCore = itemCore as EventCore;
      return {
        ...baseItem,
        dayAvailability: eventCore.dayAvailability,
        duration: eventCore.duration,
        organizer: eventCore.organizer,
        showOnMap: eventCore.showOnMap,
        showOnSchedule: eventCore.showOnSchedule,
        type: "event" as const,
      };
    }
    case "exhibit": {
      const exhibitCore = itemCore as ExhibitCore;
      return {
        ...baseItem,
        creator: exhibitCore.creator,
        type: "exhibit" as const,
      };
    }
    case "stall": {
      return {
        ...baseItem,
        organizer: "",
        products: [],
        type: "stall" as const,
      };
    }
    case "sponsor": {
      return {
        ...baseItem,
        type: "sponsor" as const,
        website: "",
      };
    }
    default: {
      // デフォルトはeventとして扱う
      return {
        ...baseItem,
        dayAvailability: "day1",
        duration: 0,
        organizer: "",
        showOnMap: true,
        showOnSchedule: true,
        type: "event",
      };
    }
  }
};

// 画像パスをpublicルート基準に変換
const toPublicImagePath = (url: string) =>
  url.replace(/^\.?\/?images\//, "./images/");

const getRandomAnyImage = () => {
  const images = events
    .map((e) => e.imageUrl)
    .filter(Boolean)
    .map(toPublicImagePath);
  return pickRandom(images) || "";
};

function calculateHomeDelay(index: number): number {
  return index * 0.08;
}

const Home = () => {
  const { t } = useLanguage();
  const { events, exhibits, getPopularTags, stalls } = useData();
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState<Item[]>([]);
  const [featuredExhibits, setFeaturedExhibits] = useState<Item[]>([]);
  const [featuredStalls, setFeaturedStalls] = useState<Item[]>([]);
  const [timelineItems, setTimelineItems] = useState<{
    [date: string]: Item[];
  }>({});
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [allDates, setAllDates] = useState<string[]>([]);
  const randomCtaImage = useMemo(() => getRandomAnyImage(), []);

  // Handle tag click - navigate to search page with selected tag
  const handleTagClick = (tag: string) => {
    navigate(`/search?tag=${encodeURIComponent(tag)}`);
  };

  // Calculate delay for home page cards

  // Update dates when items change
  useEffect(() => {
    const dates = [
      ...new Set(
        [...events, ...exhibits, ...stalls].map((item) => item.date || ""),
      ),
    ]
      .filter((date: string) => date !== "")
      .sort((a: string, b: string) => a.localeCompare(b));

    setAllDates(dates);
  }, [events, exhibits, stalls]);

  // Group items by date
  useEffect(() => {
    const allItems = [...events, ...exhibits, ...stalls];
    const byDate: { [date: string]: Item[] } = {};

    for (const date of allDates) {
      byDate[date] = allItems
        .filter((item) => item.date === date)
        .map(convertItemCoreToItem);
    }

    setTimelineItems(byDate);
  }, [events, exhibits, stalls, allDates]);

  // Get featured items
  useEffect(() => {
    setFeaturedEvents(events.slice(0, 3).map(convertItemCoreToItem));
    setFeaturedExhibits(exhibits.slice(0, 3).map(convertItemCoreToItem));
    setFeaturedStalls(stalls.slice(0, 3).map(convertItemCoreToItem));

    // Get popular tags from DataContext
    setPopularTags(getPopularTags(8));
  }, [events, exhibits, stalls, getPopularTags]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(t("language") === "ja" ? "ja-JP" : "en-US", {
      day: "numeric",
      month: "long",
      weekday: "long",
      year: "numeric",
    });
  };

  return (
    <div className="scrollbar-thin min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="bg-[var(--bg-primary)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* タイトルとサブタイトル */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl lg:text-5xl">
              {t("siteName")}
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-lg text-[var(--text-secondary)] md:text-xl">
              {t("home.subtitle")}
            </p>
          </div>

          {/* チケット画像 - 横幅いっぱい */}
          <div className="ticket-preview mb-8">
            <div className="mx-auto max-w-5xl">
              <img
                src="./assets/ticket.png"
                alt="高専祭2025 チケット"
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-center">
            <PillButton
              to="/schedule"
              variant="secondary"
              size="lg"
              className="border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
            >
              {t("home.viewSchedule")}
            </PillButton>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="section-title flex items-center gap-3 text-[var(--text-primary)]">
              {t("home.events")}
            </h2>
            <PillButton to="/events" variant="secondary">
              {t("home.viewAll")}
            </PillButton>
          </div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event, index) => (
              <div
                key={`home-events-${event.id}`}
                className="animate-card-enter"
                style={{
                  animationDelay: `${calculateHomeDelay(index)}s`,
                  animationFillMode: "both",
                }}
              >
                <UnifiedCard
                  item={event}
                  variant="default"
                  showTags={true}
                  showDescription={true}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibits Section */}
      <section className="section rounded-lg bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="section-title flex items-center gap-3 text-[var(--text-primary)]">
              {t("home.exhibits")}
            </h2>
            <PillButton to="/exhibits" variant="secondary">
              {t("home.viewAll")}
            </PillButton>
          </div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredExhibits.map((exhibit, index) => (
              <div
                key={`home-exhibits-${exhibit.id}`}
                className="animate-card-enter"
                style={{
                  animationDelay: `${calculateHomeDelay(index)}s`,
                  animationFillMode: "both",
                }}
              >
                <UnifiedCard
                  item={exhibit}
                  variant="default"
                  showTags={true}
                  showDescription={true}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stalls Section */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="section-title flex items-center gap-3 text-[var(--text-primary)]">
              {t("home.stalls")}
            </h2>
            <PillButton to="/stalls" variant="secondary">
              {t("home.viewAll")}
            </PillButton>
          </div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredStalls.map((stall, index) => (
              <div
                key={`home-stalls-${stall.id}`}
                className="animate-card-enter"
                style={{
                  animationDelay: `${calculateHomeDelay(index)}s`,
                  animationFillMode: "both",
                }}
              >
                <UnifiedCard
                  item={stall}
                  variant="default"
                  showDescription={true}
                  showTags={true}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tags Section */}
      <section className="section rounded-lg bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-7xl">
          <h2 className="section-title mb-8 text-center text-[var(--text-primary)]">
            {t("home.popularTags")}
          </h2>
          <div className="w-full overflow-hidden">
            <TagCloud
              tags={popularTags}
              showCount
              onTagClick={handleTagClick}
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-7xl">
          <h2 className="section-title mb-12 text-center text-[var(--text-primary)]">
            {t("home.timeline")}
          </h2>

          <div className="space-y-12">
            {allDates.map((date) => (
              <div key={date} className="relative">
                {/* 日付ヘッダー */}
                <div className="mb-8 flex items-center justify-center">
                  <div
                    className="rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg"
                    style={{ background: "var(--instagram-gradient)" }}
                  >
                    {formatDate(date)}
                  </div>
                </div>

                {/* イベントカードグリッド → 横スクロールリスト */}
                <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
                  {(timelineItems[date] || []).map((item, index) => (
                    <div
                      key={`home-timeline-${date}-${item.id}`}
                      className="animate-card-enter w-72 flex-shrink-0 snap-start"
                      style={{
                        animationDelay: `${calculateHomeDelay(index)}s`,
                        animationFillMode: "both",
                      }}
                    >
                      <UnifiedCard
                        item={item}
                        variant="default"
                        showTags={true}
                        showDescription={true}
                      />
                    </div>
                  ))}
                </div>

                {(timelineItems[date] || []).length > 8 && (
                  <div className="mt-6 text-center">
                    <PillButton
                      to="/schedule"
                      variant="secondary"
                      className="text-[var(--primary-color)] hover:bg-[var(--bg-tertiary)]"
                    >
                      {t("home.viewAll")} (+
                      {(timelineItems[date] || []).length - 8})
                    </PillButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-tl-lg rounded-tr-lg">
        {/* 透かし画像 */}
        <img
          src={randomCtaImage}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-25"
          alt=""
          aria-hidden="true"
        />
        {/* グラデーション（さらに薄め） */}
        <div
          className="absolute inset-0 z-10 opacity-50"
          style={{ background: "var(--instagram-gradient)" }}
        ></div>
        {/* 黒半透明（さらに薄め） */}
        <div className="absolute inset-0 z-20 bg-black/5"></div>
        {/* テキスト・ボタン */}
        <div className="relative z-30 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center text-white">
            <h2 className="text-3xl font-bold md:text-4xl">
              {t("home.ctaTitle")}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-white/90">
              {t("home.ctaDescription")}
            </p>
            <div className="flex flex-col justify-center gap-4 px-8 sm:flex-row">
              <PillButton
                to="/map"
                variant="secondary"
                size="lg"
                className="mx-auto w-60 truncate bg-white font-semibold text-gray-900 shadow-lg hover:bg-gray-50 sm:mx-0"
              >
                {t("home.viewMap")}
              </PillButton>
              <PillButton
                to="/bookmarks"
                variant="secondary"
                size="lg"
                className="mx-auto w-60 truncate border border-white/30 bg-white/10 text-white hover:bg-white/20 sm:mx-0"
              >
                {t("home.viewBookmarks")}
              </PillButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
