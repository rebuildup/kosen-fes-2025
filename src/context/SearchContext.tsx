import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { Event, Exhibit, Stall, Item } from "../types/common";

// Import mock data
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";

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

  // Function to filter items by search query
  const filterItemsByQuery = (items: Item[], query: string): Item[] => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase().trim();

    return items.filter((item) => {
      // Search in title, description, and tags
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
        item.location.toLowerCase().includes(normalizedQuery)
      );
    });
  };

  // Function to perform search
  const performSearch = (query: string) => {
    if (!query.trim()) {
      clearSearch();
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);

    // Add to search history (at the beginning)
    setSearchHistory((prev) => [query, ...prev.filter((q) => q !== query)]);

    // Combine all items and filter them
    const allItems: Item[] = [
      ...(events as Event[]),
      ...(exhibits as Exhibit[]),
      ...(stalls as Stall[]),
    ];

    const results = filterItemsByQuery(allItems, query);

    setSearchResults(results);
    setIsSearching(false);

    // Navigate to search results page if not already there
    if (window.location.pathname !== "/search") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

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
