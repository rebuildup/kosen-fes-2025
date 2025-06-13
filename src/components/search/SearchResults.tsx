import { useEffect, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTag } from "../../context/TagContext";
import { Item } from "../../types/common";
import CardGrid from "../common/CardGrid";
import CardListToggle from "../common/CardListToggle";
import { ReactNode } from "react";

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
  const highlightSearchQuery = (text: string, query: string): ReactNode => {
    if (!query.trim() || !text) return <>{text}</>;

    try {
      const parts = text.split(new RegExp(`(${query})`, "gi"));
      return (
        <>
          {parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
              <mark key={i}>{part}</mark>
            ) : (
              part
            )
          )}
        </>
      );
    } catch (e) {
      console.error("Error highlighting text:", e);
      return <>{text}</>;
    }
  };

  const totalResults =
    filteredResults.events.length +
    filteredResults.exhibits.length +
    filteredResults.stalls.length;

  if (isSearching) {
    return (
      <div>
        <div></div>
        <span>{t("search.searching")}</span>
      </div>
    );
  }

  // No search query entered yet
  if (!searchQuery && selectedTags.length === 0) {
    return (
      <div>
        <p>{t("search.enterQuery")}</p>
      </div>
    );
  }

  // No results found
  if (totalResults === 0) {
    return (
      <div>
        <div>🔍</div>
        <h2>{t("search.noResults")}</h2>
        <p>{t("search.tryDifferentQuery")}</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          {totalResults > 0 && (
            <span>
              {totalResults}{" "}
              {t(totalResults === 1 ? "search.result" : "search.results")}
            </span>
          )}
        </div>

        <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {filteredResults.events.length > 0 && (
        <section>
          <h3>
            {t("events.title")} ({filteredResults.events.length})
          </h3>
          <CardGrid
            items={filteredResults.events}
            variant={viewMode}
            showTags={true}
            showDescription={viewMode === "list"}
            highlightText={(text) => highlightSearchQuery(text, searchQuery)}
          />
        </section>
      )}

      {filteredResults.exhibits.length > 0 && (
        <section>
          <h3>
            {t("exhibits.title")} ({filteredResults.exhibits.length})
          </h3>
          <CardGrid
            items={filteredResults.exhibits}
            variant={viewMode}
            showTags={true}
            showDescription={viewMode === "list"}
            highlightText={(text) => highlightSearchQuery(text, searchQuery)}
          />
        </section>
      )}

      {filteredResults.stalls.length > 0 && (
        <section>
          <h3>
            {t("stalls.title")} ({filteredResults.stalls.length})
          </h3>
          <CardGrid
            items={filteredResults.stalls}
            variant={viewMode}
            showTags={true}
            showDescription={viewMode === "list"}
            highlightText={(text) => highlightSearchQuery(text, searchQuery)}
          />
        </section>
      )}
    </div>
  );
};

export default SearchResults;
