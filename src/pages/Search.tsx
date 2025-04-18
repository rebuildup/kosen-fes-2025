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
  const { searchQuery, setSearchQuery, performSearch } = useSearch();
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
  }, [location.search]);

  return (
    <div className="search-page">
      <h2>{t("search.results")}</h2>

      <div className="search-container">
        <SearchBar variant="large" />
      </div>

      <div className="search-content">
        <div className="search-layout">
          <div className="search-sidebar">
            <TagFilter />
            <TagCloud title={t("tags.popularTags")} showCount maxTags={15} />
          </div>

          <div className="search-main">
            <SelectedTags />

            {searchQuery || selectedTags.length > 0 ? (
              <SearchResults />
            ) : (
              <div className="search-prompt">{t("search.enterQuery")}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
