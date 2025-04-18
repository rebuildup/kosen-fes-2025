import React, { useState } from 'react';
import { useSearch } from './SearchContext';
import { useLanguage } from '../../../hooks/useLanguage';
import TagList from '../../common/TagList';

interface SearchFiltersProps {
  className?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  className = ''
}) => {
  const { t } = useLanguage();
  const { searchState, setFilters, resetFilters } = useSearch();
  const { results, filters } = searchState;
  
  // Extract all available tags from results
  const allTags = Array.from(
    new Set(
      results
        .filter(item => item.tags && item.tags.length > 0)
        .flatMap(item => item.tags as string[])
    )
  ).sort();
  
  // Local state for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    types: true,
    tags: true,
    date: false
  });
  
  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle type filter changes
  const handleTypeChange = (type: string) => {
    const currentTypes = [...filters.types];
    const index = currentTypes.indexOf(type);
    
    if (index === -1) {
      // Add type
      currentTypes.push(type);
    } else {
      // Remove type
      currentTypes.splice(index, 1);
    }
    
    setFilters({ types: currentTypes });
  };
  
  // Handle tag filter changes
  const handleTagChange = (tag: string) => {
    const currentTags = [...filters.tags];
    const index = currentTags.indexOf(tag);
    
    if (index === -1) {
      // Add tag
      currentTags.push(tag);
    } else {
      // Remove tag
      currentTags.splice(index, 1);
    }
    
    setFilters({ tags: currentTags });
  };
  
  return (
    <div className={`search-filters ${className}`}>
      <div className="bg-background-card rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t('search.filters')}</h3>
          {(filters.types.length > 0 || filters.tags.length > 0 || filters.dateRange) && (
            <button
              onClick={resetFilters}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {t('search.clearFilters')}
            </button>
          )}
        </div>
        
        {/* Type filter */}
        <div className="mb-4">
          <button
            className="flex w-full items-center justify-between text-left mb-2"
            onClick={() => toggleSection('types')}
          >
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('search.filterByType')}
            </h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-500 transition-transform ${
                expandedSections.types ? 'transform rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          
          {expandedSections.types && (
            <div className="space-y-2 ml-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="filter-type-event"
                  checked={filters.types.includes('event')}
                  onChange={() => handleTypeChange('event')}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="filter-type-event" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t('header.events')}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="filter-type-exhibition"
                  checked={filters.types.includes('exhibition')}
                  onChange={() => handleTypeChange('exhibition')}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="filter-type-exhibition" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t('exhibitions.exhibitions')}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="filter-type-foodStall"
                  checked={filters.types.includes('foodStall')}
                  onChange={() => handleTypeChange('foodStall')}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="filter-type-foodStall" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t('exhibitions.foodStalls')}
                </label>
              </div>
            </div>
          )}
        </div>
        
        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="mb-4">
            <button
              className="flex w-full items-center justify-between text-left mb-2"
              onClick={() => toggleSection('tags')}
            >
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('search.filterByTag')}
              </h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedSections.tags ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {expandedSections.tags && (
              <div className="space-y-2 ml-2">
                <TagList
                  tags={allTags}
                  activeTags={filters.tags}
                  clickable
                  onTagClick={handleTagChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;