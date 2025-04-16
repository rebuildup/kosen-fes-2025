// src/pages/Exhibits/Exhibits.tsx
import React, { useState, useEffect } from "react";
import EventCard from "../../components/features/EventCard";
import CategoryFilter from "../../components/features/CategoryFilter";
import SearchBar from "../../components/common/SearchBar";
import { useExhibits } from "../../hooks/useExhibits";
import styles from "./Exhibits.module.css";

const Exhibits: React.FC = () => {
  const { exhibits, loading, categories } = useExhibits();
  const [filteredExhibits, setFilteredExhibits] = useState(exhibits);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Similar to Events page, filter exhibits by category and search
  useEffect(() => {
    let result = exhibits;

    if (activeCategory !== "all") {
      result = result.filter((exhibit) => exhibit.category === activeCategory);
    }

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
  }, [exhibits, activeCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className={styles.exhibitsPage}>
      <h1 className={styles.pageTitle}>展示／露店</h1>

      <div className={styles.filterContainer}>
        <SearchBar
          placeholder="展示／露店を検索"
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
