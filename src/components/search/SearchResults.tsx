import { useEffect, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTag } from "../../context/TagContext";
import { Item } from "../../types/common";
import CardGrid from "../common/CardGrid";
import CardListToggle from "../common/CardListToggle";

interface FilteredResults {
  events: Item[];
  exhibits: Item[];
  stalls: Item[];
}

const SearchResults = () => {
  const { searchQuery, searchResults, isSearching } = useSearch();
  const { t } = useLanguage();
  const { selectedTags, filterItemsByTags } = useTag();

  const [viewMode, setViewMode] = useState<
    "default" | "compact" | "grid" | "list"
  >("default");
  const [filteredResults, setFilteredResults] = useState<FilteredResults>({
    events: [],
    exhibits: [],
    stalls: [],
  });

  // Apply both search and tag filtering
  useEffect(() => {
    // Apply tag filtering to search results
    const tagFilteredResults =
      selectedTags.length > 0
        ? filterItemsByTags(searchResults)
        : searchResults;

    // Group results by type
    const groupedResults: FilteredResults = {
      events: [],
      exhibits: [],
      stalls: [],
    };

    tagFilteredResults.forEach((item) => {
      if (item.type === "event") {
        groupedResults.events.push(item);
      } else if (item.type === "exhibit") {
        groupedResults.exhibits.push(item);
      } else if (item.type === "stall") {
        groupedResults.stalls.push(item);
      }
    });

    setFilteredResults(groupedResults);
  }, [searchResults, selectedTags, filterItemsByTags]);

  // Highlight matching text
  const highlightMatch = (text: string): React.ReactNode => {
    if (!searchQuery.trim() || !text) return <>{text}</>;

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={i} className="search-highlight">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const totalResults =
    filteredResults.events.length +
    filteredResults.exhibits.length +
    filteredResults.stalls.length;

  if (isSearching) {
    return (
      <div className="search-loading">
        <div className="spinner"></div>
        <p>{t("search.searching")}...</p>
      </div>
    );
  }

  // No search query entered yet
  if (!searchQuery && selectedTags.length === 0) {
    return (
      <div className="search-prompt">
        <p>{t("search.enterQuery")}</p>
      </div>
    );
  }

  // No results found
  if (totalResults === 0) {
    return (
      <div className="search-no-results">
        <div className="search-no-results-icon">🔍</div>
        <h3>{t("search.noResults")}</h3>
        <p>{t("search.tryDifferentQuery")}</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-results-header">
        <div className="search-results-count">
          {totalResults}{" "}
          {t(totalResults === 1 ? "search.result" : "search.results")}
        </div>

        <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {filteredResults.events.length > 0 && (
        <section className="search-section">
          <h3 className="search-section-title">
            {t("events.title")} ({filteredResults.events.length})
          </h3>
          <CardGrid
            items={filteredResults.events}
            variant={viewMode}
            highlightText={highlightMatch}
            showTags={true}
            showDescription={viewMode === "list"}
            emptyMessage={t("events.noEvents")}
          />
        </section>
      )}

      {filteredResults.exhibits.length > 0 && (
        <section className="search-section">
          <h3 className="search-section-title">
            {t("detail.exhibit")} ({filteredResults.exhibits.length})
          </h3>
          <CardGrid
            items={filteredResults.exhibits}
            variant={viewMode}
            highlightText={highlightMatch}
            showTags={true}
            showDescription={viewMode === "list"}
            emptyMessage={t("exhibits.noExhibits")}
          />
        </section>
      )}

      {filteredResults.stalls.length > 0 && (
        <section className="search-section">
          <h3 className="search-section-title">
            {t("detail.stall")} ({filteredResults.stalls.length})
          </h3>
          <CardGrid
            items={filteredResults.stalls}
            variant={viewMode}
            highlightText={highlightMatch}
            showTags={true}
            showDescription={viewMode === "list"}
            emptyMessage={t("exhibits.noStalls")}
          />
        </section>
      )}
    </div>
  );
};

export default SearchResults;
