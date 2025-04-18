import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from './SearchContext';
import { useLanguage } from '../../../hooks/useLanguage';
import Card from '../../common/Card';
import CardList from '../../common/CardList';
import SearchFilters from './SearchFilters';
import Loader from '../../common/Loader';

interface SearchResultsProps {
  showFilters?: boolean;
  className?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  showFilters = true,
  className = ''
}) => {
  const { t } = useLanguage();
  const { searchState } = useSearch();
  const { query, filteredResults, isLoading, error, totalResults } = searchState;
  
  // Local state for view mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Get link path for each item based on its type
  const getLinkPath = (item: any) => {
    switch (item.type) {
      case 'event':
        return `/events/${item.id}`;
      case 'exhibition':
        return `/exhibitions/${item.id}`;
      case 'foodStall':
        return `/food-stalls/${item.id}`;
      default:
        return '#';
    }
  };
  
  if (isLoading) {
    return (
      <div className={`search-results-loading ${className} flex justify-center p-8`}>
        <Loader size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`search-results-error ${className} p-6`}>
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!query) {
    return (
      <div className={`search-results-empty ${className} p-6 text-center`}>
        <p className="text-gray-600 dark:text-gray-400">
          {t('search.enterQuery')}
        </p>
      </div>
    );
  }
  
  if (totalResults === 0) {
    return (
      <div className={`search-results-empty ${className} p-6 text-center`}>
        <p className="text-gray-600 dark:text-gray-400">
          {t('search.noResults', { query })}
        </p>
      </div>
    );
  }
  
  return (
    <div className={`search-results ${className}`}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            {t('search.results')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('search.foundResults', { count: filteredResults.length, total: totalResults })}
          </p>
        </div>
        
        {/* View mode toggle */}
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
            aria-label={t('search.gridView')}
            aria-pressed={viewMode === 'grid'}
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
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
            aria-label={t('search.listView')}
            aria-pressed={viewMode === 'list'}
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main content area with optional filters */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        {showFilters && (
          <div className="w-full md:w-64 md:flex-shrink-0">
            <SearchFilters />
          </div>
        )}
        
        {/* Results */}
        <div className="flex-grow">
          {viewMode === 'grid' ? (
            <CardList
              items={filteredResults}
              getLinkPath={getLinkPath}
              showBookmarkButton
              columnsConfig={{
                sm: 1,
                md: showFilters ? 1 : 2,
                lg: showFilters ? 2 : 3
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredResults.map(item => (
                <Link 
                  key={`${item.type}-${item.id}`}
                  to={getLinkPath(item)}
                  className="block"
                >
                  <div className="bg-background-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image (smaller in list view) */}
                      <div className="h-32 w-full sm:h-auto sm:w-32 md:w-40">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-col h-full">
                          <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                          
                          {/* Type badge */}
                          <div className="mb-2">
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full 
                                           ${item.type === 'event' 
                                             ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                             : item.type === 'exhibition'
                                               ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                               : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            }`}>
                              {item.type === 'event' 
                                ? t('header.events') 
                                : item.type === 'exhibition' 
                                  ? t('exhibitions.exhibitions') 
                                  : t('exhibitions.foodStalls')}
                            </span>
                          </div>
                          
                          {item.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          
                          <div className="mt-auto flex flex-wrap gap-1">
                            {item.date && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mr-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {item.date}
                              </div>
                            )}
                            
                            {item.location && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                {item.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;