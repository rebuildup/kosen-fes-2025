// Re-export types from existing location for backward compatibility
export type { ItemType, BaseItem, Event, Exhibit, Stall, Sponsor, Item } from "../../types/common";
export type { DataState, ItemCore, ItemDetails, EventCore, ExhibitCore, StallCore, SponsorCore, MapData, DataStore } from "../../types/data";

// Additional shared types for the application
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface SearchParams {
  query: string;
  tags: string[];
  type?: ItemType;
  sortBy?: "date" | "title" | "relevance";
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  types?: ItemType[];
  location?: string;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface ThemeConfig {
  mode: "light" | "dark" | "auto";
  primaryColor?: string;
  fontSize?: "small" | "medium" | "large";
  reducedMotion?: boolean;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
}

export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
  children?: NavigationItem[];
  requiredPermission?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: AppError;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiry: number;
}