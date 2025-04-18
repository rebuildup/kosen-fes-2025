import { useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { useLanguage } from "../../context/LanguageContext";

interface SearchBarProps {
  variant?: "default" | "large" | "inline";
  onSearch?: () => void;
}

const SearchBar = ({ variant = "default", onSearch }: SearchBarProps) => {
  const { searchQuery, setSearchQuery, performSearch } = useSearch();
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(inputValue);
    if (onSearch) onSearch();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
  };

  // Classes based on variant
  const containerClass = `search-bar ${
    variant === "large" ? "search-bar-large" : ""
  } ${variant === "inline" ? "search-bar-inline" : ""}`;

  return (
    <form className={containerClass} onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={t("search.placeholder")}
          aria-label={t("search.placeholder")}
          className="search-input"
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
  );
};

export default SearchBar;
