import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { useLanguage } from "../../context/LanguageContext";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../utils/animations";
import { SearchIcon } from "../icons/SearchIcon";

interface SearchBarProps {
  variant?: "default" | "large" | "inline";
  placeholder?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  className?: string;
}

const SearchBar = ({
  variant = "default",
  placeholder,
  autoFocus = false,
  showSuggestions = false,
  className = "",
}: SearchBarProps) => {
  const { t } = useLanguage();
  const { searchQuery, setSearchQuery, performSearch, recentSearches } =
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
  }, [showDropdown]);

  // Animate suggestions appearance
  useEffect(() => {
    if (!suggestionsRef.current) return;

    if (showDropdown) {
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
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
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

  const suggestions = showSuggestions ? recentSearches : [];

  // Classes based on variant using TailwindCSS
  const containerClass = `bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg transition-all duration-200 ${
    variant === "large" ? "p-4" : variant === "inline" ? "p-2" : "p-3"
  } ${
    showDropdown ? "border-primary-500 shadow-md" : "shadow-sm hover:shadow-md"
  }`;

  const getInputClasses = () => {
    const baseClasses = `
      w-full pl-12 pr-4 rounded-lg border transition-all duration-200
      focus:outline-none focus:ring-2 backdrop-blur-md bg-white/10 border-white/20
    `;

    switch (variant) {
      case "large":
        return `${baseClasses} py-4 text-lg focus:ring-4`;
      default:
        return `${baseClasses} py-3 text-base`;
    }
  };

  const getIconSize = () => {
    return variant === "large" ? 24 : 20;
  };

  return (
    <div className={`relative ${className}`}>
      <form
        className={containerClass}
        onSubmit={handleSubmit}
        ref={containerRef}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={getIconSize()} className="text-white/70" />
          </div>
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
            style={{
              color: "var(--color-text-primary)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.borderColor = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.currentTarget) {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }
            }}
            onFocusCapture={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.borderColor = "var(--color-accent)";
              e.currentTarget.style.boxShadow = `0 0 0 3px color-mix(in srgb, var(--color-accent) 25%, transparent)`;
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-border-primary)",
          }}
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion}-${index}`}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg ${
                index === highlightedIndex ? "bg-white/20" : "hover:bg-white/10"
              }`}
              style={{
                color: "var(--color-text-primary)",
              }}
            >
              <SearchIcon size={16} className="opacity-60" />
              <span>{suggestion}</span>
              {recentSearches.includes(suggestion) && (
                <span
                  className="ml-auto text-xs opacity-60"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {t("search.recent")}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
