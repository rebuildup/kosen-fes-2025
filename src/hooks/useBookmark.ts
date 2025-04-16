// src/hooks/useBookmarks.ts
import { useState, useEffect } from "react";

export interface BookmarkItem {
  id: string | number;
  type: string;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const savedBookmarks = localStorage.getItem("kosen-fest-bookmarks");
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });
  const [loading] = useState(false);

  useEffect(() => {
    localStorage.setItem("kosen-fest-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (item: BookmarkItem) => {
    setBookmarks((prev) => {
      const exists = prev.some(
        (bookmark) =>
          bookmark.id.toString() === item.id.toString() &&
          bookmark.type === item.type
      );

      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeBookmark = (type: string, id: string | number) => {
    setBookmarks((prev) =>
      prev.filter(
        (bookmark) =>
          !(bookmark.id.toString() === id.toString() && bookmark.type === type)
      )
    );
  };

  const isBookmarked = (type: string, id: string | number) => {
    return bookmarks.some(
      (bookmark) =>
        bookmark.id.toString() === id.toString() && bookmark.type === type
    );
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
  };

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearAllBookmarks,
  };
};

export default useBookmarks;
