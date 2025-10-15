import type { Item } from "../../types/common";

/**
 * Get organization information based on item type
 */
export const getItemOrganization = (item: Item): string => {
  switch (item.type) {
    case "event": {
      return item.organizer || "";
    }
    case "exhibit": {
      return item.creator || "";
    }
    case "stall": {
      return item.organizer || "";
    }
    default: {
      return "";
    }
  }
};

/**
 * Get organization label based on item type and translation function
 */
export const getItemOrganizationLabel = (
  itemType: string,
  t: (key: string) => string,
): string => {
  switch (itemType) {
    case "event": {
      return t("detail.organizer");
    }
    case "exhibit": {
      return t("detail.creator");
    }
    case "stall": {
      return t("detail.organizer");
    }
    default: {
      return "";
    }
  }
};

/**
 * Get placeholder image path based on item type
 */
export const getPlaceholderImage = (itemType: string): string => {
  switch (itemType) {
    case "event": {
      return "./images/placeholder-event.jpg";
    }
    case "exhibit": {
      return "./images/placeholder-exhibit.jpg";
    }
    case "stall": {
      return "./images/placeholder-stall.jpg";
    }
    default: {
      return "./images/placeholder.jpg";
    }
  }
};

/**
 * Get optimized image URL based on size requirements
 */
export const getOptimizedImageUrl = (imageUrl: string): string => {
  // If it's already a placeholder or external URL, return as-is
  if (imageUrl.includes("placeholder") || imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // For local images, we could implement size optimization here
  // For now, just return the original URL
  return imageUrl;
};

/**
 * Check if an item matches a search query
 */
export const itemMatchesSearch = (item: Item, query: string): boolean => {
  const searchQuery = query.toLowerCase().trim();
  if (!searchQuery) return true;

  const searchableFields = [
    item.title,
    item.description,
    item.location,
    getItemOrganization(item),
    ...(item.tags || []),
  ];

  return searchableFields.some((field) =>
    field?.toLowerCase().includes(searchQuery),
  );
};

/**
 * Check if an item matches the given tags
 */
export const itemMatchesTags = (
  item: Item,
  selectedTags: string[],
): boolean => {
  if (selectedTags.length === 0) return true;
  return selectedTags.every((tag) => item.tags?.includes(tag));
};

/**
 * Filter items by search query and tags
 */
export const filterItems = (
  items: Item[],
  searchQuery: string = "",
  selectedTags: string[] = [],
): Item[] => {
  return items.filter(
    (item) =>
      itemMatchesSearch(item, searchQuery) &&
      itemMatchesTags(item, selectedTags),
  );
};

/**
 * Sort items by date and time
 */
export const sortItemsByDateTime = (items: Item[]): Item[] => {
  return [...items].sort((a: Item, b: Item) => {
    // First sort by date
    const dateComparison =
      new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateComparison !== 0) return dateComparison;

    // If dates are equal, sort by time
    const timeA = a.time.split(" - ")[0] || "00:00";
    const timeB = b.time.split(" - ")[0] || "00:00";
    return timeA.localeCompare(timeB);
  });
};

/**
 * Group items by date
 */
export const groupItemsByDate = (items: Item[]): Record<string, Item[]> => {
  return items.reduce(
    (groups, item) => {
      const date = item.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    },
    {} as Record<string, Item[]>,
  );
};

/**
 * Get unique tags from items
 */
export const getUniqueTagsFromItems = (items: Item[]): string[] => {
  const tagSet = new Set<string>();
  for (const item of items) {
    if (item.tags) for (const tag of item.tags) tagSet.add(tag);
  }
  return [...tagSet].sort((a: string, b: string) => a.localeCompare(b));
};

/**
 * Calculate reading time for description text
 */
export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};
