// 基本的なデータ型
export type ItemType = "event" | "exhibit" | "stall" | "sponsor";

export interface BaseEntity {
  id: string;
  type: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

// コアデータの型
export interface ItemCore {
  id: string;
  type: string;
  title: string;
  date?: string;
  time?: string;
  location: string;
  tags: string[];
  imageUrl: string;
}

export interface EventCore extends ItemCore {
  type: "event";
  organizer: string;
  duration: number;
  showOnMap: boolean;
  showOnSchedule: boolean;
  dayAvailability: "day1" | "day2" | "both";
}

export interface ExhibitCore extends ItemCore {
  type: "exhibit";
  creator: string;
}

export interface StallCore extends ItemCore {
  type: "stall";
}

export interface SponsorCore extends ItemCore {
  type: "sponsor";
}

// 詳細データの型
export interface ItemDetails {
  description: string;
}

// データ状態の型
export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
}

// マップデータの型
export interface MapData {
  buildings?: Building[];
  paths?: Path[];
  locations: MapLocation[];
  bounds?: {
    width: number;
    height: number;
    viewBox: string;
  };
}

export interface Path {
  id: string;
  points: Point[];
}

export interface Point {
  x: number;
  y: number;
}

export interface MapLocation {
  id: string;
  name: string;
  centerX: number;
  centerY: number;
  polygon?: string;
  type?: string;
  rooms?: string[];
}

// データストアの型
export interface DataStore {
  events: DataState<EventCore[]>;
  exhibits: DataState<ExhibitCore[]>;
  stalls: DataState<StallCore[]>;
  sponsors: DataState<SponsorCore[]>;
  eventDetails: Record<string, DataState<ItemDetails>>;
  exhibitDetails: Record<string, DataState<ItemDetails>>;
  stallDetails: Record<string, DataState<ItemDetails>>;
  sponsorDetails: Record<string, DataState<ItemDetails>>;
  mapData: DataState<MapData | null>;
  bookmarks: string[];
  searchHistory: string[];
  preferences: {
    language: string;
    theme: "light" | "dark";
  };
}

// イベント関連の型
export interface Event extends BaseEntity {
  type: "event";
  date: string;
  time: string;
  location: string;
  organizer: string;
  duration: number;
  showOnMap: boolean;
  showOnSchedule: boolean;
  dayAvailability: "day1" | "day2" | "both";
}

// 展示関連の型
export interface Exhibit extends BaseEntity {
  type: "exhibit";
  location: string;
  organizer: string;
  startTime: string;
  endTime: string;
}

// 出店関連の型
export interface Stall extends BaseEntity {
  type: "stall";
  location: string;
  menu: string[];
  price: string;
  openTime: string;
  closeTime: string;
}

// 建物関連の型
export interface Building {
  id: string;
  name: string;
  centerX: number;
  centerY: number;
  polygon: string;
  rooms: string[];
  facilities: string[];
}

// スポンサー関連の型
export interface Sponsor {
  id: string;
  name: string;
  type: "gold" | "silver" | "bronze";
  logoUrl: string;
  website?: string;
  description?: string;
}

// ユーザー関連の型
export interface UserData {
  bookmarks: string[]; // ブックマークしたアイテムのID配列
  searchHistory: {
    query: string;
    timestamp: number;
  }[];
  preferences: {
    language: string;
    theme: "light" | "dark";
    notifications: boolean;
  };
}
