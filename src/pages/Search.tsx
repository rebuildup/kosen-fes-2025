import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import SearchBar from "../components/common/SearchBar";
import TagFilter from "../components/common/TagFilter";
import SearchResults from "../components/search/SearchResults";
import { useLanguage } from "../context/LanguageContext";
import { useSearch } from "../context/SearchContext";
import { useTag } from "../context/TagContext";
import eventsJson from "../data/events.json";
import exhibitsJson from "../data/exhibits.json";
import sponsorsJson from "../data/sponsors.json";
import stallsJson from "../data/stalls.json";
import type { Event, Exhibit, Sponsor, Stall } from "../types/common";

const events = eventsJson as Event[];
const exhibits = exhibitsJson as Exhibit[];
const sponsors = sponsorsJson as Sponsor[];
const stalls = stallsJson as Stall[];

import { pickRandom } from "../shared/utils/random";

// 画像パスをpublicルート基準に変換
const toPublicImagePath = (url: string) => url.replace(/^\.?\/?images\//, "./images/");

// Choose a random hero image from all content types
function getRandomAnyContentImage() {
  const images = [
    ...events.map((e) => e.imageUrl),
    ...exhibits.map((e) => e.imageUrl),
    ...stalls.map((s) => s.imageUrl),
    ...sponsors.map((s) => s.imageUrl),
  ]
    .filter(Boolean)
    .map(toPublicImagePath);
  return pickRandom(images) || "";
}

const Search = () => {
  const { performSearch, searchQuery, searchResults, setSearchQuery } = useSearch();
  const { selectedTags } = useTag();
  const { t } = useLanguage();
  const location = useLocation();
  const heroImage = useMemo(() => getRandomAnyContentImage(), []);

  // Check if there are active search results or selected tags
  const hasActiveSearch =
    searchQuery.trim().length > 0 || selectedTags.length > 0 || searchResults.length > 0;

  // Extract search query and tag from URL when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("q");

    if (queryParam && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
      performSearch(queryParam);
    }
  }, [location.search, searchQuery, setSearchQuery, performSearch]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16">
        {/* 透かし画像 */}
        <img
          src={heroImage}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-20"
          alt=""
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: "var(--instagram-gradient)" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Title and subtitle - only show when no active search */}
            {!hasActiveSearch && (
              <>
                <h1 className="mb-4 text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
                  {t("search.title")}
                </h1>
                <p className="mx-auto mb-8 max-w-2xl text-xl text-[var(--text-secondary)]">
                  {t("search.subtitle")}
                </p>
              </>
            )}

            {/* Search Bar - Full width and prominent */}
            <div className="mx-auto max-w-3xl">
              <SearchBar variant="large" autoFocus showSuggestions />
            </div>

            {/* Search Tips - Only show when no active search */}
            {!hasActiveSearch && (
              <div className="mx-auto mt-6 max-w-2xl">
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                  <h3 className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                    <span>💡</span>
                    {t("search.searchTips")}
                  </h3>
                  <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--primary-color)]">•</span>
                      <span>{t("search.searchInstructions.keyword")}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--primary-color)]">•</span>
                      <span>{t("search.searchInstructions.tags")}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--primary-color)]">•</span>
                      <span>{t("search.searchInstructions.location")}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tag Filter - Width matches search bar */}
            <div className="mx-auto mt-6 max-w-3xl">
              <TagFilter compact={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Search Results */}
            <div className="rounded-xl bg-[var(--bg-primary)]">
              <SearchResults />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Search;
