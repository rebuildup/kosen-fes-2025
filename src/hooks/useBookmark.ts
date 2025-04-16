// src/hooks/useBookmark.ts
import { useBookmarkContext } from "../contexts/BookmarkContext";
import type { BookmarkItem } from "../contexts/BookmarkContext";

// This is a specialized hook for working with a specific bookmark
export const useBookmark = (type: string, id: string | number) => {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkContext();

  // Helper for toggling a specific bookmark
  const toggleBookmark = (item?: Omit<BookmarkItem, "id" | "type">) => {
    if (isBookmarked(type, id)) {
      removeBookmark(type, id);
    } else if (item) {
      addBookmark({
        id,
        type,
        ...item,
      });
    }
  };

  return {
    isBookmarked: isBookmarked(type, id),
    toggleBookmark,
  };
};

export default useBookmark;
