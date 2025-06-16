import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import SearchBar from "../components/common/SearchBar";
import SearchResults from "../components/search/SearchResults";
import TagFilter from "../components/common/TagFilter";
import SelectedTags from "../components/common/SelectedTags";
import TagCloud from "../components/common/TagCloud";

const Search = () => {
  const { searchQuery, setSearchQuery, performSearch, recentSearches } =
    useSearch();
  const { t } = useLanguage();
  const { selectTag } = useTag();
  const location = useLocation();

  // Extract search query and tag from URL when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("q");
    const tagParam = params.get("tag");

    if (queryParam && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
      performSearch(queryParam);
    }

    if (tagParam) {
      selectTag(tagParam);
    }
  }, [location.search, searchQuery, setSearchQuery, performSearch, selectTag]);

  return (
    <div className="min-h-screen">
      <section
        className="section py-8"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl font-bold mb-8"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("search.title")}
          </h1>

          <div className="space-y-8">
            {/* Search Bar with theme colors */}
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-6">
              <SearchBar variant="large" autoFocus showSuggestions />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-6">
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t("search.recentSearches")}
                  </h3>
                  <div className="space-y-2">
                    {recentSearches.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => performSearch(query)}
                        className="flex items-center gap-2 p-3 rounded-lg w-full text-left transition-all duration-200 hover:scale-105 backdrop-blur-sm bg-white/5 border border-white/10"
                        style={{
                          color: "var(--color-text-secondary)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--color-bg-hover)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255,255,255,0.05)";
                        }}
                      >
                        <span>🕒</span>
                        <span>{query}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Tags */}
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-6">
                <TagCloud
                  title={t("tags.popularTags")}
                  showCount
                  maxTags={15}
                />
              </div>

              {/* Tag Filter */}
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-6 lg:col-span-2">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("tags.filterByTags")}
                </h3>
                <TagFilter onFilter={() => {}} />
              </div>
            </div>

            {/* Selected Tags and Results */}
            <div className="space-y-6">
              <SelectedTags />
              <SearchResults />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Search;
