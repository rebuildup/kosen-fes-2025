/**
 * Map-related type definitions
 */

export interface Point {
  x: number;
  y: number;
}

export interface MapViewState {
  viewCenter: Point;
  zoom: number;
  viewportSize: { width: number; height: number };
}

export type MapMode = "view" | "select" | "focus";

export interface LocationMarker {
  id: string;
  location: string;
  coordinates: Point;
  isSelected?: boolean;
  isHovered?: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  type: "event" | "exhibit" | "stall" | "sponsor";
  coordinates: Point;
  isSelected?: boolean;
  isHovered?: boolean;
}

export interface MapBounds {
  width: number;
  height: number;
  viewBox: string;
}
