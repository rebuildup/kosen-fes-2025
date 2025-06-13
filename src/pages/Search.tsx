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
    <div>
      <h1>{t("search.title")}</h1>

      <div>
        <SearchBar variant="large" autoFocus showSuggestions />

        <div>
          <div>
            <div>
              <TagFilter onFilter={() => {}} />
            </div>

            <div>
              <h3>{t("search.recentSearches")}</h3>
              <ul>
                {recentSearches.map((query, index) => (
                  <li key={index}>
                    <button onClick={() => performSearch(query)}>
                      <span>🕒</span>
                      <span>{query}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <TagCloud title={t("tags.popularTags")} showCount maxTags={15} />
          </div>
        </div>

        <div>
          <SelectedTags />
          <SearchResults />
        </div>
      </div>
    </div>
  );
};

export default Search;
