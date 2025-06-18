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
              <span className="text-4xl mr-3">🔍</span>
              {t("search.title")}
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
              イベント、展示、露店を検索して見つけよう
            </p>

            {/* Search Bar - Full width and prominent */}
            <div className="max-w-3xl mx-auto">
              <SearchBar variant="large" autoFocus showSuggestions />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Quick Access Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center gap-2">
                    <span>🕒</span>
                    最近の検索
                  </h3>
                  <div className="space-y-2">
                    {recentSearches.slice(0, 5).map((query, index) => (
                      <button
                        key={index}
                        onClick={() => performSearch(query)}
                        className="flex items-center gap-3 p-3 rounded-lg w-full text-left transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-color)] text-[var(--text-secondary)]"
                      >
                        <span>🔍</span>
                        <span className="flex-1">{query}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats or Tips */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] flex items-center gap-2">
                  <span>💡</span>
                  検索のヒント
                </h3>
                <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                  <div className="flex items-start gap-2">
                    <span className="text-[var(--primary-color)]">•</span>
                    <span>キーワードで検索してイベントや展示を見つけよう</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[var(--primary-color)]">•</span>
                    <span>タグを使って興味のあるカテゴリーを絞り込み</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[var(--primary-color)]">•</span>
                    <span>場所や時間でも検索できます</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Tags Section - Full width */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
              <TagCloud
                title={t("search.popularTags")}
                showCount
                maxTags={20}
              />
            </div>

            {/* Tag Filter Section */}
            <div className="space-y-4">
              <TagFilter onFilter={() => {}} compact={true} />
              <SelectedTags />
            </div>

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
