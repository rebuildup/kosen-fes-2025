import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useData } from "../context/DataContext";
import { ItemCore } from "../types/data";
import { Item } from "../types/common";
import FeaturedCard from "../components/common/FeaturedCard";
import CardGrid from "../components/common/CardGrid";
import TagCloud from "../components/common/TagCloud";

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

  // Get unique dates from all items
  const allDates = [
    ...new Set(
      [...events, ...exhibits, ...stalls].map((item) => item.date || "")
    ),
  ]
    .filter((date) => date !== "")
    .sort();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--accent)] via-[var(--accent)]/90 to-[var(--fourth)] overflow-hidden">
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
              <Link 
                to="/schedule"
                className="inline-flex items-center gap-2 bg-white text-[var(--accent)] hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                {t("home.viewSchedule")}
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <span className="text-8xl md:text-9xl font-bold text-white/90">祭</span>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[var(--second)] rounded-full animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-[var(--third)] rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-3">
              <span className="text-3xl">🎭</span>
              {t("home.events")}
            </h2>
            <Link 
              to="/events"
              className="btn btn-secondary group"
            >
              {t("home.viewAll")}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredEvents.map((event) => (
              <FeaturedCard key={event.id} item={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Exhibits Section */}
      <section className="section bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-3">
              <span className="text-3xl">🖼️</span>
              {t("home.exhibits")}
            </h2>
            <Link 
              to="/exhibits"
              className="btn btn-secondary group"
            >
              {t("home.viewAll")}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="section bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-3">
              <span className="text-3xl">📅</span>
              {t("home.schedule")}
            </h2>
            <Link 
              to="/schedule"
              className="btn btn-secondary group"
            >
              {t("home.viewFull")}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="space-y-8">
            {allDates.map((date) => (
              <div key={date} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  {formatDate(date)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <section className="section bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-3">
              <span className="text-3xl">#</span>
              {t("home.explore")}
            </h2>
            <Link 
              to="/search"
              className="btn btn-primary group"
            >
              {t("home.search")}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <TagCloud tags={popularTags} showCount />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
