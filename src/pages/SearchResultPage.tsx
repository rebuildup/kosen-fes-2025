import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../components/features/search/SearchContext';
import { useLanguage } from '../hooks/useLanguage';
import SearchBar from '../components/features/search/SearchBar';
import SearchResults from '../components/features/search/SearchResults';

const SearchResultsPage: React.FC = () => {
  const { t } = useLanguage();
  const { searchState, setQuery, performSearch } = useSearch();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  // Update search query and perform search when query parameter changes
  useEffect(() => {
    if (queryParam && queryParam !== searchState.query) {
      setQuery(queryParam);
      performSearch({ query: queryParam });
    }
  }, [queryParam, searchState.query, setQuery, performSearch]);
  
  return (
    <div className="search-results-page py-6 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">{t('search.title')}</h1>
          
          {/* Search bar */}
          <SearchBar fullWidth autoFocus showHistory />
        </div>
        
        {/* Search results */}
        <SearchResults showFilters />
      </div>
    </div>
  );
};

export default SearchResultsPage;