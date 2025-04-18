import { useEffect, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTag } from "../../context/TagContext";
import { Item } from "../../types/common";
import CardGrid from "../common/CardGrid";

interface FilteredResults {
  events: Item[];
  exhibits: Item[];
  stalls: Item[];
}

const SearchResults = () => {
  const { searchQuery, searchResults, isSearching } = useSearch();
  const { t } = useLanguage();
  const { selectedTags, filterItemsByTags } = useTag();

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
            <mark key={i}>{part}</mark>
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
    return <div className="search-loading">{t("search.searching")}...</div>;
  }

  if (totalResults === 0 && (searchQuery || selectedTags.length > 0)) {
    return <div className="search-no-results">{t("search.noResults")}</div>;
  }

  return (
    <div className="search-results">
      {filteredResults.events.length > 0 && (
        <section className="search-section">
          <h3>
            {t("events.title")} ({filteredResults.events.length})
          </h3>
          <CardGrid
            items={filteredResults.events}
            variant="compact"
            highlightText={highlightMatch}
            emptyMessage={t("events.noEvents")}
          />
        </section>
      )}

      {filteredResults.exhibits.length > 0 && (
        <section className="search-section">
          <h3>
            {t("detail.exhibit")} ({filteredResults.exhibits.length})
          </h3>
          <CardGrid
            items={filteredResults.exhibits}
            variant="compact"
            highlightText={highlightMatch}
            emptyMessage={t("exhibits.noExhibits")}
          />
        </section>
      )}

      {filteredResults.stalls.length > 0 && (
        <section className="search-section">
          <h3>
            {t("detail.stall")} ({filteredResults.stalls.length})
          </h3>
          <CardGrid
            items={filteredResults.stalls}
            variant="compact"
            highlightText={highlightMatch}
            emptyMessage={t("exhibits.noStalls")}
          />
        </section>
      )}
    </div>
  );
};

export default SearchResults;
