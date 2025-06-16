export type ItemType = "event" | "exhibit" | "stall" | "sponsor";

export interface BaseItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  time: string;
  location: string;
  tags: string[];
}

export interface Event extends BaseItem {
  type: "event";
  organizer: string;
  duration: number; // in minutes
}

export interface Exhibit extends BaseItem {
  type: "exhibit";
  creator: string;
}

export interface Stall extends BaseItem {
  type: "stall";
  products: string[];
}

export interface Sponsor extends BaseItem {
  type: "sponsor";
  website: string;
  contactEmail?: string;
  tier: string;
}

export type Item = Event | Exhibit | Stall | Sponsor;
