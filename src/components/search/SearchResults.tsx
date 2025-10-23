import { useCallback, useEffect, useState } from "react";

import { useData } from "../../context/DataContext";
import { useLanguage } from "../../context/LanguageContext";
import { useSearch } from "../../context/SearchContext";
import { useTag } from "../../context/TagContext";
import { highlightSearchQuery } from "../../shared/utils/highlight";
import type { Item } from "../../types/common";
import CardGrid from "../common/CardGrid";
import CardListToggle from "../common/CardListToggle";
import { EventIcon, ExhibitIcon, StallIcon } from "../icons";

interface FilteredResults {
  events: Item[];
  exhibits: Item[];
  stalls: Item[];
}

// moved to shared/utils/highlight

const SearchResults = () => {
  const { isSearching, searchQuery, searchResults } = useSearch();
  const { t } = useLanguage();
  const { selectedTags } = useTag();
  const { filterByTags } = useData();

  const [viewMode, setViewMode] = useState<"default" | "compact" | "grid" | "list">("default");
  const [filteredResults, setFilteredResults] = useState<FilteredResults>({
    events: [],
    exhibits: [],
    stalls: [],
  });

  // Memoize the filtering function to prevent unnecessary re-creation
  const filterItemsBySelectedTags = useCallback(
    (items: Item[]) => {
      if (selectedTags.length === 0) return items;
      return items.filter((item) => selectedTags.every((tag) => item.tags?.includes(tag)));
    },
    [selectedTags],
  );

  // Apply both search and tag filtering
  useEffect(() => {
    const normalizedQuery = searchQuery.trim();
    let baseResults = searchResults as Item[];

    if (!normalizedQuery) {
      baseResults =
        selectedTags.length > 0 ? (filterByTags(selectedTags) as unknown as Item[]) : [];
    }

    const tagFilteredResults =
      selectedTags.length > 0 ? filterItemsBySelectedTags(baseResults) : baseResults;

    // Group results by type
    const groupedResults: FilteredResults = {
      events: [],
      exhibits: [],
      stalls: [],
    };

    for (const item of tagFilteredResults) {
      switch (item.type) {
        case "event": {
          groupedResults.events.push(item);

          break;
        }
        case "exhibit": {
          groupedResults.exhibits.push(item);

          break;
        }
        case "stall": {
          groupedResults.stalls.push(item);

          break;
        }
        // No default
      }
    }

    setFilteredResults(groupedResults);
  }, [searchResults, filterItemsBySelectedTags, selectedTags, searchQuery, filterByTags]);

  // Highlight matching text: use module function

  const totalResults =
    filteredResults.events.length + filteredResults.exhibits.length + filteredResults.stalls.length;

  if (isSearching) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary-color)] border-t-transparent" />
        <span className="text-[var(--text-secondary)]">{t("search.searching")}</span>
      </div>
    );
  }

  // No search query entered yet
  if (!searchQuery && selectedTags.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--text-secondary)]">
        <p>{t("search.searchPrompt")}</p>
      </div>
    );
  }

  // No results found
  if (totalResults === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">
          {t("search.noResults")}
        </h2>
        <p className="text-[var(--text-secondary)]">{t("search.tryDifferentKeywords")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            {t("search.results")}
          </h2>
          {totalResults > 0 && (
            <span className="rounded-full bg-[var(--primary-color)] px-3 py-1 text-sm font-medium text-white">
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
          <section key="events-section" className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-1 rounded-full"
                style={{
                  background:
                    "linear-gradient(to bottom, var(--accent-purple), var(--accent-pink))",
                }}
              />
              <EventIcon size={24} style={{ color: "var(--accent-purple)" }} />
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                {t("navigation.events")}
              </h3>
              <div className="h-px flex-1 bg-[var(--border-color)]" />
              <span className="rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-sm text-[var(--text-secondary)]">
                {filteredResults.events.length} {t("search.items")}
              </span>
            </div>

            <div className="rounded-xl bg-[var(--bg-secondary)] p-6">
              <CardGrid
                items={filteredResults.events}
                variant={viewMode}
                showTags={true}
                showDescription={viewMode === "list"}
                highlightText={(text) => highlightSearchQuery(text, searchQuery)}
                emptyMessage={t("events.noEventsFound")}
                filterType="all"
              />
            </div>
          </section>
        )}

        {filteredResults.exhibits.length > 0 && (
          <section key="exhibits-section" className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-1 rounded-full"
                style={{
                  background: "linear-gradient(to bottom, var(--accent-blue), var(--accent-teal))",
                }}
              />
              <ExhibitIcon size={24} style={{ color: "var(--accent-blue)" }} />
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                {t("exhibits.filters.exhibits")}
              </h3>
              <div className="h-px flex-1 bg-[var(--border-color)]" />
              <span className="rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-sm text-[var(--text-secondary)]">
                {filteredResults.exhibits.length} {t("search.items")}
              </span>
            </div>

            <div className="rounded-xl bg-[var(--bg-secondary)] p-6">
              <CardGrid
                items={filteredResults.exhibits}
                variant={viewMode}
                showTags={true}
                showDescription={viewMode === "list"}
                highlightText={(text) => highlightSearchQuery(text, searchQuery)}
                emptyMessage={t("exhibits.noExhibits")}
                filterType="all"
              />
            </div>
          </section>
        )}

        {filteredResults.stalls.length > 0 && (
          <section key="stalls-section" className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-1 rounded-full"
                style={{
                  background: "linear-gradient(to bottom, var(--accent-orange), var(--accent-red))",
                }}
              />
              <StallIcon size={24} style={{ color: "var(--accent-orange)" }} />
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                {t("exhibits.filters.stalls")}
              </h3>
              <div className="h-px flex-1 bg-[var(--border-color)]" />
              <span className="rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-sm text-[var(--text-secondary)]">
                {filteredResults.stalls.length} {t("search.items")}
              </span>
            </div>

            <div className="rounded-xl bg-[var(--bg-secondary)] p-6">
              <CardGrid
                items={filteredResults.stalls}
                variant={viewMode}
                showTags={true}
                showDescription={viewMode === "list"}
                highlightText={(text) => highlightSearchQuery(text, searchQuery)}
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
