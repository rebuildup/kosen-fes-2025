// src/pages/Bookmarks/Bookmarks.tsx
import React, { useState } from "react";
import EventCard from "../../components/features/EventCard";
import { useBookmarks } from "../../hooks/useBookmarks";
import styles from "./Bookmarks.module.css";

const Bookmarks: React.FC = () => {
  const { bookmarks, loading, removeBookmark, clearAllBookmarks } =
    useBookmarks();
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter bookmarks by type
  const filteredBookmarks =
    activeFilter === "all"
      ? bookmarks
      : bookmarks.filter((item) => item.type === activeFilter);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleClearAll = () => {
    if (window.confirm("すべてのブックマークを削除してもよろしいですか？")) {
      clearAllBookmarks();
    }
  };

  return (
    <div className={styles.bookmarksPage}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>ブックマーク</h1>

        {bookmarks.length > 0 && (
          <button className={styles.clearAllButton} onClick={handleClearAll}>
            すべて削除
          </button>
        )}
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>読み込み中...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
          </svg>
          <h2 className={styles.emptyTitle}>ブックマークがありません</h2>
          <p className={styles.emptyText}>
            気になるイベントや展示を保存してここで確認できます。
          </p>
        </div>
      ) : (
        <>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "all" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("all")}
            >
              すべて ({bookmarks.length})
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "event" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("event")}
            >
              イベント (
              {bookmarks.filter((item) => item.type === "event").length})
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "exhibit" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("exhibit")}
            >
              展示／露店 (
              {bookmarks.filter((item) => item.type === "exhibit").length})
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "location" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("location")}
            >
              会場 (
              {bookmarks.filter((item) => item.type === "location").length})
            </button>
          </div>

          <div className={styles.bookmarksGrid}>
            {filteredBookmarks.map((item) => (
              <EventCard
                key={`${item.type}-${item.id}`}
                id={item.id}
                title={item.title}
                image={item.image}
                date={item.date}
                time={item.time}
                location={item.location}
                category={item.category}
                type={item.type as "event" | "exhibit"}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Bookmarks;
