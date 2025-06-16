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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent)]/90 to-[var(--color-fourth)] overflow-hidden">
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
              <div className="flex items-center gap-3 text-lg bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 w-fit">
                <span className="text-2xl">📅</span>
                <span className="font-medium">{t("home.dates")}</span>
              </div>
              <PillButton
                to="/schedule"
                variant="secondary"
                size="lg"
                className="bg-white hover:bg-gray-100 text-[var(--color-accent)]"
              >
                {t("home.viewSchedule")}
              </PillButton>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <span className="text-8xl md:text-9xl font-bold text-white/90">
                    祭
                  </span>
                </div>
                <div
                  className="absolute -top-4 -right-4 w-16 h-16 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--color-second)" }}
                ></div>
                <div
                  className="absolute -bottom-8 -left-8 w-12 h-12 rounded-full animate-pulse delay-1000"
                  style={{ backgroundColor: "var(--color-third)" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="section-title flex items-center gap-3"
              style={{ color: "var(--color-text-primary)" }}
            >
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
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-secondary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="section-title flex items-center gap-3"
              style={{ color: "var(--color-text-primary)" }}
            >
              <span className="text-3xl">🖼️</span>
              {t("home.exhibits")}
            </h2>
            <PillButton to="/exhibits" variant="secondary">
              {t("home.viewAll")}
            </PillButton>
          </div>

          <div className="max-w-6xl mx-auto">
            <CardGrid
              items={[...featuredExhibits, ...featuredStalls]}
              variant="default"
              showTags
              showDescription
            />
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="section-title flex items-center gap-3"
              style={{ color: "var(--color-text-primary)" }}
            >
              <span className="text-3xl">📅</span>
              {t("home.schedule")}
            </h2>
            <PillButton to="/schedule" variant="secondary">
              {t("home.viewFull")}
            </PillButton>
          </div>

          <div className="space-y-8">
            {allDates.map((date) => (
              <div
                key={date}
                className="rounded-xl p-6"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <h3
                  className="text-xl font-semibold mb-4 pb-2 border-b"
                  style={{
                    color: "var(--color-text-primary)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  {formatDate(date)}
                </h3>
                <div className="max-w-4xl mx-auto">
                  <CardGrid
                    items={timelineItems[date]?.slice(0, 3) || []}
                    variant="compact"
                    showTags={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section
        className="section bg-gradient-to-br"
        style={{
          background: `linear-gradient(to bottom right, var(--color-bg-secondary), var(--color-bg-tertiary))`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="section-title flex items-center gap-3"
              style={{ color: "var(--color-text-primary)" }}
            >
              <span className="text-3xl">#</span>
              {t("home.explore")}
            </h2>
            <PillButton to="/search" variant="primary">
              {t("home.search")}
            </PillButton>
          </div>

          <div
            className="rounded-xl p-6 shadow-sm"
            style={{ backgroundColor: "var(--color-bg-primary)" }}
          >
            <TagCloud tags={popularTags} showCount />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
