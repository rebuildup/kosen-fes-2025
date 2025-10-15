// Backward compatibility adapters for existing hooks
import { useData } from "./DataContext";

// Adapter for useSearch hook
export const useSearchCompat = () => {
  const { addToSearchHistory, searchHistory, searchItems } = useData();

  type SearchResults = ReturnType<typeof searchItems>;
  const emptyResults: SearchResults = [];

  return {
    clearSearch: () => {},
    isSearching: false,
    performSearch: (query: string): SearchResults => {
      addToSearchHistory(query);
      return searchItems(query);
    },
    recentSearches: searchHistory.slice(0, 5),
    searchHistory,
    searchQuery: "",
    searchResults: emptyResults,
    setSearchQuery: () => {},
  };
};

// Adapter for useBookmark hook
export const useBookmarkCompat = () => {
  const {
    addBookmark,
    bookmarks,
    getBookmarkedItems,
    isBookmarked,
    removeBookmark,
  } = useData();

  return {
    addBookmark,
    bookmarkedItems: getBookmarkedItems(),
    bookmarks,
    clearAllBookmarks: () => {
      for (const id of bookmarks) removeBookmark(id);
    },
    getBookmarkCount: () => bookmarks.length,
    getBookmarkedItemsByType: (type: string) => {
      return getBookmarkedItems().filter((item) => item.type === type);
    },
    isBookmarked,
    removeBookmark,
    toggleBookmark: (id: string) => {
      if (isBookmarked(id)) {
        removeBookmark(id);
      } else {
        addBookmark(id);
      }
    },
  };
};

// Adapter for useTag hook
export const useTagCompat = () => {
  const { getAllTags, getPopularTags, getTagCounts } = useData();

  // Simple state management for selected tags (could be enhanced)
  let selectedTags: string[] = [];

  return {
    clearTags: () => {
      selectedTags = [];
    },
    filterItemsByTags: <T extends { tags: string[] }>(items: T[]): T[] => {
      if (selectedTags.length === 0) return items;
      return items.filter((item) =>
        selectedTags.some((tag) => item.tags.includes(tag)),
      );
    },
    isTagSelected: (tag: string) => selectedTags.includes(tag),
    popularTags: getPopularTags(),
    selectedTags,
    selectTag: (tag: string) => {
      selectedTags = [tag];
    },
    tagCounts: getTagCounts(),
    tags: getAllTags(),
    toggleTag: (tag: string) => {
      selectedTags = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];
    },
  };
};
