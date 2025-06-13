// 基本的なデータ型
export interface BaseEntity {
  id: string;
  type: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

// イベント関連の型
export interface Event extends BaseEntity {
  type: "event";
  date: string;
  time: string;
  location: string;
  organizer: string;
  duration: number;
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

// データストアの型
export interface DataStore {
  events: Event[];
  exhibits: Exhibit[];
  stalls: Stall[];
  buildings: Building[];
  sponsors: Sponsor[];
  userData: UserData;
}
