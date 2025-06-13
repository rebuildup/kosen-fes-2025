import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Item } from "../types/common";
import dataManager from "../data/dataManager";

interface BookmarkContextType {
  bookmarks: string[];
  bookmarkedItems: any[];
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  clearAllBookmarks: () => void;
  getBookmarkedItemsByType: (type: string) => Item[];
  getBookmarkCount: () => number;
}

const defaultContext: BookmarkContextType = {
  bookmarks: [],
  bookmarkedItems: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  toggleBookmark: () => {},
  isBookmarked: () => false,
  clearAllBookmarks: () => {},
  getBookmarkedItemsByType: () => [],
  getBookmarkCount: () => 0,
};

const BookmarkContext = createContext<BookmarkContextType>(defaultContext);

export const useBookmark = () => useContext(BookmarkContext);

interface BookmarkProviderProps {
  children: ReactNode;
}

export const BookmarkProvider = ({ children }: BookmarkProviderProps) => {
  // Get initial bookmarks from localStorage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });

  // Get all items and filter by bookmarked IDs
  const [bookmarkedItems, setBookmarkedItems] = useState<any[]>([]);

  // Update bookmarked items when bookmarks change
  useEffect(() => {
    // Use dataManager to get items by IDs
    const items = dataManager.getItemsByIds(bookmarks);
    setBookmarkedItems(items);

    // Save bookmarks to localStorage
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (id: string) => {
    if (!bookmarks.includes(id)) {
      setBookmarks((prev) => [...prev, id]);
    }
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((bookmarkId) => bookmarkId !== id));
  };

  const toggleBookmark = (id: string) => {
    if (bookmarks.includes(id)) {
      removeBookmark(id);
    } else {
      addBookmark(id);
    }
  };

  const isBookmarked = (id: string) => {
    return bookmarks.includes(id);
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
  };

  const getBookmarkedItemsByType = (type: string) => {
    return bookmarkedItems.filter((item) => item.type === type);
  };

  const getBookmarkCount = () => {
    return bookmarks.length;
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        bookmarkedItems,
        addBookmark,
        removeBookmark,
        toggleBookmark,
        isBookmarked,
        clearAllBookmarks,
        getBookmarkedItemsByType,
        getBookmarkCount,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
