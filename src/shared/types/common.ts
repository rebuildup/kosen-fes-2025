import type { ItemType } from "../../types/data";

// Re-export types from existing location for backward compatibility
export type {
  BaseItem,
  Event,
  Exhibit,
  Item,
  Sponsor,
  Stall,
} from "../../types/common";
export type {
  DataState,
  DataStore,
  EventCore,
  ExhibitCore,
  ItemCore,
  ItemDetails,
  MapData,
  SponsorCore,
  StallCore,
} from "../../types/data";

// Additional shared types for the application
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
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

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  error?: AppError;
}

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  expiry: number;
}
