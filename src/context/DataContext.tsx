/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import dataManager from "../data/dataManager";
import type { ItemCore, ItemDetails, MapData } from "../types/data";

interface DataContextType {
  // Core data (always available)
  events: ItemCore[];
  exhibits: ItemCore[];
  stalls: ItemCore[];
  sponsors: ItemCore[];
  allItems: ItemCore[];

  // Search and filter
  searchItems: (query: string) => ItemCore[];
  filterByTags: (tags: string[]) => ItemCore[];

  // Detailed data (loaded on-demand)
  getItemDetails: (id: string, type: string) => Promise<ItemDetails | null>;
  detailsLoading: Record<string, boolean>;

  // Map data
  mapData: MapData | null;

  // Bookmarks
  bookmarks: string[];
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  getBookmarkedItems: () => ItemCore[];

  // Search history
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;

  // Preferences
  preferences: {
    language: string;
    theme: "light" | "dark";
  };
  updatePreferences: (prefs: Partial<{ language: string; theme: "light" | "dark" }>) => void;

  // Tags
  getAllTags: () => string[];
  getPopularTags: (limit?: number) => string[];
  getTagCounts: () => Record<string, number>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

function isBookmarkedInternal(id: string): boolean {
  return dataManager.isBookmarked(id);
}

export const DataProvider = ({ children }: DataProviderProps) => {
  // Core data
  const [events] = useState<ItemCore[]>(() => dataManager.getCoreEvents());
  const [exhibits] = useState<ItemCore[]>(() => dataManager.getCoreExhibits());
  const [stalls] = useState<ItemCore[]>(() => dataManager.getCoreStalls());
  const [sponsors] = useState<ItemCore[]>(() => dataManager.getCoreSponsors());
  const [allItems] = useState<ItemCore[]>(() => dataManager.getAllCoreItems());

  // Map data
  const [mapData] = useState<MapData | null>(() => dataManager.getMapData());

  // User data
  const [bookmarks, setBookmarks] = useState<string[]>(() => dataManager.getBookmarks());
  const [searchHistory, setSearchHistory] = useState<string[]>(() =>
    dataManager.getSearchHistory(),
  );
  const [preferences, setPreferences] = useState(() => dataManager.getPreferences());

  // Loading states for details
  const [detailsLoading, setDetailsLoading] = useState<Record<string, boolean>>({});

  // Tags computation
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const [popularTags, setPopularTags] = useState<string[]>([]);

  // Initialize tags
  useEffect(() => {
    let tags: string[] = [];
    const counts: Record<string, number> = {};

    for (const item of allItems) {
      if (item.tags && Array.isArray(item.tags)) {
        for (const tag of item.tags) {
          if (!counts[tag]) {
            counts[tag] = 0;
            tags.push(tag);
          }
          counts[tag]++;
        }
      }
    }

    tags = [...tags].sort();
    const popular = [...tags].sort((a: string, b: string) => counts[b] - counts[a]).slice(0, 10);

    setAllTags(tags);
    setTagCounts(counts);
    setPopularTags(popular);
  }, [allItems]);

  // Search function
  const searchItems = (query: string): ItemCore[] => {
    return dataManager.searchItems(query);
  };

  // Filter by tags function
  const filterByTags = (tags: string[]): ItemCore[] => {
    return dataManager.filterByTags(tags);
  };

  // Get item details
  const getItemDetails = async (id: string, type: string): Promise<ItemDetails | null> => {
    const loadingKey = `${type}-${id}`;
    setDetailsLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      let details: ItemDetails | null = null;

      switch (type) {
        case "event": {
          details = await dataManager.getEventDetails(id);
          break;
        }
        case "exhibit": {
          details = await dataManager.getExhibitDetails(id);
          break;
        }
        case "stall": {
          details = await dataManager.getStallDetails(id);
          break;
        }
        case "sponsor": {
          details = await dataManager.getSponsorDetails(id);
          break;
        }
        default: {
          throw new Error(`Unknown item type: ${type}`);
        }
      }

      return details;
    } catch (error) {
      console.error(`Failed to load details for ${type} ${id}:`, error);
      return null;
    } finally {
      setDetailsLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Bookmark functions
  const addBookmark = (id: string) => {
    dataManager.addBookmark(id);
    setBookmarks(dataManager.getBookmarks());
  };

  const removeBookmark = (id: string) => {
    dataManager.removeBookmark(id);
    setBookmarks(dataManager.getBookmarks());
  };

  const isBookmarked = isBookmarkedInternal;

  const getBookmarkedItems = (): ItemCore[] => {
    return allItems.filter((item) => bookmarks.includes(item.id));
  };

  // Search history
  const addToSearchHistory = (query: string) => {
    dataManager.addToSearchHistory(query);
    setSearchHistory(dataManager.getSearchHistory());
  };

  // Preferences
  const updatePreferences = (prefs: Partial<{ language: string; theme: "light" | "dark" }>) => {
    dataManager.updatePreferences(prefs);
    setPreferences(dataManager.getPreferences());
  };

  // Tag functions
  const getAllTags = (): string[] => allTags;

  const getPopularTags = (limit: number = 10): string[] => {
    return popularTags.slice(0, limit);
  };

  const getTagCounts = (): Record<string, number> => tagCounts;

  const contextValue: DataContextType = {
    addBookmark,
    addToSearchHistory,
    allItems,
    // Bookmarks
    bookmarks,
    detailsLoading,

    // Core data
    events,
    exhibits,

    filterByTags,
    // Tags
    getAllTags,

    getBookmarkedItems,

    // Detailed data
    getItemDetails,
    getPopularTags,
    getTagCounts,
    isBookmarked,
    // Map data
    mapData,

    // Preferences
    preferences,
    removeBookmark,

    // Search history
    searchHistory,
    // Search and filter
    searchItems,

    sponsors,
    stalls,
    updatePreferences,
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};
