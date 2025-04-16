// src/pages/Search/Search.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../../components/common/SearchBar";
import EventCard from "../../components/features/EventCard";
import { useSearch } from "../../hooks/useSearch";
import styles from "./Search.module.css";

const Search: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const { results, loading, totalResults } = useSearch(searchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Update URL with search query
    const newUrl = query
      ? `${window.location.pathname}?q=${encodeURIComponent(query)}`
      : window.location.pathname;
    window.history.pushState({}, "", newUrl);
  };

  return (
    <div className={styles.searchPage}>
      <h1 className={styles.pageTitle}>検索</h1>

      <div className={styles.searchContainer}>
        <SearchBar
          initialValue={searchQuery}
          placeholder="イベント、展示、会場などを検索"
          onSearch={handleSearch}
          fullWidth
        />
      </div>

      <div className={styles.resultsContainer}>
        {searchQuery ? (
          <>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>検索中...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <p className={styles.resultsCount}>
                  "{searchQuery}" の検索結果: {totalResults}件
                </p>

                <div className={styles.resultsGrid}>
                  {results.map((item) => (
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
                  "{searchQuery}" に一致する検索結果はありませんでした。
                </p>
                <ul className={styles.searchTips}>
                  <li>別のキーワードをお試しください</li>
                  <li>より一般的な用語を使用してください</li>
                  <li>キーワードの数を減らしてください</li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className={styles.initialState}>
            <svg className={styles.searchIllustration} viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <p className={styles.initialText}>
              検索キーワードを入力して、イベント、展示、会場などを検索してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
