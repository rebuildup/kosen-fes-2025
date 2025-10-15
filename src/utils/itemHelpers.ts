import type { Item } from "../types/common";

// Convert Item to ContentItem for map display
export const itemToContentItem = (item: Item) => {
  if (!item.coordinates) return null;

  return {
    coordinates: item.coordinates,
    id: item.id,
    isHovered: false,
    isSelected: false,
    title: item.title,
    type: item.type,
  };
};

// Convert multiple items to content items, filtering out items without coordinates
export const itemsToContentItems = (items: Item[]) => {
  return items
    .map(itemToContentItem)
    .filter((item): item is NonNullable<typeof item> => item !== null);
};
