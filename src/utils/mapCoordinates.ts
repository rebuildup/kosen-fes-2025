/**
 * Map Coordinate Transformation Utilities
 * 
 * This module provides mathematically correct coordinate transformations
 * between world coordinates and viewport coordinates for map zoom/pan operations.
 * 
 * Coordinate Systems:
 * - World Coordinates: The actual SVG coordinate system (0,0 to mapWidth,mapHeight)
 * - Viewport Coordinates: Screen pixel coordinates relative to the map container
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

export interface ViewportBounds {
  width: number;
  height: number;
}

/**
 * Transform world coordinates to viewport coordinates
 * 
 * Formula:
 * viewportX = (worldX - viewCenterX) * zoom + viewportWidth / 2
 * viewportY = (worldY - viewCenterY) * zoom + viewportHeight / 2
 */
export function worldToViewport(
  worldPoint: Point,
  viewCenter: Point,
  zoom: number,
  viewportBounds: ViewportBounds
): Point {
  return {
    x: (worldPoint.x - viewCenter.x) * zoom + viewportBounds.width / 2,
    y: (worldPoint.y - viewCenter.y) * zoom + viewportBounds.height / 2,
  };
}

/**
 * Transform viewport coordinates to world coordinates
 * 
 * Formula:
 * worldX = (viewportX - viewportWidth / 2) / zoom + viewCenterX
 * worldY = (viewportY - viewportHeight / 2) / zoom + viewCenterY
 */
export function viewportToWorld(
  viewportPoint: Point,
  viewCenter: Point,
  zoom: number,
  viewportBounds: ViewportBounds
): Point {
  return {
    x: (viewportPoint.x - viewportBounds.width / 2) / zoom + viewCenter.x,
    y: (viewportPoint.y - viewportBounds.height / 2) / zoom + viewCenter.y,
  };
}

/**
 * Calculate the new view center when zooming while keeping a specific point fixed
 * 
 * This ensures that when zooming in/out, the point under the mouse cursor
 * remains at the same screen position.
 */
export function calculateZoomCenter(
  fixedWorldPoint: Point,
  fixedViewportPoint: Point,
  newZoom: number,
  viewportBounds: ViewportBounds
): Point {
  // Calculate what the new view center should be to keep the fixed point
  // at the same viewport position
  const newViewCenterX = fixedWorldPoint.x - (fixedViewportPoint.x - viewportBounds.width / 2) / newZoom;
  const newViewCenterY = fixedWorldPoint.y - (fixedViewportPoint.y - viewportBounds.height / 2) / newZoom;
  
  return {
    x: newViewCenterX,
    y: newViewCenterY,
  };
}

/**
 * Calculate the visible world bounds for a given view state
 */
export function getVisibleWorldBounds(
  viewCenter: Point,
  zoom: number,
  viewportBounds: ViewportBounds
): {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
} {
  const visibleWidth = viewportBounds.width / zoom;
  const visibleHeight = viewportBounds.height / zoom;
  
  const left = viewCenter.x - visibleWidth / 2;
  const top = viewCenter.y - visibleHeight / 2;
  const right = left + visibleWidth;
  const bottom = top + visibleHeight;
  
  return {
    left,
    top,
    right,
    bottom,
    width: visibleWidth,
    height: visibleHeight,
  };
}

/**
 * Calculate SVG viewBox string for a given view state
 */
export function calculateViewBox(
  viewCenter: Point,
  zoom: number,
  viewportBounds: ViewportBounds
): string {
  const bounds = getVisibleWorldBounds(viewCenter, zoom, viewportBounds);
  return `${bounds.left} ${bounds.top} ${bounds.width} ${bounds.height}`;
}

/**
 * Constrain a point to stay within map bounds
 */
export function constrainToMapBounds(
  point: Point,
  mapBounds: { width: number; height: number }
): Point {
  return {
    x: Math.max(0, Math.min(mapBounds.width, point.x)),
    y: Math.max(0, Math.min(mapBounds.height, point.y)),
  };
}

/**
 * Constrain zoom level to stay within specified bounds
 */
export function constrainZoom(zoom: number, minZoom: number, maxZoom: number): number {
  return Math.max(minZoom, Math.min(maxZoom, zoom));
}

/**
 * Calculate the transform parameters for CSS/GSAP transforms
 * This converts from the mathematical coordinate system to the transform system
 */
export function calculateTransformParams(
  viewCenter: Point,
  zoom: number,
  viewportBounds: ViewportBounds,
  mapBounds: { width: number; height: number }
): {
  scale: number;
  translateX: number;
  translateY: number;
} {
  // Calculate the uniform scale factor for the map to fit the viewport
  const baseScaleX = viewportBounds.width / mapBounds.width;
  const baseScaleY = viewportBounds.height / mapBounds.height;
  const baseScale = Math.min(baseScaleX, baseScaleY);
  
  // Calculate the center offset for the base map
  const baseCenterX = (viewportBounds.width - mapBounds.width * baseScale) / 2;
  const baseCenterY = (viewportBounds.height - mapBounds.height * baseScale) / 2;
  
  // Calculate where the view center should appear on screen
  const targetScreenX = viewportBounds.width / 2;
  const targetScreenY = viewportBounds.height / 2;
  
  // Calculate where the view center currently appears with the current zoom
  const currentScreenX = viewCenter.x * baseScale * zoom;
  const currentScreenY = viewCenter.y * baseScale * zoom;
  
  // Calculate translation needed to center the view
  const translateX = targetScreenX - currentScreenX - baseCenterX;
  const translateY = targetScreenY - currentScreenY - baseCenterY;
  
  return {
    scale: zoom,
    translateX,
    translateY,
  };
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(point1: Point, point2: Point): number {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Linear interpolation between two points
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Linear interpolation between two points
 */
export function lerpPoint(start: Point, end: Point, t: number): Point {
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
  };
}

/**
 * Calculate smooth zoom transition parameters
 */
export function calculateSmoothZoom(
  currentViewState: MapViewState,
  targetZoom: number,
  fixedPoint?: Point,
  steps: number = 60
): MapViewState[] {
  const states: MapViewState[] = [];
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const zoom = lerp(currentViewState.zoom, targetZoom, t);
    
    let viewCenter = currentViewState.viewCenter;
    
    if (fixedPoint) {
      // If we have a fixed point, calculate the new view center to keep it fixed
      const viewportCenter = {
        x: currentViewState.viewportSize.width / 2,
        y: currentViewState.viewportSize.height / 2,
      };
      viewCenter = calculateZoomCenter(fixedPoint, viewportCenter, zoom, currentViewState.viewportSize);
    }
    
    states.push({
      viewCenter,
      zoom,
      viewportSize: currentViewState.viewportSize,
    });
  }
  
  return states;
}