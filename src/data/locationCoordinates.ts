/**
 * Centralized location coordinates data
 * 
 * This file consolidates all location coordinate data that was previously
 * scattered across different files. It provides a unified interface for
 * accessing coordinates for buildings, landmarks, and special areas.
 */

import { Point } from "../types/map";

export interface LocationCoordinate {
  id: string;
  name: string;
  coordinates: Point;
  type: "building" | "landmark" | "area" | "entrance";
  aliases?: string[];
  category?: "academic" | "dormitory" | "recreation" | "administrative" | "dining" | "general";
}

/**
 * Core location coordinates extracted and consolidated from buildings.ts and mapData.ts
 */
export const locationCoordinates: Record<string, LocationCoordinate> = {
  // Buildings from buildings.ts
  "第二体育館": {
    id: "_第二体育館",
    name: "第二体育館",
    coordinates: { x: 147.38, y: 188.82 },
    type: "building",
    aliases: ["second-gym", "武道場"],
    category: "recreation",
  },
  "F棟": {
    id: "F棟",
    name: "F棟",
    coordinates: { x: 1649.86, y: 805.44 },
    type: "building",
    aliases: ["F-building"],
    category: "academic",
  },
  "経営情報学科棟": {
    id: "_経営情報学科棟",
    name: "経営情報学科棟",
    coordinates: { x: 883.39, y: 817.44 },
    type: "building",
    aliases: ["management-building"],
    category: "academic",
  },
  "武道場": {
    id: "_武道場",
    name: "武道場",
    coordinates: { x: 1160.24, y: 1087.2 },
    type: "building",
    aliases: ["martial-arts-hall"],
    category: "recreation",
  },
  "課外活動棟": {
    id: "_課外活動棟_",
    name: "課外活動棟",
    coordinates: { x: 1716.82, y: 882.39 },
    type: "building",
    aliases: ["activity-building"],
    category: "recreation",
  },
  "学生会館": {
    id: "_学生会館",
    name: "学生会館",
    coordinates: { x: 588.55, y: 733.5 },
    type: "building",
    aliases: ["student-hall"],
    category: "dining",
  },
  "図書館棟": {
    id: "_図書館棟",
    name: "図書館棟",
    coordinates: { x: 579.6, y: 497.66 },
    type: "building",
    aliases: ["library"],
    category: "academic",
  },
  "第一体育館": {
    id: "_第一体育館",
    name: "第一体育館",
    coordinates: { x: 1007.76, y: 1088.25 },
    type: "building",
    aliases: ["first-gym"],
    category: "recreation",
  },
  "管理棟": {
    id: "_管理棟",
    name: "管理棟",
    coordinates: { x: 248.83, y: 864.85 },
    type: "building",
    aliases: ["admin-building"],
    category: "administrative",
  },
  "機電棟": {
    id: "_機電棟",
    name: "機電棟",
    coordinates: { x: 254.83, y: 751.49 },
    type: "building",
    aliases: ["engineering-building"],
    category: "academic",
  },
  
  // Landmarks and special areas from mapData.ts
  "メインステージ": {
    id: "main-stage",
    name: "メインステージ",
    coordinates: { x: 1000, y: 800 },
    type: "landmark",
    aliases: ["Main Stage", "main-stage"],
    category: "recreation",
  },
  "フードコートエリア": {
    id: "food-court",
    name: "フードコートエリア",
    coordinates: { x: 600, y: 750 },
    type: "area",
    aliases: ["Food Court", "フードコート"],
    category: "dining",
  },
  "正門": {
    id: "main-entrance",
    name: "正門",
    coordinates: { x: 500, y: 400 },
    type: "entrance",
    aliases: ["Main Entrance"],
    category: "general",
  },
  
  // Additional common locations for better coverage
  "中央広場": {
    id: "central-plaza",
    name: "中央広場",
    coordinates: { x: 700, y: 900 },
    type: "area",
    aliases: ["Central Plaza"],
    category: "general",
  },
};

/**
 * Get coordinates for a location by name or alias
 */
export function getLocationCoordinates(locationName: string): Point | undefined {
  // Direct lookup first
  const direct = locationCoordinates[locationName];
  if (direct) {
    return direct.coordinates;
  }
  
  // Search through aliases
  for (const location of Object.values(locationCoordinates)) {
    if (location.aliases?.some(alias => 
      locationName.toLowerCase().includes(alias.toLowerCase()) ||
      alias.toLowerCase().includes(locationName.toLowerCase())
    )) {
      return location.coordinates;
    }
  }
  
  // Partial name matching
  for (const location of Object.values(locationCoordinates)) {
    if (location.name.includes(locationName) || locationName.includes(location.name)) {
      return location.coordinates;
    }
  }
  
  return undefined;
}

/**
 * Get location information by name or alias
 */
export function getLocationInfo(locationName: string): LocationCoordinate | undefined {
  // Direct lookup first
  const direct = locationCoordinates[locationName];
  if (direct) {
    return direct;
  }
  
  // Search through aliases
  for (const location of Object.values(locationCoordinates)) {
    if (location.aliases?.some(alias => 
      locationName.toLowerCase().includes(alias.toLowerCase()) ||
      alias.toLowerCase().includes(locationName.toLowerCase())
    )) {
      return location;
    }
  }
  
  // Partial name matching
  for (const location of Object.values(locationCoordinates)) {
    if (location.name.includes(locationName) || locationName.includes(location.name)) {
      return location;
    }
  }
  
  return undefined;
}

/**
 * Get all locations by category
 */
export function getLocationsByCategory(category: LocationCoordinate["category"]): LocationCoordinate[] {
  return Object.values(locationCoordinates).filter(location => location.category === category);
}

/**
 * Get all locations by type
 */
export function getLocationsByType(type: LocationCoordinate["type"]): LocationCoordinate[] {
  return Object.values(locationCoordinates).filter(location => location.type === type);
}

/**
 * Search locations by partial name match
 */
export function searchLocations(query: string): LocationCoordinate[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(locationCoordinates).filter(location =>
    location.name.toLowerCase().includes(lowerQuery) ||
    location.aliases?.some(alias => alias.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get all available location names (for autocomplete/suggestions)
 */
export function getAllLocationNames(): string[] {
  const names = new Set<string>();
  
  for (const location of Object.values(locationCoordinates)) {
    names.add(location.name);
    if (location.aliases) {
      location.aliases.forEach(alias => names.add(alias));
    }
  }
  
  return Array.from(names).sort();
}

/**
 * Validate if a location name exists
 */
export function isValidLocation(locationName: string): boolean {
  return getLocationInfo(locationName) !== undefined;
}

/**
 * Get the nearest location to a given coordinate
 */
export function getNearestLocation(targetCoord: Point): LocationCoordinate | null {
  let nearestLocation: LocationCoordinate | null = null;
  let shortestDistance = Infinity;
  
  for (const location of Object.values(locationCoordinates)) {
    const dx = location.coordinates.x - targetCoord.x;
    const dy = location.coordinates.y - targetCoord.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestLocation = location;
    }
  }
  
  return nearestLocation;
}