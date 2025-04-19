import { useState, useRef, useEffect } from "react";
import { useSearch } from "../../context/SearchContext";
import { useLanguage } from "../../context/LanguageContext";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../utils/animations";

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
  const containerRef = useRef<HTMLFormElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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

  // Animate container on focus/blur
  useEffect(() => {
    if (!containerRef.current) return;

    if (isFocused) {
      // Focus animation
      gsap.to(containerRef.current, {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderColor: "var(--primary-light)",
        duration: DURATION.FAST,
        ease: EASE.SMOOTH,
      });
    } else {
      // Blur animation
      gsap.to(containerRef.current, {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        borderColor: "var(--border-light)",
        duration: DURATION.FAST,
        ease: EASE.SMOOTH,
      });
    }
  }, [isFocused]);

  // Animate suggestions appearance
  useEffect(() => {
    if (!suggestionsRef.current) return;

    if (showSuggestionsList) {
      // Show suggestions animation
      gsap.fromTo(
        suggestionsRef.current,
        {
          y: -10,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        }
      );
    } else {
      // Hide suggestions animation
      gsap.to(suggestionsRef.current, {
        y: -10,
        autoAlpha: 0,
        duration: DURATION.FAST,
        ease: EASE.SMOOTH,
      });
    }
  }, [showSuggestionsList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Search button animation
      const searchButton = (e.currentTarget as HTMLFormElement).querySelector(
        ".search-button"
      );
      if (searchButton) {
        gsap.fromTo(
          searchButton,
          { scale: 0.9 },
          {
            scale: 1,
            duration: DURATION.FAST,
            ease: "back.out(3)",
          }
        );
      }

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
    // Clear button animation
    const clearButton = document.querySelector(".search-clear-button");
    if (clearButton) {
      gsap.fromTo(
        clearButton,
        { rotation: 0 },
        {
          rotation: 90,
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
          onComplete: () => {
            setInputValue("");
            setSearchQuery("");
            setShowSuggestionsList(false);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          },
        }
      );
    } else {
      setInputValue("");
      setSearchQuery("");
      setShowSuggestionsList(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
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

  const handleSuggestionClick = (
    suggestion: string,
    e: React.MouseEvent<HTMLLIElement>
  ) => {
    // Animation for suggestion selection
    gsap.to(`.search-suggestion-item`, {
      backgroundColor: "var(--bg-tertiary)",
      duration: DURATION.FAST,
      ease: EASE.SMOOTH,
    });

    gsap.to(e.currentTarget, {
      backgroundColor: "var(--primary-light)",
      color: "white",
      duration: DURATION.FAST,
      ease: EASE.SMOOTH,
      onComplete: () => {
        setInputValue(suggestion);
        performSearch(suggestion);
        if (onSearch) onSearch();
        setShowSuggestionsList(false);
      },
    });
  };

  // Classes based on variant
  const containerClass = `search-bar ${
    variant === "large" ? "search-bar-large" : ""
  } ${variant === "inline" ? "search-bar-inline" : ""}`;

  return (
    <div className="search-bar-container">
      <form
        className={containerClass}
        onSubmit={handleSubmit}
        ref={containerRef}
      >
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
        <div className="search-suggestions" ref={suggestionsRef}>
          <div className="search-suggestions-header">
            {t("search.recentSearches")}
          </div>
          <ul className="search-suggestions-list">
            {recentSearches.map((suggestion, index) => (
              <li
                key={index}
                className="search-suggestion-item"
                onClick={(e) => handleSuggestionClick(suggestion, e)}
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
