// This file has been consolidated into types/common.ts to eliminate type conflicts
// All types are now unified in a single location for better maintainability

// Re-export types from common.ts for backward compatibility
export type { Item, Event, Exhibit, Stall, Sponsor, ItemType, BaseItem } from './common';

// Additional types for data management
export interface UserPreferences {
  language: string;
  theme: "light" | "dark";
  notifications: boolean;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export interface UserData {
  bookmarks: string[];
  searchHistory: SearchHistoryItem[];
  preferences: UserPreferences;
}

// Building data for map functionality  
export interface Building {
  id: string;
  name: string;
  centerX: number;
  centerY: number;
  polygon: string;
  rooms: string[];
  facilities: string[];
}
