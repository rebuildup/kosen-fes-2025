import { useState, useRef, useEffect } from "react";
import { useSearch } from "../../context/SearchContext";
import { useLanguage } from "../../context/LanguageContext";

interface SearchBarProps {
  variant?: "default" | "large" | "inline";
  onSearch?: () => void;
  autoFocus?: boolean;
  showSuggestions?: boolean;
}

const SearchBar = ({
  variant = "default",
  onSearch,
  autoFocus = false,
  showSuggestions = false,
}: SearchBarProps) => {
  const { searchQuery, setSearchQuery, performSearch, recentSearches } =
    useSearch();
  const { t } = useLanguage();

  const [inputValue, setInputValue] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input if needed
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Update input value when searchQuery changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      performSearch(inputValue);
      if (onSearch) onSearch();
      setShowSuggestionsList(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Show suggestions if we have recent searches and showSuggestions is enabled
    if (showSuggestions && recentSearches.length > 0) {
      setShowSuggestionsList(true);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
    setShowSuggestionsList(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (
      showSuggestions &&
      recentSearches.length > 0 &&
      inputValue.trim() === ""
    ) {
      setShowSuggestionsList(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Use a timeout to allow clicking on suggestions
    setTimeout(() => {
      setShowSuggestionsList(false);
    }, 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    performSearch(suggestion);
    if (onSearch) onSearch();
    setShowSuggestionsList(false);
  };

  // Classes based on variant
  const containerClass = `search-bar ${
    variant === "large" ? "search-bar-large" : ""
  } ${variant === "inline" ? "search-bar-inline" : ""}`;

  return (
    <div className="search-bar-container">
      <form className={containerClass} onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={t("search.placeholder")}
            aria-label={t("search.placeholder")}
            className={`search-input ${isFocused ? "focused" : ""}`}
            ref={inputRef}
          />

          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="search-clear-button"
              aria-label={t("actions.clear")}
            >
              ✕
            </button>
          )}

          <button
            type="submit"
            className="search-button"
            aria-label={t("actions.search")}
          >
            🔍
          </button>
        </div>
      </form>

      {showSuggestions && showSuggestionsList && recentSearches.length > 0 && (
        <div className="search-suggestions">
          <div className="search-suggestions-header">
            {t("search.recentSearches")}
          </div>
          <ul className="search-suggestions-list">
            {recentSearches.map((suggestion, index) => (
              <li
                key={index}
                className="search-suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="search-suggestion-icon">🕒</span>
                <span className="search-suggestion-text">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
