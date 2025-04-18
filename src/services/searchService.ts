// src/services/searchService.ts
import { SearchResult } from "../types/common";
import { events } from "../data/events";
import { exhibitions } from "../data/exhibitions";
import { foodStalls } from "../data/foodStalls";

export interface SearchOptions {
  query?: string;
  types?: string[];
  tags?: string[];
  dateRange?: { start?: string; end?: string };
}

/**
 * Search for items matching the query
 * @param query Search query
 * @param options Additional search options
 * @returns Array of matching items
 */
export const searchItems = async (
  query: string,
  options?: SearchOptions
): Promise<SearchResult[]> => {
  // Simulate API call with setTimeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // Convert to lowercase for case-insensitive search
      const lowerQuery = query.toLowerCase().trim();

      if (!lowerQuery) {
        resolve([]);
        return;
      }

      // Combine all items
      const allItems: SearchResult[] = [
        ...events.map((event) => ({ ...event, type: "event" as const })),
        ...exhibitions.map((exhibition) => ({
          ...exhibition,
          type: "exhibition" as const,
        })),
        ...foodStalls.map((foodStall) => ({
          ...foodStall,
          type: "foodStall" as const,
        })),
      ];

      // Filter by query
      let results = allItems.filter((item) => {
        // Search in title
        if (item.title.toLowerCase().includes(lowerQuery)) {
          return true;
        }

        // Search in description
        if (
          item.description &&
          item.description.toLowerCase().includes(lowerQuery)
        ) {
          return true;
        }

        // Search in tags
        if (
          item.tags &&
          item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        ) {
          return true;
        }

        // Search in location
        if (item.location && item.location.toLowerCase().includes(lowerQuery)) {
          return true;
        }

        return false;
      });

      // Apply additional filters if provided
      if (options) {
        // Filter by types
        if (options.types && options.types.length > 0) {
          results = results.filter((item) =>
            options.types?.includes(item.type)
          );
        }

        // Filter by tags
        if (options.tags && options.tags.length > 0) {
          results = results.filter(
            (item) =>
              item.tags && item.tags.some((tag) => options.tags?.includes(tag))
          );
        }

        // Filter by date range
        if (options.dateRange) {
          const { start, end } = options.dateRange;

          results = results.filter((item) => {
            if (!item.date) return false;

            const itemDate = new Date(item.date.split(" ")[0]);

            if (start && itemDate < new Date(start)) return false;
            if (end && itemDate > new Date(end)) return false;

            return true;
          });
        }
      }

      resolve(results);
    }, 500); // Simulate some latency
  });
};
