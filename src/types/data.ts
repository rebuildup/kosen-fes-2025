// Enhanced data types with separation of essential vs detailed data
export type ItemType = "event" | "exhibit" | "stall" | "sponsor";

// Essential data for lists, previews, search
export interface BaseItemCore {
  id: string;
  type: ItemType;
  title: string;
  date: string;
  time: string;
  location: string;
  tags: string[];
  imageUrl: string;
}

// Detailed data loaded on-demand
export interface BaseItemDetails {
  description: string;
}

export interface EventCore extends BaseItemCore {
  type: "event";
  organizer: string;
  duration: number;
}

export interface EventDetails extends BaseItemDetails {}

export interface ExhibitCore extends BaseItemCore {
  type: "exhibit";
  creator: string;
}

export interface ExhibitDetails extends BaseItemDetails {}

export interface StallCore extends BaseItemCore {
  type: "stall";
}

export interface StallDetails extends BaseItemDetails {
  products: string[];
}

export interface SponsorCore extends BaseItemCore {
  type: "sponsor";
  tier: "platinum" | "gold" | "silver" | "bronze";
}

export interface SponsorDetails extends BaseItemDetails {
  website: string;
  contactEmail?: string;
}

export type ItemCore = EventCore | ExhibitCore | StallCore | SponsorCore;
export type ItemDetails = EventDetails | ExhibitDetails | StallDetails | SponsorDetails;

// Combined type for backward compatibility
export interface Event extends EventCore, EventDetails {}
export interface Exhibit extends ExhibitCore, ExhibitDetails {}
export interface Stall extends StallCore, StallDetails {}
export interface Sponsor extends SponsorCore, SponsorDetails {}

export type Item = Event | Exhibit | Stall | Sponsor;

// Data loading states
export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated?: number;
}

// Map data separated from content
export interface MapLocation {
  id: string;
  name: string;
  centerX: number;
  centerY: number;
  polygon?: string;
  type: 'building' | 'area' | 'landmark';
  rooms?: string[];
}

export interface MapData {
  locations: MapLocation[];
  bounds: {
    width: number;
    height: number;
    viewBox: string;
  };
}

// Centralized data store interface
export interface DataStore {
  // Core data (loaded immediately)
  events: DataState<EventCore[]>;
  exhibits: DataState<ExhibitCore[]>;
  stalls: DataState<StallCore[]>;
  sponsors: DataState<SponsorCore[]>;
  
  // Detailed data (loaded on-demand)
  eventDetails: Record<string, DataState<EventDetails>>;
  exhibitDetails: Record<string, DataState<ExhibitDetails>>;
  stallDetails: Record<string, DataState<StallDetails>>;
  sponsorDetails: Record<string, DataState<SponsorDetails>>;
  
  // Map data (separated from content)
  mapData: DataState<MapData>;
  
  // User data
  bookmarks: string[];
  searchHistory: string[];
  preferences: {
    language: string;
    theme: "light" | "dark";
  };
}
