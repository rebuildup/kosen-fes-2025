import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchResult, SearchFilters } from '../../../types/common';
import { searchItems, SearchOptions } from '../../../services/searchService';

interface SearchContextType {
  searchState: {
    query: string;
    results: SearchResult[];
    filteredResults: SearchResult[];
    isLoading: boolean;
    error: string | null;
    totalResults: number;
    filters: SearchFilters;
  };
  setQuery: (query: string) => void;
  performSearch: (options?: SearchOptions) => Promise<void>;
  clearSearch: () => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  searchHistory: string[];
}

// Default filters
const defaultFilters: SearchFilters = {
  types: [],
  tags: [],
  dateRange: null
};

// Create context with default values
const SearchContext = createContext<SearchContextType>({
  searchState: {
    query: '',
    results: [],
    filteredResults: [],
    isLoading: false,
    error: null,
    totalResults: 0,
    filters: defaultFilters
  },
  setQuery: () => {},
  performSearch: async () => {},
  clearSearch: () => {},
  setFilters: () => {},
  resetFilters: () => {},
  searchHistory: []
});

// Custom hook for using search
export const useSearch = () => useContext(SearchContext);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const location = useLocation();
  
  // Initial state
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<SearchFilters>(defaultFilters);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  
  // Parse query from URL on location change
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('q');
    
    if (queryParam && queryParam !== query) {
      setQueryState(queryParam);
      
      // Perform search if on search page
      if (location.pathname === '/search') {
        performSearch({ query: queryParam });
      }
    }
  }, [location]);
  
  // Update filtered results when filters or results change
  useEffect(() => {
    if (results.length === 0) {
      setFilteredResults([]);
      return;
    }
    
    let filtered = [...results];
    
    // Filter by type
    if (filters.types.length > 0) {
      filtered = filtered.filter(item => filters.types.includes(item.type));
    }
    
    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(item => 
        item.tags && item.tags.some(tag => filters.tags.includes(tag))
      );
    }
    
    // Filter by date range
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      
      filtered = filtered.filter(item => {
        if (!item.date) return false;
        
        const itemDate = new Date(item.date.split(' ')[0]);
        
        if (start && itemDate < new Date(start)) return false;
        if (end && itemDate > new Date(end)) return false;
        
        return true;
      });
    }
    
    setFilteredResults(filtered);
  }, [filters, results]);
  
  // Update search query
  const setQuery = (newQuery: string) => {
    setQueryState(newQuery);
  };
  
  // Perform search
  const performSearch = useCallback(async (options?: SearchOptions) => {
    const searchQuery = options?.query || query;
    
    // Skip if query is empty
    if (!searchQuery.trim()) {
      setResults([]);
      setFilteredResults([]);
      setError(null);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call search service
      const searchResults = await searchItems(searchQuery, options);
      
      setResults(searchResults);
      
      // Add to search history if this is a new search
      if (!searchHistory.includes(searchQuery)) {
        const updatedHistory = [searchQuery, ...searchHistory.slice(0, 9)];
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      }
    } catch (error) {
      setResults([]);
      setFilteredResults([]);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [query, searchHistory]);
  
  // Clear search
  const clearSearch = () => {
    setQueryState('');
    setResults([]);
    setFilteredResults([]);
    setError(null);
    setFiltersState(defaultFilters);
  };
  
  // Set filters
  const setFilters = (newFilters: Partial<SearchFilters>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFiltersState(defaultFilters);
  };
  
  // Context value
  const value = {
    searchState: {
      query,
      results,
      filteredResults,
      isLoading,
      error,
      totalResults: results.length,
      filters
    },
    setQuery,
    performSearch,
    clearSearch,
    setFilters,
    resetFilters,
    searchHistory
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;