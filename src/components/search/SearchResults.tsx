import { useEffect, useState, useCallback } from "react";
import { useSearch } from "../../context/SearchContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTag } from "../../context/TagContext";
import { useData } from "../../context/DataContext";
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
  const { selectedTags } = useTag();
  const { filterByTags } = useData();

  const [viewMode, setViewMode] = useState<
    "default" | "compact" | "grid" | "list"
  >("default");
  const [filteredResults, setFilteredResults] = useState<FilteredResults>({
    events: [],
    exhibits: [],
    stalls: [],
  });

  // Memoize the filtering function to prevent unnecessary re-creation
  const filterItemsBySelectedTags = useCallback(
    (items: Item[]) => {
      if (selectedTags.length === 0) return items;
      return items.filter((item) =>
        selectedTags.every((tag) => item.tags?.includes(tag))
      );
    },
    [selectedTags]
  );

  // Apply both search and tag filtering
  useEffect(() => {
    const normalizedQuery = searchQuery.trim();
    let baseResults = searchResults as Item[];

    if (!normalizedQuery) {
      baseResults =
        selectedTags.length > 0
          ? (filterByTags(selectedTags) as unknown as Item[])
          : [];
    }

    const tagFilteredResults =
      selectedTags.length > 0
        ? filterItemsBySelectedTags(baseResults)
        : baseResults;

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
  }, [
    searchResults,
    filterItemsBySelectedTags,
    selectedTags,
    searchQuery,
    filterByTags,
  ]);

  // Highlight matching text
  const highlightSearchQuery = (text: string, query: string): ReactNode => {
    if (!query.trim() || !text) return <>{text}</>;

    try {
      const parts = text.split(new RegExp(`(${query})`, "gi"));
      return (
        <>
          {parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
              <mark
                key={i}
                className="bg-gradient-to-r from-[var(--accent-yellow)] to-[var(--accent-orange)] text-[var(--text-primary)] px-1 rounded"
              >
                {part}
              </mark>
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
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full mx-auto mb-4"></div>
        <span className="text-[var(--text-secondary)]">
          {t("search.searching")}
        </span>
      </div>
    );
  }

  // No search query entered yet
  if (!searchQuery && selectedTags.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        <p>{t("search.searchPrompt")}</p>
      </div>
    );
  }

  // No results found
  if (totalResults === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          {t("search.noResults")}
        </h2>
        <p className="text-[var(--text-secondary)]">
          {t("search.tryDifferentKeywords")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            {t("search.results")}
          </h2>
          {totalResults > 0 && (
            <span className="px-3 py-1 bg-[var(--primary-color)] text-white rounded-full text-sm font-medium">
              {totalResults} {t("search.items")}
            </span>
          )}
        </div>

        {/* View Mode Toggle - Right side */}
        <CardListToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Results Sections */}
      <div className="space-y-8">
        {filteredResults.events.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[var(--accent-purple)] to-[var(--accent-pink)] rounded-full"></div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                🎭 {t("navigation.events")}
              </h3>
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
              <span className="text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full">
                {filteredResults.events.length} {t("search.items")}
              </span>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
              <CardGrid
                items={filteredResults.events}
                variant={viewMode}
                showTags={true}
                showDescription={viewMode === "list"}
                highlightText={(text) =>
                  highlightSearchQuery(text, searchQuery)
                }
                emptyMessage={t("events.noEventsFound")}
                filterType="all"
              />
            </div>
          </section>
        )}

        {filteredResults.exhibits.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[var(--accent-blue)] to-[var(--accent-teal)] rounded-full"></div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                🎨 {t("exhibits.filters.exhibits")}
              </h3>
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
              <span className="text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full">
                {filteredResults.exhibits.length} {t("search.items")}
              </span>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
              <CardGrid
                items={filteredResults.exhibits}
                variant={viewMode}
                showTags={true}
                showDescription={viewMode === "list"}
                highlightText={(text) =>
                  highlightSearchQuery(text, searchQuery)
                }
                emptyMessage={t("exhibits.noExhibits")}
                filterType="all"
              />
            </div>
          </section>
        )}

        {filteredResults.stalls.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[var(--accent-orange)] to-[var(--accent-red)] rounded-full"></div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                🍜 {t("exhibits.filters.stalls")}
              </h3>
              <div className="flex-1 h-px bg-[var(--border-color)]"></div>
              <span className="text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full">
                {filteredResults.stalls.length} {t("search.items")}
              </span>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
              <CardGrid
                items={filteredResults.stalls}
                variant={viewMode}
                showTags={true}
                showDescription={viewMode === "list"}
                highlightText={(text) =>
                  highlightSearchQuery(text, searchQuery)
                }
                emptyMessage={t("exhibits.noStalls")}
                filterType="all"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
