import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useData } from "../context/DataContext";
import { ItemCore } from "../types/data";
import { Item } from "../types/common";
import UnifiedCard from "../shared/components/ui/UnifiedCard";
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

  // Calculate delay for home page cards
  const calculateHomeDelay = (index: number): number => {
    return index * 0.08;
  };

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
    setFeaturedEvents(events.slice(0, 4).map(convertItemCoreToItem));
    setFeaturedExhibits(exhibits.slice(0, 4).map(convertItemCoreToItem));
    setFeaturedStalls(stalls.slice(0, 3).map(convertItemCoreToItem));

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
      <section className="bg-[var(--bg-primary)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* タイトルとサブタイトル */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
              {t("siteName")}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-6 max-w-3xl mx-auto">
              {t("home.subtitle")}
            </p>
          </div>

          {/* チケット画像 - 横幅いっぱい */}
          <div className="ticket-preview mb-8">
            <div className="max-w-5xl mx-auto">
              <img
                src="./assets/ticket.png"
                alt="高専祭2025 チケット"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-center">
            <PillButton
              to="/schedule"
              variant="secondary"
              size="lg"
              className="bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t("home.viewSchedule")}
            </PillButton>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-3 text-[var(--text-primary)]">
              {t("home.events")}
            </h2>
            <PillButton to="/events" variant="secondary">
              {t("home.viewAll")}
            </PillButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
      <section className="section bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-3 text-[var(--text-primary)]">
              {t("home.exhibits")}
            </h2>
            <PillButton to="/exhibits" variant="secondary">
              {t("home.viewAll")}
            </PillButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-3 text-[var(--text-primary)]">
              {t("home.stalls")}
            </h2>
            <PillButton to="/stalls" variant="secondary">
              {t("home.viewAll")}
            </PillButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
      <section className="section bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center mb-8 text-[var(--text-primary)]">
            <span className="text-3xl mr-3">🏷️</span>
            {t("home.popularTags")}
          </h2>
          <div className="w-full overflow-hidden">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(timelineItems[date] || [])
                    .slice(0, 8)
                    .map((item, index) => (
                      <div
                        key={`home-timeline-${date}-${item.id}`}
                        className="animate-card-enter"
                        style={{
                          animationDelay: `${calculateHomeDelay(index)}s`,
                          animationFillMode: "both",
                        }}
                      >
                        <UnifiedCard
                          item={item}
                          variant="default"
                          showTags={true}
                        />
                      </div>
                    ))}
                </div>

                {(timelineItems[date] || []).length > 8 && (
                  <div className="text-center mt-6">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-8">
              <PillButton
                to="/map"
                variant="secondary"
                size="lg"
                className="bg-white hover:bg-gray-50 text-gray-900 shadow-lg hover:shadow-xl font-semibold w-48 mx-auto sm:mx-0 truncate"
              >
                {t("home.viewMap")}
              </PillButton>
              <PillButton
                to="/bookmarks"
                variant="secondary"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm w-48 mx-auto sm:mx-0 truncate"
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
