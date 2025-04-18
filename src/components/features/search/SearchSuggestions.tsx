import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

interface SearchSuggestionsProps {
  suggestions: string[];
  searchTerm: string;
  onSelect: (suggestion: string) => void;
  className?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  searchTerm,
  onSelect,
  className = ''
}) => {
  const { t } = useLanguage();
  
  // Filter suggestions based on search term
  const filteredSuggestions = searchTerm
    ? suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : suggestions;
  
  // If no suggestions, don't render
  if (filteredSuggestions.length === 0) {
    return null;
  }
  
  return (
    <div 
      className={`search-suggestions absolute z-20 mt-1 w-full rounded-md 
                bg-white dark:bg-gray-800 shadow-lg py-1 text-sm
                border border-gray-200 dark:border-gray-700 
                ${className}`}
    >
      {filteredSuggestions.length > 0 && (
        <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          {t('search.recentSearches')}
        </div>
      )}
      
      <ul>
        {filteredSuggestions.map((suggestion, index) => (
          <li key={index}>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={() => onSelect(suggestion)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span className="truncate">{suggestion}</span>
            </button>
          </li>
        ))}
      </ul>
      
      {filteredSuggestions.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2">
          <button
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
            onClick={() => {
              // Clear recent searches from local storage
              localStorage.removeItem('searchHistory');
              // Force reload the page to reflect changes
              window.location.reload();
            }}
          >
            {t('search.clearHistory')}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;