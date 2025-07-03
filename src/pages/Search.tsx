import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { useLanguage } from "../context/LanguageContext";
import { useTag } from "../context/TagContext";
import SearchBar from "../components/common/SearchBar";
import SearchResults from "../components/search/SearchResults";
import TagFilter from "../components/common/TagFilter";

const Search = () => {
  const { searchQuery, setSearchQuery, performSearch } = useSearch();
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
  }, [location.search]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: "var(--instagram-gradient)" }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              {t("search.title")}
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
              {t("search.subtitle")}
            </p>

            {/* Search Bar - Full width and prominent */}
            <div className="max-w-3xl mx-auto">
              <SearchBar variant="large" autoFocus showSuggestions />
            </div>

            {/* Search Tips - Below search bar */}
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
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Tag Search Section - タグで検索機能に変更 */}
            <TagFilter onFilter={() => {}} compact={false} />

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
