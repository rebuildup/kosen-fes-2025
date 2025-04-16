// src/pages/Search/Search.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EventCard from "../../components/features/EventCard/EventCard";
import { useEvents } from "../../hooks/useEvents";
import { Event } from "../../hooks/useEvents";
import styles from "./Search.module.css";

const Search: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const { events, loading } = useEvents();

  // 検索クエリが変更されたときに検索を実行
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = events.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          (item.tags &&
            item.tags.some((tag) => tag.toLowerCase().includes(query)))
      );

      setSearchResults(results);

      // URLにクエリパラメータを設定
      const newUrl = `${location.pathname}?q=${encodeURIComponent(query)}`;
      navigate(newUrl, { replace: true });
    } else {
      setSearchResults([]);
      navigate(location.pathname, { replace: true });
    }
  }, [searchQuery, events, navigate, location.pathname]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // フォーム送信時に明示的に検索実行
    const query = searchQuery.toLowerCase();
    if (query.trim()) {
      const results = events.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          (item.tags &&
            item.tags.some((tag) => tag.toLowerCase().includes(query)))
      );

      setSearchResults(results);
    }
  };

  return (
    <div className={styles.searchPage}>
      <h1 className={styles.pageTitle}>検索</h1>

      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <div className={styles.searchInputContainer}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="イベント、展示、会場などを検索"
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            検索
          </button>
        </div>
      </form>

      <div className={styles.resultsContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>読み込み中...</p>
          </div>
        ) : searchQuery ? (
          searchResults.length > 0 ? (
            <>
              <div className={styles.resultsInfo}>
                <p className={styles.resultsCount}>
                  "{searchQuery}" の検索結果: {searchResults.length}件
                </p>
              </div>

              <div className={styles.resultsGrid}>
                {searchResults.map((item) => (
                  <EventCard
                    key={`${item.type}-${item.id}`}
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    date={item.date}
                    time={item.time}
                    location={item.location}
                    category={item.category}
                    type={item.type}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.noResults}>
              <svg className={styles.noResultsIcon} viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <p className={styles.noResultsText}>
                "{searchQuery}" に一致する検索結果はありませんでした
              </p>
              <ul className={styles.searchTips}>
                <li>別のキーワードをお試しください</li>
                <li>より一般的な用語を使用してください</li>
                <li>キーワードの数を減らしてください</li>
              </ul>
            </div>
          )
        ) : (
          <div className={styles.initialState}>
            <svg className={styles.searchIllustration} viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <p className={styles.initialText}>
              検索キーワードを入力して、イベント、展示、会場などを検索してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
