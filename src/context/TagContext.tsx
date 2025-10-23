/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useData } from "./DataContext";

interface TagContextType {
  tags: string[];
  popularTags: string[];
  selectedTags: string[];
  tagCounts: Record<string, number>;
  toggleTag: (tag: string) => void;
  selectTag: (tag: string) => void;
  clearTags: () => void;
  isTagSelected: (tag: string) => boolean;
  filterItemsByTags: <T extends { tags?: string[] }>(items: T[]) => T[];
}

const TagContext = createContext<TagContextType>({
  clearTags: () => {},
  filterItemsByTags: (items) => items,
  isTagSelected: () => false,
  popularTags: [],
  selectedTags: [],
  selectTag: () => {},
  tagCounts: {},
  tags: [],
  toggleTag: () => {},
});

export const useTag = () => useContext(TagContext);

interface TagProviderProps {
  children: ReactNode;
}

export const TagProvider = ({ children }: TagProviderProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Get tag data from DataContext
  const { getAllTags, getPopularTags, getTagCounts } = useData();

  const allTags = getAllTags();
  const tagCounts = getTagCounts();
  const popularTags = getPopularTags(10);

  // Sort all tags by popularity (count), then alphabetically
  const tags = [...allTags].sort((a: string, b: string) => {
    const countA = tagCounts[a] || 0;
    const countB = tagCounts[b] || 0;

    // Sort by count first (descending), then alphabetically
    if (countA !== countB) {
      return countB - countA;
    }
    return a.localeCompare(b);
  });

  const syncTagsWithUrl = useCallback(
    (tagsToSync: string[], options?: { replace?: boolean }) => {
      const params = new URLSearchParams(location.search);

      if (tagsToSync.length > 0) {
        const encoded = tagsToSync.map((tag) => encodeURIComponent(tag));
        params.set("tag", encoded.join(","));
      } else {
        params.delete("tag");
      }

      const nextSearch = params.toString();
      const currentSearch = location.search.replace(/^\?/, "");

      if (nextSearch === currentSearch) {
        return;
      }

      const target = `${location.pathname}${nextSearch ? `?${nextSearch}` : ""}${
        location.hash ?? ""
      }`;

      navigate(target, { replace: options?.replace ?? true });
    },
    [location.hash, location.pathname, location.search, navigate],
  );

  // Extract tags from URL when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagParam = params.get("tag");

    if (!tagParam) {
      if (selectedTags.length > 0) {
        setSelectedTags([]);
      }
      return;
    }

    const decodedTags = tagParam
      .split(",")
      .map((tag) => decodeURIComponent(tag.trim()))
      .filter((tag) => allTags.includes(tag));

    if (decodedTags.length === 0) {
      if (selectedTags.length > 0) {
        setSelectedTags([]);
      }
      return;
    }

    const isSameLength = decodedTags.length === selectedTags.length;
    const isSameOrder =
      isSameLength && decodedTags.every((tag, index) => tag === selectedTags[index]);

    if (!isSameOrder) {
      setSelectedTags(decodedTags);
    }
  }, [location.search, allTags, selectedTags]);

  // Toggle a tag (add if not selected, remove if selected)
  const toggleTag = useCallback(
    (tag: string) => {
      setSelectedTags((prev) => {
        const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];

        syncTagsWithUrl(next);
        return next;
      });
    },
    [syncTagsWithUrl],
  );

  // Select a single tag (replace current selection)
  const selectTag = useCallback(
    (tag: string) => {
      setSelectedTags((prev) => {
        if (prev.length === 1 && prev[0] === tag) {
          return prev;
        }

        const next = [tag];
        syncTagsWithUrl(next);
        return next;
      });
    },
    [syncTagsWithUrl],
  );

  // Clear all selected tags
  const clearTags = useCallback(() => {
    setSelectedTags([]);
    syncTagsWithUrl([], { replace: true });
  }, [syncTagsWithUrl]);

  // Check if a tag is currently selected
  const isTagSelected = useCallback(
    (tag: string) => {
      return selectedTags.includes(tag);
    },
    [selectedTags],
  );

  // Filter items by selected tags
  const filterItemsByTags = useCallback(
    <T extends { tags?: string[] }>(items: T[]): T[] => {
      if (selectedTags.length === 0) return items;
      return items.filter((item) => selectedTags.every((tag) => item.tags?.includes(tag)));
    },
    [selectedTags],
  );

  return (
    <TagContext.Provider
      value={{
        clearTags,
        filterItemsByTags,
        isTagSelected,
        popularTags,
        selectedTags,
        selectTag,
        tagCounts,
        tags,
        toggleTag,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};
