import { useState, useRef, useEffect } from "react";
import { useSearch } from "../../context/SearchContext";
import { useLanguage } from "../../context/LanguageContext";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../utils/animations";
import { SearchIcon } from "../icons/SearchIcon";

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

  // Classes based on variant using TailwindCSS
  const containerClass = `bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg transition-all duration-200 ${
    variant === "large" ? "p-4" : variant === "inline" ? "p-2" : "p-3"
  } ${isFocused ? "border-primary-500 shadow-md" : "shadow-sm hover:shadow-md"}`;

  return (
    <div className="relative">
      <form
        className={containerClass}
        onSubmit={handleSubmit}
        ref={containerRef}
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={t("search.placeholder")}
            aria-label={t("search.placeholder")}
            className={`w-full px-4 py-2 pr-20 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
              variant === "large" ? "text-lg" : "text-base"
            }`}
            ref={inputRef}
          />

          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="search-clear-button absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
              aria-label={t("actions.clear")}
            >
              ✕
            </button>
          )}

          <button
            type="submit"
            className="search-button absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200"
            aria-label={t("actions.search")}
          >
            <SearchIcon size={20} />
          </button>
        </div>
      </form>

      {showSuggestions && showSuggestionsList && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50" ref={suggestionsRef}>
          <div className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            {t("search.recentSearches")}
          </div>
          <ul className="py-1">
            {recentSearches.map((suggestion, index) => (
              <li
                key={index}
                className="search-suggestion-item px-3 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-150"
                onClick={(e) => handleSuggestionClick(suggestion, e)}
              >
                <span className="text-slate-400 dark:text-slate-500">🕒</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
