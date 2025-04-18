import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { Event, Exhibit, Stall, Item } from "../types/common";

// Import mock data (we'll replace this with real data later)
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
}

const defaultContext: SearchContextType = {
  searchQuery: "",
  setSearchQuery: () => {},
  searchResults: [],
  performSearch: () => {},
  isSearching: false,
  clearSearch: () => {},
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
  const navigate = useNavigate();

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
      navigate("/search");
    }
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Automatically perform search when query changes
  useEffect(() => {
    // Debounce search to avoid too many searches while typing
    const timer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        performSearch,
        isSearching,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
