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
    <div>
      {/* Hero Section */}
      <section>
        <div>
          <h1>{t("siteName")}</h1>
          <p>{t("home.subtitle")}</p>
          <div>
            <span>📅</span>
            <span>{t("home.dates")}</span>
          </div>
          <Link to="/schedule">
            {t("home.viewSchedule")}
            <span>→</span>
          </Link>
        </div>
        <div>
          <div>祭</div>
        </div>
      </section>

      {/* Events Section */}
      <section>
        <div>
          <h2>
            <span>🎭</span>
            {t("home.events")}
          </h2>
          <Link to="/events">
            {t("home.viewAll")}
            <span>→</span>
          </Link>
        </div>

        <div>
          {featuredEvents.map((event) => (
            <FeaturedCard key={event.id} item={event} />
          ))}
        </div>
      </section>

      {/* Exhibits Section */}
      <section>
        <div>
          <h2>
            <span>🖼️</span>
            {t("home.exhibits")}
          </h2>
          <Link to="/exhibits">
            {t("home.viewAll")}
            <span>→</span>
          </Link>
        </div>

        <div>
          <CardGrid
            items={[...featuredExhibits, ...featuredStalls]}
            variant="default"
            showTags
            showDescription
          />
        </div>
      </section>

      {/* Schedule Section */}
      <section>
        <div>
          <h2>
            <span>📅</span>
            {t("home.schedule")}
          </h2>
          <Link to="/schedule">
            {t("home.viewFull")}
            <span>→</span>
          </Link>
        </div>

        <div>
          {allDates.map((date) => (
            <div key={date}>
              <h3>{formatDate(date)}</h3>
              <div>
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

      {/* Search Section */}
      <section>
        <div>
          <h2>
            <span>#</span>
            {t("home.explore")}
          </h2>
          <Link to="/search">
            {t("home.search")}
            <span>→</span>
          </Link>
        </div>

        <TagCloud tags={popularTags} showCount />
      </section>
    </div>
  );
};

export default Home;
