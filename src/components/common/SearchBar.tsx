import { gsap } from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../context/LanguageContext";
import { useSearch } from "../../context/SearchContext";
import { DURATION, EASE } from "../../utils/animations";
import { SearchIcon } from "../icons";

interface SearchBarProps {
  variant?: "default" | "large" | "inline";
  placeholder?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  className?: string;
}

const SearchBar = ({
  autoFocus = false,
  className = "",
  placeholder,
  showSuggestions = false,
  variant = "default",
}: SearchBarProps) => {
  const { t } = useLanguage();
  const { performSearch, recentSearches, searchQuery, setSearchQuery } =
    useSearch();
  const navigate = useNavigate();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLFormElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto focus input if needed
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Update input value when searchQuery changes
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Animate container on focus/blur
  useEffect(() => {
    if (!containerRef.current) return;

    if (showDropdown) {
      // Focus animation
      gsap.to(containerRef.current, {
        borderColor: "var(--primary-color)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        duration: DURATION.FAST,
        ease: EASE.SMOOTH,
      });
    } else {
      // Blur animation
      gsap.to(containerRef.current, {
        borderColor: "var(--border-color)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        duration: DURATION.FAST,
        ease: EASE.SMOOTH,
      });
    }
  }, [showDropdown]);

  // Animate suggestions appearance
  useEffect(() => {
    if (!suggestionsRef.current) return;

    if (showDropdown) {
      // Show suggestions animation
      gsap.fromTo(
        suggestionsRef.current,
        {
          autoAlpha: 0,
          y: -10,
        },
        {
          autoAlpha: 1,
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
          y: 0,
        },
      );
    } else {
      // Hide suggestions animation
      gsap.to(suggestionsRef.current, {
        autoAlpha: 0,
        duration: DURATION.FAST,
        ease: EASE.SMOOTH,
        y: -10,
      });
    }
  }, [showDropdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    setSearchQuery(value);
    setHighlightedIndex(-1);

    if (showSuggestions && value.trim()) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      performSearch(localQuery.trim());
      navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    setSearchQuery(suggestion);
    performSearch(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    const suggestions = recentSearches;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      }
      case "Escape": {
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
      }
    }
  };

  const handleFocus = () => {
    if (showSuggestions && localQuery.trim()) {
      setShowDropdown(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding dropdown to allow for suggestion clicks
    setTimeout(() => {
      if (
        !dropdownRef.current?.contains(e.relatedTarget as Node) &&
        e.relatedTarget !== inputRef.current
      ) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    }, 150);
  };

  // Handle clear/reset input
  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getInputClasses = () => {
    const baseClasses = `
      w-full pl-12 border transition-all duration-200 focus:outline-none focus:ring-2
      bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]
      placeholder-[var(--text-secondary)] focus:border-[var(--primary-color)] 
      focus:ring-[var(--primary-color)]/20
    `;

    // Adjust right padding based on whether we have content (for clear button) and search button
    // Increased padding to prevent overlap: pr-32 when clear button is present, pr-20 otherwise
    const rightPadding = localQuery.trim() ? "pr-32" : "pr-20";

    switch (variant) {
      case "large": {
        return `${baseClasses} ${rightPadding} py-4 text-lg rounded-full focus:ring-4`;
      }
      case "inline": {
        return `${baseClasses} ${rightPadding} py-2 text-sm rounded-full`;
      }
      default: {
        return `${baseClasses} ${rightPadding} py-3 text-base rounded-full`;
      }
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case "large": {
        return 24;
      }
      case "inline": {
        return 16;
      }
      default: {
        return 20;
      }
    }
  };

  const suggestions = showSuggestions ? recentSearches : [];

  return (
    <div className={`relative w-full ${className}`}>
      <form
        ref={containerRef}
        onSubmit={handleSubmit}
        className="relative w-full"
      >
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute top-1/2 left-4 z-10 -translate-y-1/2 transform">
            <SearchIcon
              size={getIconSize()}
              className="text-[var(--text-secondary)]"
            />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder || t("search.placeholder")}
            className={getInputClasses()}
            autoComplete="off"
            role="searchbox"
            aria-label={t("search.placeholder")}
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
          />

          {/* Clear Button - Show only when there's content */}
          {localQuery.trim() && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1/2 right-20 -translate-y-1/2 transform rounded-full p-1 text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
              aria-label={t("actions.clear")}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full bg-[var(--primary-color)] px-4 py-2 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-[var(--primary-color)]/90 hover:shadow-lg focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:outline-none active:scale-95"
            aria-label={t("actions.search")}
          >
            {variant === "large" ? t("actions.search") : t("actions.search")}
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 left-0 z-50 mt-2 max-h-64 overflow-y-auto rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-lg"
        >
          <div
            ref={suggestionsRef}
            className="py-2"
            role="listbox"
            aria-label={t("search.suggestions")}
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                  highlightedIndex === index
                    ? "bg-[var(--bg-tertiary)] text-[var(--primary-color)]"
                    : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                }`}
                role="option"
                aria-selected={highlightedIndex === index}
              >
                <SearchIcon
                  size={16}
                  className="text-[var(--text-secondary)]"
                />
                <span className="flex-1">{suggestion}</span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {t("search.recentSearches")}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
