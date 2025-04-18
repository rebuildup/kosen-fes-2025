import React, { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from './SearchContext';
import { useLanguage } from '../../../hooks/useLanguage';
import SearchSuggestions from './SearchSuggestions';

interface SearchBarProps {
  fullWidth?: boolean;
  autoFocus?: boolean;
  showHistory?: boolean;
  onSearchSubmit?: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  fullWidth = false,
  autoFocus = false,
  showHistory = false,
  onSearchSubmit,
  className = ''
}) => {
  const { t } = useLanguage();
  const { searchState, setQuery, performSearch, searchHistory } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Local state
  const [inputValue, setInputValue] = useState(searchState.query);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Sync with search state
  useEffect(() => {
    setInputValue(searchState.query);
  }, [searchState.query]);
  
  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Update query in context
    setQuery(inputValue);
    
    // Perform search
    await performSearch({ query: inputValue });
    
    // Navigate to search results page if not already there
    if (location.pathname !== '/search') {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
    
    // Hide suggestions
    setShowSuggestions(false);
    
    // Call optional callback
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };
  
  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Close suggestions on escape
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
    if (showHistory && searchHistory.length > 0) {
      setShowSuggestions(true);
    }
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };
  
  return (
    <div className={`search-bar-container relative ${fullWidth ? 'w-full' : 'max-w-md'} ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={t('search.placeholder')}
            className={`w-full py-2 pl-10 pr-4 rounded-full 
                       border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-gray-800 
                       text-gray-800 dark:text-gray-200
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       transition-colors duration-200
                       ${isFocused ? 'shadow-md' : ''}`}
            aria-label={t('search.placeholder')}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                inputRef.current?.focus();
              }}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={t('search.clear')}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
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
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2
                     bg-primary-500 hover:bg-primary-600 text-white
                     rounded-full p-1 transition-colors duration-200"
            aria-label={t('common.search')}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </button>
        </div>
      </form>
      
      {/* Search Suggestions */}
      {showSuggestions && showHistory && searchHistory.length > 0 && (
        <SearchSuggestions
          suggestions={searchHistory}
          onSelect={handleSelectSuggestion}
          searchTerm={inputValue}
        />
      )}
    </div>
  );
};

export default SearchBar;