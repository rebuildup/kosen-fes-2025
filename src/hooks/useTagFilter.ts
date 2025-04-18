import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchResult } from "../types/common";

interface UseTagFilterResult {
  filteredItems: SearchResult[];
  activeTag: string;
  setActiveTag: (tag: string) => void;
  allTags: string[];
  clearFilter: () => void;
}

/**
 * Custom hook for filtering items by tags
 * @param items Array of items to filter
 * @returns Filtered items and tag filter controls
 */
const useTagFilter = (items: SearchResult[]): UseTagFilterResult => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTag, setActiveTag] = useState("");

  // Extract tag from URL on initial render and when URL changes
  useEffect(() => {
    const tagParam = searchParams.get("tag") || "";
    setActiveTag(tagParam);
  }, [searchParams]);

  // Update URL when activeTag changes
  const handleSetActiveTag = (tag: string) => {
    if (tag) {
      searchParams.set("tag", tag);
    } else {
      searchParams.delete("tag");
    }
    setSearchParams(searchParams);
    setActiveTag(tag);
  };

  // Clear all filters
  const clearFilter = () => {
    searchParams.delete("tag");
    setSearchParams(searchParams);
    setActiveTag("");
  };

  // Get all unique tags from items
  const allTags = useMemo(() => {
    const tags = items.flatMap((item) => item.tags || []);
    return [...new Set(tags)].sort();
  }, [items]);

  // Filter items by active tag
  const filteredItems = useMemo(() => {
    if (!activeTag) {
      return items;
    }

    return items.filter(
      (item) =>
        item.tags &&
        item.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase())
    );
  }, [items, activeTag]);

  return {
    filteredItems,
    activeTag,
    setActiveTag: handleSetActiveTag,
    allTags,
    clearFilter,
  };
};

export default useTagFilter;
