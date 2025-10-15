/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import dataManager from "../data/dataManager";
import type { Item } from "../types/common";

interface BookmarkContextType {
  bookmarks: string[];
  bookmarkedItems: Item[];
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  clearAllBookmarks: () => void;
  getBookmarkedItemsByType: (type: string) => Item[];
  getBookmarkCount: () => number;
}

const defaultContext: BookmarkContextType = {
  addBookmark: () => {},
  bookmarkedItems: [],
  bookmarks: [],
  clearAllBookmarks: () => {},
  getBookmarkCount: () => 0,
  getBookmarkedItemsByType: () => [],
  isBookmarked: () => false,
  removeBookmark: () => {},
  toggleBookmark: () => {},
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
  const [bookmarkedItems, setBookmarkedItems] = useState<Item[]>([]);

  // Update bookmarked items when bookmarks change
  useEffect(() => {
    // Use dataManager to get items by IDs
    const items = dataManager.getFullItemsByIds(bookmarks);
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
        addBookmark,
        bookmarkedItems,
        bookmarks,
        clearAllBookmarks,
        getBookmarkCount,
        getBookmarkedItemsByType,
        isBookmarked,
        removeBookmark,
        toggleBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
