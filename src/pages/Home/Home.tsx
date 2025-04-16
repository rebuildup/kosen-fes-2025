// src/pages/Home/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import FestivalBanner from "../../components/features/FestivalBanner/FestivalBanner";
import EventCard from "../../components/features/EventCard/EventCard";
import TimelinePost from "../../components/features/TimelinePost/TimelinePost";
import { useFeaturedEvents } from "../../hooks/useEvents";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const { events, loading } = useFeaturedEvents();

  return (
    <div className={styles.homePage}>
      <FestivalBanner />

      <section className={styles.timelineSection}>
        <h2 className={styles.sectionTitle}>最新情報</h2>

        <div className={styles.timelineContainer}>
          {loading ? (
            <div className={styles.loading}>読み込み中...</div>
          ) : (
            <>
              {events.map((event) => (
                <TimelinePost
                  key={event.id}
                  title={event.title}
                  date={format(new Date(event.date), "MM月dd日(EEE)", {
                    locale: ja,
                  })}
                  time={event.time}
                  description={event.description}
                  category={event.category}
                  image={event.image}
                  location={event.location}
                  link={`/detail/${event.type}/${event.id}`}
                />
              ))}
            </>
          )}
        </div>
      </section>

      <section className={styles.highlightsSection}>
        <h2 className={styles.sectionTitle}>注目イベント</h2>

        <div className={styles.highlightsGrid}>
          {events.slice(0, 3).map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              image={event.image}
              date={event.date}
              time={event.time}
              location={event.location}
              category={event.category}
              type={event.type}
              compact
            />
          ))}
        </div>

        <Link to="/events" className={styles.viewAllLink}>
          すべてのイベントを見る
          <svg className={styles.arrowIcon} viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </Link>
      </section>
    </div>
  );
};

export default Home;
