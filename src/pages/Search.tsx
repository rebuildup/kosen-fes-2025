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
  const { selectedTags } = useTag();
  const location = useLocation();

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
    <div className="search-page">
      <h1 className="search-title">{t("search.title")}</h1>

      <div className="search-container">
        <SearchBar variant="large" autoFocus showSuggestions />
      </div>

      <div className="search-content">
        <div className="search-layout">
          <div className="search-sidebar">
            <TagFilter onFilter={() => {}} />

            {recentSearches.length > 0 &&
              !searchQuery &&
              selectedTags.length === 0 && (
                <div className="recent-searches">
                  <h3 className="search-sidebar-title">
                    {t("search.recentSearches")}
                  </h3>
                  <ul className="recent-searches-list">
                    {recentSearches.map((query, index) => (
                      <li key={index} className="recent-search-item">
                        <button
                          className="recent-search-button"
                          onClick={() => performSearch(query)}
                        >
                          <span className="recent-search-icon">🕒</span>
                          <span className="recent-search-text">{query}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <TagCloud title={t("tags.popularTags")} showCount maxTags={15} />
          </div>

          <div className="search-main">
            <SelectedTags />
            <SearchResults />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
