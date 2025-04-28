import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Item } from "../types/common";
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";
import FeaturedCard from "../components/common/FeaturedCard";
import CardGrid from "../components/common/CardGrid";
import TagCloud from "../components/common/TagCloud";

const Home = () => {
  const { t } = useLanguage();
  const [featuredEvents, setFeaturedEvents] = useState<Item[]>([]);
  const [featuredExhibits, setFeaturedExhibits] = useState<Item[]>([]);
  const [featuredStalls, setFeaturedStalls] = useState<Item[]>([]);
  const [timelineItems, setTimelineItems] = useState<{
    [date: string]: Item[];
  }>({});
  const [popularTags, setPopularTags] = useState<string[]>([]);

  // Get unique dates from all items
  const allDates = [
    ...new Set([...events, ...exhibits, ...stalls].map((item) => item.date)),
  ].sort();

  // Group items by date
  useEffect(() => {
    const allItems = [...events, ...exhibits, ...stalls];
    const byDate: { [date: string]: Item[] } = {};

    allDates.forEach((date) => {
      byDate[date] = allItems.filter((item) => item.date === date);
    });

    setTimelineItems(byDate);
  }, []);

  // Get featured items
  useEffect(() => {
    setFeaturedEvents(events.slice(0, 2));
    setFeaturedExhibits(exhibits.slice(0, 2));
    setFeaturedStalls(stalls.slice(0, 1));

    // Extract popular tags
    const allItems = [...events, ...exhibits, ...stalls];
    const tagCounts: { [tag: string]: number } = {};
    allItems.forEach((item) => {
      item.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);

    setPopularTags(sortedTags);
  }, []);

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
