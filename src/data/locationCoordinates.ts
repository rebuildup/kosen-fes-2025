/**
 * Centralized location coordinates data
 *
 * This file consolidates all location coordinate data that was previously
 * scattered across different files. It provides a unified interface for
 * accessing coordinates for buildings, landmarks, and special areas.
 *
 * Copyright (c) 2025 Ube National College of Technology. All Rights Reserved.
 * このファイルの内容は宇部高等専門学校の著作権により保護されています。
 * 許可なく使用することはできません。
 */

import type { Point } from "../types/map";

export interface LocationCoordinate {
  id: string;
  name: string;
  coordinates: Point;
  type: "building" | "landmark" | "area" | "entrance";
  aliases?: string[];
  category?:
    | "academic"
    | "dormitory"
    | "recreation"
    | "administrative"
    | "dining"
    | "general";
}

/**
 * Core location coordinates extracted and consolidated from buildings.ts and mapData.ts
 */
export const locationCoordinates: Record<string, LocationCoordinate> = {
  フードコートエリア: {
    aliases: ["Food Court", "フードコート"],
    category: "dining",
    coordinates: { x: 600, y: 750 },
    id: "food-court",
    name: "フードコートエリア",
    type: "area",
  },

  // Landmarks and special areas from mapData.ts
  メインステージ: {
    aliases: ["Main Stage", "main-stage"],
    category: "recreation",
    coordinates: { x: 1000, y: 800 },
    id: "main-stage",
    name: "メインステージ",
    type: "landmark",
  },
  // Additional common locations for better coverage
  中央広場: {
    aliases: ["Central Plaza"],
    category: "general",
    coordinates: { x: 700, y: 900 },
    id: "central-plaza",
    name: "中央広場",
    type: "area",
  },

  図書館棟: {
    aliases: ["library"],
    category: "academic",
    coordinates: { x: 579.6, y: 497.66 },
    id: "_図書館棟",
    name: "図書館棟",
    type: "building",
  },
  学生会館: {
    aliases: ["student-hall"],
    category: "dining",
    coordinates: { x: 588.55, y: 733.5 },
    id: "_学生会館",
    name: "学生会館",
    type: "building",
  },
  機電棟: {
    aliases: ["engineering-building"],
    category: "academic",
    coordinates: { x: 254.83, y: 751.49 },
    id: "_機電棟",
    name: "機電棟",
    type: "building",
  },
  正門: {
    aliases: ["Main Entrance"],
    category: "general",
    coordinates: { x: 500, y: 400 },
    id: "main-entrance",
    name: "正門",
    type: "entrance",
  },
  武道場: {
    aliases: ["martial-arts-hall"],
    category: "recreation",
    coordinates: { x: 1160.24, y: 1087.2 },
    id: "_武道場",
    name: "武道場",
    type: "building",
  },

  第一体育館: {
    aliases: ["first-gym"],
    category: "recreation",
    coordinates: { x: 1007.76, y: 1088.25 },
    id: "_第一体育館",
    name: "第一体育館",
    type: "building",
  },
  // Buildings from buildings.ts
  第二体育館: {
    aliases: ["second-gym", "武道場"],
    category: "recreation",
    coordinates: { x: 147.38, y: 188.82 },
    id: "_第二体育館",
    name: "第二体育館",
    type: "building",
  },
  管理棟: {
    aliases: ["admin-building"],
    category: "administrative",
    coordinates: { x: 248.83, y: 864.85 },
    id: "_管理棟",
    name: "管理棟",
    type: "building",
  },

  経営情報学科棟: {
    aliases: ["management-building"],
    category: "academic",
    coordinates: { x: 883.39, y: 817.44 },
    id: "_経営情報学科棟",
    name: "経営情報学科棟",
    type: "building",
  },
};

/**
 * Get coordinates for a location by name or alias
 */
export function getLocationCoordinates(
  locationName: string,
): Point | undefined {
  // Direct lookup first
  const direct = locationCoordinates[locationName];
  if (direct) {
    return direct.coordinates;
  }

  // Search through aliases
  for (const location of Object.values(locationCoordinates)) {
    if (
      location.aliases?.some(
        (alias) =>
          locationName.toLowerCase().includes(alias.toLowerCase()) ||
          alias.toLowerCase().includes(locationName.toLowerCase()),
      )
    ) {
      return location.coordinates;
    }
  }

  // Partial name matching
  for (const location of Object.values(locationCoordinates)) {
    if (
      location.name.includes(locationName) ||
      locationName.includes(location.name)
    ) {
      return location.coordinates;
    }
  }

  return undefined;
}

/**
 * Get location information by name or alias
 */
export function getLocationInfo(
  locationName: string,
): LocationCoordinate | undefined {
  // Direct lookup first
  const direct = locationCoordinates[locationName];
  if (direct) {
    return direct;
  }

  // Search through aliases
  for (const location of Object.values(locationCoordinates)) {
    if (
      location.aliases?.some(
        (alias) =>
          locationName.toLowerCase().includes(alias.toLowerCase()) ||
          alias.toLowerCase().includes(locationName.toLowerCase()),
      )
    ) {
      return location;
    }
  }

  // Partial name matching
  for (const location of Object.values(locationCoordinates)) {
    if (
      location.name.includes(locationName) ||
      locationName.includes(location.name)
    ) {
      return location;
    }
  }

  return undefined;
}

/**
 * Get all locations by category
 */
export function getLocationsByCategory(
  category: LocationCoordinate["category"],
): LocationCoordinate[] {
  return Object.values(locationCoordinates).filter(
    (location) => location.category === category,
  );
}

/**
 * Get all locations by type
 */
export function getLocationsByType(
  type: LocationCoordinate["type"],
): LocationCoordinate[] {
  return Object.values(locationCoordinates).filter(
    (location) => location.type === type,
  );
}

/**
 * Search locations by partial name match
 */
export function searchLocations(query: string): LocationCoordinate[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(locationCoordinates).filter(
    (location) =>
      location.name.toLowerCase().includes(lowerQuery) ||
      location.aliases?.some((alias) =>
        alias.toLowerCase().includes(lowerQuery),
      ),
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
      for (const alias of location.aliases) names.add(alias);
    }
  }

  return [...names].sort((a: string, b: string) => a.localeCompare(b));
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
export function getNearestLocation(
  targetCoord: Point,
): LocationCoordinate | null {
  let nearestLocation: LocationCoordinate | null = null;
  let shortestDistance = Infinity;

  for (const location of Object.values(locationCoordinates)) {
    const dx = location.coordinates.x - targetCoord.x;
    const dy = location.coordinates.y - targetCoord.y;
    const distance = Math.hypot(dx, dy);

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestLocation = location;
    }
  }

  return nearestLocation;
}
