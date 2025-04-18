import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Item } from "../types/common";
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";

interface BookmarkContextType {
  bookmarks: string[];
  bookmarkedItems: Item[];
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  clearAllBookmarks: () => void;
}

const defaultContext: BookmarkContextType = {
  bookmarks: [],
  bookmarkedItems: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  toggleBookmark: () => {},
  isBookmarked: () => false,
  clearAllBookmarks: () => {},
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
    // Combine all items
    const allItems: Item[] = [...events, ...exhibits, ...stalls];

    // Filter items by bookmarked IDs
    const items = allItems.filter((item) => bookmarks.includes(item.id));
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
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
