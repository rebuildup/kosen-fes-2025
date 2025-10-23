import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../context/LanguageContext";
import { useSearch } from "../../context/SearchContext";
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
  const { performSearch, recentSearches, searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  // ボーダーハイライトアニメーションは削除（常に同じ色を維持）
  // サジェストアニメーションも削除し、角丸変化と同期させる

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    // setSearchQuery は検索実行時のみ（handleSubmit/handleSuggestionClick）で呼ぶ
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
      // 検索後にinputにフォーカスを戻す
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    setSearchQuery(suggestion);
    performSearch(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowDropdown(false);
    // サジェスト選択後にinputにフォーカスを戻す
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Esc でクリア（ドロップダウンが開いていない場合）
    if (e.key === "Escape" && !showDropdown) {
      handleClear();
      return;
    }

    if (!showDropdown) return;

    const suggestions = recentSearches;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
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
    // フォーカス時に履歴があれば即座に表示
    if (showSuggestions && recentSearches.length > 0) {
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

    // 検索ページにいる場合は、クエリパラメータをクリアして初期ページに戻る
    // ハッシュルーティングを使用しているため、window.location.hashをチェック
    if (globalThis.location.hash.includes("/search")) {
      // React RouterのnavigateでクリーンなURLに遷移
      navigate("/search", { replace: true });
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 入力欄の高さをバリアントで統一（角丸はサジェスト表示時に変化）
  const getShellClasses = () => {
    const baseRounded = showDropdown ? "rounded-t-3xl" : "rounded-full";
    const base = `group relative flex w-full items-center gap-3 ${baseRounded} border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 shadow-sm transition-all duration-200`;
    switch (variant) {
      case "large": {
        return `${base} h-12`;
      }
      case "inline": {
        return `${base} h-9`;
      }
      default: {
        return `${base} h-10`;
      }
    }
  };

  // 入力テキストのサイズをバリアントで設定
  const getInputTextSize = () => {
    switch (variant) {
      case "large": {
        return "text-base";
      }
      case "inline": {
        return "text-xs";
      }
      default: {
        return "text-sm";
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
      {/* 外枠: 角丸は常に維持 */}
      <div ref={containerRef} className={getShellClasses()}>
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-2"
          aria-label={t("actions.search")}
        >
          {/* Search Icon */}
          <SearchIcon size={getIconSize()} className="shrink-0 text-[var(--text-secondary)]" />

          {/* Input Field */}
          <input
            ref={inputRef}
            type="search"
            value={localQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder || t("search.placeholder")}
            className={`peer w-full border-0 bg-transparent py-0 leading-tight ${getInputTextSize()} text-sm placeholder-[var(--text-secondary)] outline-none`}
            autoComplete="off"
            aria-label={t("search.placeholder")}
            aria-haspopup="listbox"
          />

          {/* Clear Button - Show only when there's content */}
          {localQuery.trim() && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1.5 text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
              aria-label={t("actions.clear")}
              title={t("actions.clear")}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </form>
      </div>

      {/* Suggestions Dropdown - 検索欄を下に伸ばす形で表示 */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 left-0 z-50 -mt-px max-h-64 overflow-y-auto rounded-b-3xl border border-t-0 border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm"
        >
          <div className="py-2" role="listbox" aria-label={t("search.suggestions")}>
            {suggestions.map((suggestion, index) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 ${
                  highlightedIndex === index
                    ? "bg-[var(--bg-tertiary)] text-[var(--primary-color)]"
                    : "text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
                }`}
                role="option"
                aria-selected={highlightedIndex === index}
              >
                <SearchIcon size={16} className="text-[var(--text-secondary)]" />
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
