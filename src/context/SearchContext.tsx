/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import type { Item } from "../types/common";
import { dataManager } from "../data/dataManager";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Item[];
  performSearch: (query: string) => void;
  isSearching: boolean;
  clearSearch: () => void;
  searchHistory: string[];
  recentSearches: string[];
}

const defaultContext: SearchContextType = {
  searchQuery: "",
  setSearchQuery: () => {},
  searchResults: [],
  performSearch: () => {},
  isSearching: false,
  clearSearch: () => {},
  searchHistory: [],
  recentSearches: [],
};

const SearchContext = createContext<SearchContextType>(defaultContext);

export const useSearch = () => useContext(SearchContext);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();

  // Get recent searches (last 5 unique searches)
  const recentSearches = [...new Set(searchHistory)]
    .slice(0, 5)
    .filter(Boolean);

  // Save search history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Function to perform search using dataManager
  const performSearchQuery = useCallback((query: string): Item[] => {
    return dataManager.searchItems(query);
  }, []);

  // Function to perform search
  const performSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setSearchQuery("");
        return;
      }

      setIsSearching(true);
      setSearchQuery(query);

      // Add to search history (at the beginning)
      setSearchHistory((prev) => [query, ...prev.filter((q) => q !== query)]);

      // Use dataManager to search
      const results = performSearchQuery(query);

      setSearchResults(results);
      setIsSearching(false);

      // Navigate to search results page if not already there
      if (window.location.pathname !== "/search") {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    },
    [navigate, performSearchQuery]
  );

  // Function to clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        performSearch,
        isSearching,
        clearSearch,
        searchHistory,
        recentSearches,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
