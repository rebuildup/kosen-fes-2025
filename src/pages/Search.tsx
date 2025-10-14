import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { useTag } from "../context/TagContext";
import { useLanguage } from "../context/LanguageContext";
import SearchBar from "../components/common/SearchBar";
import SearchResults from "../components/search/SearchResults";
import TagFilter from "../components/common/TagFilter";
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";
import { sponsors } from "../data/sponsors";

// 画像パスをpublicルート基準に変換
const toPublicImagePath = (url: string) =>
  url.replace(/^\.?\/?images\//, "./images/");

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
  return images[Math.floor(Math.random() * images.length)] || "";
}

const Search = () => {
  const { searchQuery, setSearchQuery, performSearch, searchResults } =
    useSearch();
  const { selectedTags } = useTag();
  const { t } = useLanguage();
  const location = useLocation();
  const heroImage = useMemo(() => getRandomAnyContentImage(), []);

  // Check if there are active search results or selected tags
  const hasActiveSearch =
    searchQuery.trim().length > 0 ||
    selectedTags.length > 0 ||
    searchResults.length > 0;

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
          className="absolute inset-0 w-full h-full object-cover opacity-20 z-0 pointer-events-none"
          alt=""
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: "var(--instagram-gradient)" }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Title and subtitle - only show when no active search */}
            {!hasActiveSearch && (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                  {t("search.title")}
                </h1>
                <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
                  {t("search.subtitle")}
                </p>
              </>
            )}

            {/* Search Bar - Full width and prominent */}
            <div className="max-w-3xl mx-auto">
              <SearchBar variant="large" autoFocus showSuggestions />
            </div>

            {/* Search Tips - Only show when no active search */}
            {!hasActiveSearch && (
              <div className="max-w-2xl mx-auto mt-6">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
                  <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)] flex items-center justify-center gap-2">
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
            <div className="max-w-3xl mx-auto mt-6">
              <TagFilter compact={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Search Results */}
            <div className="bg-[var(--bg-primary)] rounded-xl">
              <SearchResults />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Search;
