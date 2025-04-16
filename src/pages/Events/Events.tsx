// src/pages/Events/Events.tsx
import React, { useState, useEffect } from "react";
import EventCard from "../../components/features/EventCard";
import CategoryFilter from "../../components/features/CategoryFilter";
import SearchBar from "../../components/common/SearchBar";
import { useEvents } from "../../hooks/useEvents";
import styles from "./Events.module.css";

const Events: React.FC = () => {
  const { events, loading, categories } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter events when category or search query changes
  useEffect(() => {
    let result = events;

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((event) => event.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className={styles.eventsPage}>
      <h1 className={styles.pageTitle}>イベント一覧</h1>

      <div className={styles.filterContainer}>
        <SearchBar
          placeholder="イベントを検索"
          onSearch={handleSearch}
          className={styles.searchBar}
        />

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>読み込み中...</div>
      ) : filteredEvents.length === 0 ? (
        <div className={styles.noResults}>
          <p>検索条件に一致するイベントがありません。</p>
        </div>
      ) : (
        <div className={styles.eventsGrid}>
          {filteredEvents.map((event) => (
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
