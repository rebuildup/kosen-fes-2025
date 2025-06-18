import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useData } from "../context/DataContext";
import { ItemCore } from "../types/data";
import { Item } from "../types/common";
import UnifiedCard from "../shared/components/ui/UnifiedCard";
import CardGrid from "../components/common/CardGrid";
import TagCloud from "../components/common/TagCloud";
import PillButton from "../components/common/PillButton";

// ItemCoreをItem型に変換するヘルパー関数
const convertItemCoreToItem = (itemCore: ItemCore): Item => {
  const baseItem = {
    id: itemCore.id,
    title: itemCore.title,
    description: "", // ItemCoreにはdescriptionがないので空にする
    imageUrl: itemCore.imageUrl,
    date: itemCore.date || "",
    time: itemCore.time || "",
    location: itemCore.location,
    tags: itemCore.tags,
  };

  switch (itemCore.type) {
    case "event":
      return {
        ...baseItem,
        type: "event",
        organizer: (itemCore as any).organizer || "",
        duration: (itemCore as any).duration || 0,
      };
    case "exhibit":
      return {
        ...baseItem,
        type: "exhibit",
        creator: (itemCore as any).creator || "",
      };
    case "stall":
      return {
        ...baseItem,
        type: "stall",
        products: [],
      };
    case "sponsor":
      return {
        ...baseItem,
        type: "sponsor",
        website: "",
        tier: "bronze",
      };
    default:
      // デフォルトはeventとして扱う
      return {
        ...baseItem,
        type: "event",
        organizer: "",
        duration: 0,
      };
  }
};

const Home = () => {
  const { t } = useLanguage();
  const { events, exhibits, stalls, getPopularTags } = useData();
  const [featuredEvents, setFeaturedEvents] = useState<Item[]>([]);
  const [featuredExhibits, setFeaturedExhibits] = useState<Item[]>([]);
  const [featuredStalls, setFeaturedStalls] = useState<Item[]>([]);
  const [timelineItems, setTimelineItems] = useState<{
    [date: string]: Item[];
  }>({});
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [allDates, setAllDates] = useState<string[]>([]);

  // Update dates when items change
  useEffect(() => {
    const dates = [
      ...new Set(
        [...events, ...exhibits, ...stalls].map((item) => item.date || "")
      ),
    ]
      .filter((date) => date !== "")
      .sort();

    setAllDates(dates);
  }, [events, exhibits, stalls]);

  // Group items by date
  useEffect(() => {
    const allItems = [...events, ...exhibits, ...stalls];
    const byDate: { [date: string]: Item[] } = {};

    allDates.forEach((date) => {
      byDate[date] = allItems
        .filter((item) => item.date === date)
        .map(convertItemCoreToItem);
    });

    setTimelineItems(byDate);
  }, [events, exhibits, stalls, allDates]);

  // Get featured items
  useEffect(() => {
    setFeaturedEvents(events.slice(0, 2).map(convertItemCoreToItem));
    setFeaturedExhibits(exhibits.slice(0, 2).map(convertItemCoreToItem));
    setFeaturedStalls(stalls.slice(0, 1).map(convertItemCoreToItem));

    // Get popular tags from DataContext
    setPopularTags(getPopularTags(8));
  }, [events, exhibits, stalls, getPopularTags]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(t("language") === "ja" ? "ja-JP" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Instagram風グラデーション背景 */}
        <div
          className="absolute inset-0"
          style={{ background: "var(--instagram-gradient)" }}
        ></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {t("siteName")}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                {t("home.subtitle")}
              </p>
              <div className="flex items-center gap-3 text-lg bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 w-fit border border-white/20">
                <span className="text-2xl">📅</span>
                <span className="font-medium">{t("home.dates")}</span>
              </div>
              <PillButton
                to="/schedule"
                variant="secondary"
                size="lg"
                className="bg-white hover:bg-gray-100 text-[var(--primary-color)] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t("home.viewSchedule")}
              </PillButton>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                  <span className="text-8xl md:text-9xl font-bold text-white/90">
                    祭
                  </span>
                </div>
                <div
                  className="absolute -top-4 -right-4 w-16 h-16 rounded-full animate-pulse shadow-lg"
                  style={{ backgroundColor: "var(--accent-yellow)" }}
                ></div>
                <div
                  className="absolute -bottom-8 -left-8 w-12 h-12 rounded-full animate-pulse delay-1000 shadow-lg"
                  style={{ backgroundColor: "var(--accent-pink)" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-3 text-[var(--text-primary)]">
              <span className="text-3xl">🎭</span>
              {t("home.events")}
            </h2>
            <PillButton to="/events" variant="secondary">
              {t("home.viewAll")}
            </PillButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {featuredEvents.map((event) => (
              <UnifiedCard key={event.id} item={event} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* Exhibits Section */}
      <section className="section bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-3 text-[var(--text-primary)]">
              <span className="text-3xl">🎨</span>
              {t("home.exhibits")}
            </h2>
            <PillButton to="/exhibits" variant="secondary">
              {t("home.viewAll")}
            </PillButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {featuredExhibits.map((exhibit) => (
              <UnifiedCard key={exhibit.id} item={exhibit} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* Stalls Section */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-3 text-[var(--text-primary)]">
              <span className="text-3xl">🍜</span>
              {t("home.stalls")}
            </h2>
            <PillButton to="/stalls" variant="secondary">
              {t("home.viewAll")}
            </PillButton>
          </div>

          <div className="grid grid-cols-1 max-w-2xl mx-auto">
            {featuredStalls.map((stall) => (
              <UnifiedCard key={stall.id} item={stall} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* Tags Section */}
      <section className="section bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center mb-8 text-[var(--text-primary)]">
            <span className="text-3xl mr-3">🏷️</span>
            {t("home.popularTags")}
          </h2>
          <div className="flex justify-center">
            <TagCloud tags={popularTags} showCount />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center mb-12 text-[var(--text-primary)]">
            <span className="text-3xl mr-3">📅</span>
            {t("home.timeline")}
          </h2>

          <div className="space-y-12">
            {allDates.map((date) => (
              <div key={date} className="relative">
                {/* 日付ヘッダー */}
                <div className="flex items-center justify-center mb-8">
                  <div
                    className="px-6 py-3 rounded-full text-white font-semibold text-lg shadow-lg"
                    style={{ background: "var(--instagram-gradient)" }}
                  >
                    {formatDate(date)}
                  </div>
                </div>

                {/* イベントカードグリッド */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(timelineItems[date] || []).slice(0, 6).map((item) => (
                    <UnifiedCard
                      key={item.id}
                      item={item}
                      variant="timeline"
                      showTags={true}
                    />
                  ))}
                </div>

                {(timelineItems[date] || []).length > 6 && (
                  <div className="text-center mt-6">
                    <PillButton
                      to="/schedule"
                      variant="secondary"
                      className="text-[var(--primary-color)] hover:bg-[var(--bg-tertiary)]"
                    >
                      {t("home.viewAll")} (+
                      {(timelineItems[date] || []).length - 6})
                    </PillButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "var(--instagram-gradient)" }}
        ></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("home.ctaTitle")}
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {t("home.ctaDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PillButton
                to="/map"
                variant="secondary"
                size="lg"
                className="bg-white hover:bg-gray-100 text-[var(--primary-color)] shadow-lg hover:shadow-xl"
              >
                {t("home.viewMap")}
              </PillButton>
              <PillButton
                to="/bookmarks"
                variant="secondary"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
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
