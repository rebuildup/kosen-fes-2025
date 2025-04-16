// src/pages/Exhibits/Exhibits.tsx
import React, { useState, useEffect } from "react";
import EventCard from "../../components/features/EventCard/EventCard";
import { useEvents } from "../../hooks/useEvents";
import styles from "./Exhibits.module.css";

const Exhibits: React.FC = () => {
  const { events, loading, categories } = useEvents();
  const [filteredExhibits, setFilteredExhibits] = useState(events);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // カテゴリーや検索クエリが変更されたときに展示をフィルタリング
  useEffect(() => {
    // まず、展示/露店タイプのみ取得
    let result = events.filter((event) => event.type === "exhibit");

    // カテゴリーでフィルタリング
    if (activeCategory !== "all") {
      result = result.filter((exhibit) => exhibit.category === activeCategory);
    }

    // 検索クエリでフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (exhibit) =>
          exhibit.title.toLowerCase().includes(query) ||
          exhibit.description.toLowerCase().includes(query) ||
          exhibit.location.toLowerCase().includes(query)
      );
    }

    setFilteredExhibits(result);
  }, [events, activeCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.exhibitsPage}>
      <h1 className={styles.pageTitle}>展示／露店一覧</h1>

      <div className={styles.filterContainer}>
        <div className={styles.searchBar}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="展示/露店を検索"
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
            .filter((category) => category !== "all")
            .map((category) => (
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
      ) : filteredExhibits.length === 0 ? (
        <div className={styles.noResults}>
          <p>検索条件に一致する展示／露店がありません。</p>
        </div>
      ) : (
        <div className={styles.exhibitsGrid}>
          {filteredExhibits.map((exhibit) => (
            <EventCard
              key={exhibit.id}
              id={exhibit.id}
              title={exhibit.title}
              image={exhibit.image}
              date={exhibit.date}
              time={exhibit.time}
              location={exhibit.location}
              category={exhibit.category}
              type="exhibit"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Exhibits;
