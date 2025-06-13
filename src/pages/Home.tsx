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
    <div className="home-page">
      {/* Hero/Banner Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-hero-title">{t("siteName")}</h1>
          <p className="home-hero-subtitle">{t("home.subtitle")}</p>
          <div className="home-hero-dates">
            <span className="home-hero-dates-icon">📅</span>
            <span>2025/06/15 - 2025/06/16</span>
          </div>
          <Link to="/schedule" className="home-hero-cta">
            {t("schedule.title")}
            <span className="home-hero-cta-icon">→</span>
          </Link>
        </div>
        <div className="home-hero-decoration">
          <div className="festival-symbol">祭</div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="home-section">
        <div className="home-section-header">
          <h2 className="home-section-title">
            <span className="home-section-icon">🎭</span>
            {t("home.featuredEvents")}
          </h2>
          <Link to="/events" className="home-section-link">
            {t("common.showAll")}
            <span className="home-section-link-icon">→</span>
          </Link>
        </div>

        {featuredEvents.length > 0 && <FeaturedCard item={featuredEvents[0]} />}

        {featuredEvents.length > 1 && (
          <CardGrid
            items={featuredEvents.slice(1)}
            variant="default"
            showTags
            showDescription
          />
        )}
      </section>

      {/* Featured Exhibits Section */}
      <section className="home-section">
        <div className="home-section-header">
          <h2 className="home-section-title">
            <span className="home-section-icon">🖼️</span>
            {t("home.featuredExhibits")}
          </h2>
          <Link to="/exhibits" className="home-section-link">
            {t("common.showAll")}
            <span className="home-section-link-icon">→</span>
          </Link>
        </div>

        <CardGrid
          items={[...featuredExhibits, ...featuredStalls]}
          variant="default"
          showTags
          showDescription
        />
      </section>

      {/* Timeline Section */}
      <section className="home-section">
        <div className="home-section-header">
          <h2 className="home-section-title">
            <span className="home-section-icon">📅</span>
            {t("schedule.title")}
          </h2>
          <Link to="/schedule" className="home-section-link">
            {t("common.showAll")}
            <span className="home-section-link-icon">→</span>
          </Link>
        </div>

        <div className="home-timeline">
          {allDates.map((date) => (
            <div key={date} className="home-timeline-group">
              <h3 className="home-timeline-date">{formatDate(date)}</h3>
              <div className="home-timeline-items">
                <CardGrid
                  items={timelineItems[date]?.slice(0, 3) || []}
                  variant="compact"
                  showTags={false}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Tags Section */}
      <section className="home-section">
        <div className="home-section-header">
          <h2 className="home-section-title">
            <span className="home-section-icon">#</span>
            {t("tags.popularTags")}
          </h2>
          <Link to="/search" className="home-section-link">
            {t("search.title")}
            <span className="home-section-link-icon">→</span>
          </Link>
        </div>

        <TagCloud tags={popularTags} showCount />
      </section>
    </div>
  );
};

export default Home;
