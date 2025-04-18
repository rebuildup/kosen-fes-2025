import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import FeaturedEvents from "../components/pages/home/FeaturedEvents";
import Timeline from "../components/pages/home/Timeline";
import { events } from "../data/events";
import { exhibitions } from "../data/exhibitions";
import { foodStalls } from "../data/foodStalls";

const HomePage: React.FC = () => {
  const { t } = useLanguage();

  // Combine all items for the timeline
  const allItems = [
    ...events.map((event) => ({ ...event, type: "event" as const })),
    ...exhibitions.map((exhibition) => ({
      ...exhibition,
      type: "exhibition" as const,
    })),
    ...foodStalls.map((foodStall) => ({
      ...foodStall,
      type: "foodStall" as const,
    })),
  ];

  // Sort items by date (assuming date is in format 'YYYY-MM-DD HH:MM')
  const sortedItems = [...allItems].sort((a, b) => {
    if (a.date && b.date) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return 0;
  });

  // Get featured events (could be based on a featured flag, popularity, etc.)
  const featuredItems = allItems
    .filter((item) => item.tags?.includes("featured") || Math.random() > 0.7) // Simulating featured items
    .slice(0, 6);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="relative mb-12 overflow-hidden rounded-xl bg-primary-600 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="relative z-10 max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
              {t("home.title")}
            </h1>
            <p className="mb-6 text-xl opacity-90">{t("home.subtitle")}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/events"
                className="rounded-full bg-white px-6 py-2 font-medium text-primary-600 transition-colors hover:bg-gray-100"
              >
                {t("header.events")}
              </Link>
              <Link
                to="/exhibitions"
                className="rounded-full border border-white bg-transparent px-6 py-2 font-medium text-white transition-colors hover:bg-white/10"
              >
                {t("header.exhibitions")}
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
            >
              <path
                fill="white"
                d="M47.1,-63.4C59.3,-53.9,66.6,-37.7,71.2,-21.1C75.9,-4.5,78,12.4,72.3,26.4C66.6,40.4,53.2,51.4,38.8,58.9C24.5,66.4,9.2,70.3,-6.9,70.1C-23,69.9,-45.9,65.5,-56.8,53.1C-67.7,40.8,-66.4,20.4,-65.9,0.3C-65.3,-19.8,-65.5,-39.7,-56.2,-51.5C-46.9,-63.4,-28.1,-67.3,-10.5,-66.2C7.1,-65.1,34.9,-72.9,47.1,-63.4Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t("home.featuredEvents")}</h2>
            <Link
              to="/events"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {t("home.viewAll")}
            </Link>
          </div>

          <FeaturedEvents items={featuredItems} />
        </div>
      </section>

      {/* Timeline Section */}
      <section>
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{t("home.timeline")}</h2>
          </div>

          <Timeline items={sortedItems} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
