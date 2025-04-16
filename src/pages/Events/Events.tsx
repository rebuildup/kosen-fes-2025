// src/pages/Events/Events.tsx
import React, { useState, useEffect } from "react";
import EventCard from "../../components/features/EventCard";
import { useEvents, Event } from "../../hooks/useEvents";
import styles from "./Events.module.css";

const Events: React.FC = () => {
  const { events, loading, categories } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // カテゴリーや検索クエリが変更されたときにイベントをフィルタリング
  useEffect(() => {
    let result = events;

    // カテゴリーでフィルタリング
    if (activeCategory !== "all") {
      result = result.filter(
        (event: Event) => event.category === activeCategory
      );
    }

    // 検索クエリでフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event: Event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(result);
  }, [events, activeCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.eventsPage}>
      <h1 className={styles.pageTitle}>イベント一覧</h1>

      <div className={styles.filterContainer}>
        <div className={styles.searchBar}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="イベントを検索"
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.categoryButtons}>
          <button
            className={`${styles.categoryButton} ${
              activeCategory === "all" ? styles.active : ""
            }`}
            onClick={() => handleCategoryChange("all")}
          >
            すべて
          </button>
          {categories
            .filter((category: string) => category !== "all")
            .map((category: string) => (
              <button
                key={category}
                className={`${styles.categoryButton} ${
                  activeCategory === category ? styles.active : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>読み込み中...</div>
      ) : filteredEvents.length === 0 ? (
        <div className={styles.noResults}>
          <p>検索条件に一致するイベントがありません。</p>
        </div>
      ) : (
        <div className={styles.eventsGrid}>
          {filteredEvents
            .filter((event: Event) => event.type === "event")
            .map((event: Event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                image={event.image}
                date={event.date}
                time={event.time}
                location={event.location}
                category={event.category}
                type="event"
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Events;
