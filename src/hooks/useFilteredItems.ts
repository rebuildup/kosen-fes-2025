// src/hooks/useFilteredItems.ts
import { useMemo } from "react";

export function useFilteredItems<
  T extends { category: string; title: string; description: string }
>(items: T[], activeCategory: string, searchQuery: string): T[] {
  return useMemo(() => {
    let filtered = items;

    if (activeCategory !== "all") {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [items, activeCategory, searchQuery]);
}
