import { useRef, useEffect, useState, useCallback } from "react";
import { useMapZoomPan } from "../../hooks/useMapZoomPan";
import {
  CAMPUS_MAP_BOUNDS,
  getBuildingCoordinates,
} from "../../data/buildings";
import ZoomControls from "./ZoomControls";

interface Coordinate {
  x: number;
  y: number;
}

interface LocationMarker {
  id: string;
  location: string;
  coordinates: Coordinate;
  isSelected?: boolean;
  isHovered?: boolean;
}

interface ContentItem {
  id: string;
  title: string;
  type: "event" | "exhibit" | "stall" | "sponsor";
  coordinates: Coordinate;
  isSelected?: boolean;
  isHovered?: boolean;
}

interface UnifiedMapProps {
  // Map mode - affects behavior and interactions
  mode?: "display" | "detail" | "interactive";

  // Location markers to display (buildings, rooms, etc.)
  markers?: LocationMarker[];

  // Legacy location support for backward compatibility
  locations?: string[];
  hoveredLocation?: string | null;
  selectedLocation?: string | null;
  onLocationHover?: (location: string | null) => void;
  onLocationSelect?: (location: string | null) => void;

  // Content items to display (events, exhibits, stalls)
  contentItems?: ContentItem[];

  // Interaction handlers
  onContentItemHover?: (item: ContentItem | null) => void;
  onContentItemSelect?: (item: ContentItem | null) => void;
  onCoordinateSelect?: (coordinate: Coordinate) => void;

  // Detail mode specific props
  highlightLocation?: string;
  highlightCoordinate?: Coordinate;
  highlightContentItem?: string;

  // Interactive mode specific props
  selectedCoordinate?: Coordinate | null;

  // Styling
  className?: string;
  height?: string;

  // Advanced controls
  showZoomControls?: boolean;
  allowInteraction?: boolean;
  allowCoordinateSelection?: boolean;
  initialZoom?: number;
  maxZoom?: number;
  minZoom?: number;
}

const UnifiedMap = ({
  mode = "display",
  markers = [],
  locations = [],
  hoveredLocation,
  selectedLocation,
  onLocationHover,
  onLocationSelect,
  contentItems = [],
  onContentItemHover,
  onContentItemSelect,
  onCoordinateSelect,
  highlightLocation: _highlightLocation,
  highlightCoordinate,
  highlightContentItem: _highlightContentItem,
  selectedCoordinate,
  className = "",
  height = "400px",
  showZoomControls = true,
  allowInteraction = true,
  allowCoordinateSelection = false,
  initialZoom = 1,
  maxZoom = 8,
  minZoom = 0.5,
}: UnifiedMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [currentScale, setCurrentScale] = useState(initialZoom);
  const [centerCoordinate, setCenterCoordinate] = useState<Coordinate>({
    x: CAMPUS_MAP_BOUNDS.width / 2,
    y: CAMPUS_MAP_BOUNDS.height / 2,
  });

  // Initialize zoom/pan functionality
  const {
    svgRef,
    zoomPan: _,
    zoomIn: _zoomIn,
    zoomOut: _zoomOut,
    zoomInToCoordinate,
    zoomOutFromCoordinate,
    resetZoom,
    zoomToLocation,
    screenToViewBox,
  } = useMapZoomPan({
    minScale: minZoom,
    maxScale: maxZoom,
    initialScale: initialZoom,
    mapWidth: CAMPUS_MAP_BOUNDS.width,
    mapHeight: CAMPUS_MAP_BOUNDS.height,
    containerRef: mapContainerRef,
    overlayRef: overlayRef,
    onTransformUpdate: useCallback(
      (scale: number, centerX: number, centerY: number) => {
        setCurrentScale(scale);
        setCenterCoordinate({ x: centerX, y: centerY });
      },
      []
    ),
  });

  // Coordinate-based zoom functions that maintain center coordinate
  const handleZoomIn = useCallback(() => {
    zoomInToCoordinate(centerCoordinate);
  }, [centerCoordinate, zoomInToCoordinate]);

  const handleZoomOut = useCallback(() => {
    zoomOutFromCoordinate(centerCoordinate);
  }, [centerCoordinate, zoomOutFromCoordinate]);

  // Load SVG content dynamically
  useEffect(() => {
    const loadSvgContent = async () => {
      try {
        const response = await fetch("/campus-map.svg");
        const svgText = await response.text();
        setSvgContent(svgText);
      } catch (error) {
        console.error("Failed to load campus map SVG:", error);
      }
    };

    loadSvgContent();
  }, []);

  // Handle legacy location focus
  useEffect(() => {
    if (selectedLocation) {
      const coords = getBuildingCoordinates(selectedLocation);
      if (coords) {
        zoomToLocation(coords.x, coords.y, 4, 1.5);
      }
    }
  }, [selectedLocation, zoomToLocation]);

  useEffect(() => {
    if (hoveredLocation && !selectedLocation) {
      const coords = getBuildingCoordinates(hoveredLocation);
      if (coords) {
        zoomToLocation(coords.x, coords.y, 3, 1);
      }
    }
  }, [hoveredLocation, selectedLocation, zoomToLocation]);

  // Handle highlight coordinate focus
  useEffect(() => {
    if (highlightCoordinate) {
      zoomToLocation(highlightCoordinate.x, highlightCoordinate.y, 4, 1.5);
    }
  }, [highlightCoordinate, zoomToLocation]);

  // Handle selected coordinate focus
  useEffect(() => {
    if (selectedCoordinate) {
      const timer = setTimeout(() => {
        zoomToLocation(selectedCoordinate.x, selectedCoordinate.y, 3, 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedCoordinate, zoomToLocation]);

  // Reset zoom when no location is selected or hovered
  useEffect(() => {
    if (
      !hoveredLocation &&
      !selectedLocation &&
      !highlightCoordinate &&
      !selectedCoordinate
    ) {
      resetZoom();
    }
  }, [
    hoveredLocation,
    selectedLocation,
    highlightCoordinate,
    selectedCoordinate,
    resetZoom,
  ]);

  // Calculate marker size based on actual current scale
  const getMarkerSize = (baseSize: number = 20) => {
    const scaledSize = baseSize / currentScale;
    return Math.max(8, Math.min(50, scaledSize));
  };

  // Calculate text size based on actual current scale
  const getTextSize = (baseSize: number = 12) => {
    const scaledSize = baseSize / currentScale;
    return Math.max(6, Math.min(20, scaledSize));
  };

  // Calculate stroke width based on actual current scale
  const getStrokeWidth = (baseWidth: number = 1) => {
    return baseWidth / currentScale;
  };

  // Handle coordinate selection using new coordinate system
  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!allowInteraction || isDragging) return;

    // Only allow coordinate selection in interactive mode or when explicitly enabled
    if (!allowCoordinateSelection && mode !== "interactive") return;

    // Use the new screenToViewBox function for accurate coordinate conversion
    const viewCoord = screenToViewBox(event.clientX, event.clientY);
    onCoordinateSelect?.(viewCoord);
  };

  // Simplified drag detection - no actual dragging functionality
  const handleMouseDown = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(() => {
    // Simplified - no dragging functionality
  }, []);

  // Get coordinates for legacy location support
  const getLocationCoordinates = (location: string): Coordinate | null => {
    const coords = getBuildingCoordinates(location);
    return coords || null;
  };

  // Combined markers from both legacy locations and new markers
  const getAllMarkers = (): LocationMarker[] => {
    const legacyMarkers: LocationMarker[] = locations.map((location) => ({
      id: `legacy-${location}`,
      location,
      coordinates: getLocationCoordinates(location) || { x: 0, y: 0 },
      isSelected: selectedLocation === location,
      isHovered: hoveredLocation === location,
    }));

    return [...markers, ...legacyMarkers].filter(
      (marker) => marker.coordinates.x !== 0 || marker.coordinates.y !== 0
    );
  };

  // Render the complete map with all overlays
  const renderMapWithOverlays = () => {
    if (!svgContent) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div className="text-gray-500">マップを読み込み中...</div>
        </div>
      );
    }

    const allMarkers = getAllMarkers();

    return (
      <div className="w-full h-full relative">
        {/* Main SVG Map */}
        <svg
          ref={svgRef}
          viewBox={CAMPUS_MAP_BOUNDS.viewBox}
          className={`w-full h-full ${
            allowCoordinateSelection || mode === "interactive"
              ? "cursor-crosshair"
              : ""
          }`}
          onClick={handleMapClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Overlay SVG for markers and interactive elements */}
        <svg
          ref={overlayRef}
          viewBox={CAMPUS_MAP_BOUNDS.viewBox}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <defs>
            <style>
              {`
                .location-marker { cursor: pointer; pointer-events: all; }
                .location-marker.hovered .location-dot { 
                  r: ${getMarkerSize(25)}; 
                  fill: var(--color-primary-light, #60a5fa);
                }
                .location-marker.selected .location-dot { 
                  r: ${getMarkerSize(30)}; 
                  fill: var(--color-primary, #3b82f6);
                  filter: drop-shadow(0 0 10px var(--color-primary, #3b82f6));
                }
                .location-label {
                  font-family: inherit;
                  font-size: ${getTextSize(11)}px;
                  font-weight: 600;
                  pointer-events: none;
                  text-shadow: 1px 1px 2px rgba(255,255,255,0.9);
                  fill: #1f2937;
                }
                .content-marker { cursor: pointer; pointer-events: all; }
                .content-marker.hovered .content-dot { 
                  r: ${getMarkerSize(22)}; 
                  opacity: 0.9;
                }
                .content-marker.selected .content-dot { 
                  r: ${getMarkerSize(28)}; 
                  filter: drop-shadow(0 0 8px currentColor);
                }
                .content-label {
                  font-family: inherit;
                  font-size: ${getTextSize(10)}px;
                  font-weight: 500;
                  pointer-events: none;
                  text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
                  fill: #374151;
                }
                .coordinate-marker {
                  fill: var(--color-accent, #f59e0b);
                  filter: drop-shadow(0 0 12px var(--color-accent, #f59e0b));
                }
                .highlight-marker {
                  fill: var(--color-secondary, #8b5cf6);
                  filter: drop-shadow(0 0 15px var(--color-secondary, #8b5cf6));
                }
              `}
            </style>
          </defs>

          {/* Location Markers */}
          {allMarkers.map((marker) => (
            <g
              key={marker.id}
              className={`location-marker ${
                marker.isHovered ? "hovered" : ""
              } ${marker.isSelected ? "selected" : ""}`}
              onClick={() => onLocationSelect?.(marker.location)}
              onMouseEnter={() => onLocationHover?.(marker.location)}
              onMouseLeave={() => onLocationHover?.(null)}
            >
              <circle
                className="location-dot"
                cx={marker.coordinates.x}
                cy={marker.coordinates.y}
                r={getMarkerSize(
                  marker.isSelected ? 25 : marker.isHovered ? 22 : 18
                )}
                fill={
                  marker.isSelected
                    ? "var(--color-primary, #3b82f6)"
                    : marker.isHovered
                    ? "var(--color-primary-light, #60a5fa)"
                    : "var(--color-gray-600, #4b5563)"
                }
                stroke="white"
                strokeWidth={getStrokeWidth(2)}
              />
              <text
                className="location-label"
                x={marker.coordinates.x}
                y={marker.coordinates.y - getMarkerSize(25)}
                textAnchor="middle"
              >
                {marker.location}
              </text>
            </g>
          ))}

          {/* Content Item Markers */}
          {contentItems.map((item) => {
            const getItemColor = (type: string) => {
              switch (type) {
                case "event":
                  return "#f97316"; // orange
                case "exhibit":
                  return "#06b6d4"; // cyan
                case "stall":
                  return "#3b82f6"; // blue
                case "sponsor":
                  return "#10b981"; // emerald
                default:
                  return "#6b7280"; // gray
              }
            };

            const getItemIcon = (type: string) => {
              switch (type) {
                case "event":
                  return "🎪";
                case "exhibit":
                  return "🔬";
                case "stall":
                  return "🍴";
                case "sponsor":
                  return "🏢";
                default:
                  return "📍";
              }
            };

            return (
              <g
                key={item.id}
                className={`content-marker ${item.isHovered ? "hovered" : ""} ${
                  item.isSelected ? "selected" : ""
                }`}
                onClick={() => onContentItemSelect?.(item)}
                onMouseEnter={() => onContentItemHover?.(item)}
                onMouseLeave={() => onContentItemHover?.(null)}
              >
                <circle
                  className="content-dot"
                  cx={item.coordinates.x}
                  cy={item.coordinates.y}
                  r={getMarkerSize(
                    item.isSelected ? 24 : item.isHovered ? 20 : 16
                  )}
                  fill={getItemColor(item.type)}
                  stroke="white"
                  strokeWidth={getStrokeWidth(2)}
                />
                <text
                  x={item.coordinates.x}
                  y={item.coordinates.y + getTextSize(4)}
                  textAnchor="middle"
                  fontSize={getTextSize(14)}
                  fill="white"
                  fontWeight="bold"
                >
                  {getItemIcon(item.type)}
                </text>
                <text
                  className="content-label"
                  x={item.coordinates.x}
                  y={item.coordinates.y - getMarkerSize(22)}
                  textAnchor="middle"
                >
                  {item.title}
                </text>
              </g>
            );
          })}

          {/* Highlight Coordinate Marker */}
          {highlightCoordinate && (
            <g className="highlight-marker" pointerEvents="none">
              <circle
                cx={highlightCoordinate.x}
                cy={highlightCoordinate.y}
                r={getMarkerSize(28)}
                fill="var(--color-secondary, #8b5cf6)"
                stroke="white"
                strokeWidth={getStrokeWidth(3)}
                opacity="0.9"
              />
              <circle
                cx={highlightCoordinate.x}
                cy={highlightCoordinate.y}
                r={getMarkerSize(15)}
                fill="white"
                opacity="0.8"
              />
            </g>
          )}

          {/* Selected Coordinate Marker */}
          {selectedCoordinate && (
            <g className="coordinate-marker" pointerEvents="none">
              <circle
                cx={selectedCoordinate.x}
                cy={selectedCoordinate.y}
                r={getMarkerSize(26)}
                fill="var(--color-accent, #f59e0b)"
                stroke="white"
                strokeWidth={getStrokeWidth(3)}
                opacity="0.9"
              />
              <circle
                cx={selectedCoordinate.x}
                cy={selectedCoordinate.y}
                r={getMarkerSize(12)}
                fill="white"
                opacity="0.9"
              />
              <text
                x={selectedCoordinate.x}
                y={selectedCoordinate.y - getMarkerSize(32)}
                textAnchor="middle"
                fontSize={getTextSize(11)}
                fontWeight="bold"
                fill="#1f2937"
                className="location-label"
              >
                選択された位置
              </text>
            </g>
          )}

          {/* Development Guide: Center Coordinate Indicator */}
          {process.env.NODE_ENV === "development" && (
            <g className="dev-center-guide" pointerEvents="none">
              {/* Center crosshair */}
              <line
                x1={centerCoordinate.x - 20}
                y1={centerCoordinate.y}
                x2={centerCoordinate.x + 20}
                y2={centerCoordinate.y}
                stroke="#ff0000"
                strokeWidth={getStrokeWidth(2)}
                opacity="0.7"
              />
              <line
                x1={centerCoordinate.x}
                y1={centerCoordinate.y - 20}
                x2={centerCoordinate.x}
                y2={centerCoordinate.y + 20}
                stroke="#ff0000"
                strokeWidth={getStrokeWidth(2)}
                opacity="0.7"
              />
              {/* Center coordinate display */}
              <rect
                x={centerCoordinate.x + 25}
                y={centerCoordinate.y - 15}
                width="120"
                height="30"
                fill="rgba(255, 0, 0, 0.8)"
                rx="5"
              />
              <text
                x={centerCoordinate.x + 85}
                y={centerCoordinate.y}
                textAnchor="middle"
                fontSize={getTextSize(10)}
                fontWeight="bold"
                fill="white"
              >
                CENTER: ({Math.round(centerCoordinate.x)},{" "}
                {Math.round(centerCoordinate.y)})
              </text>
            </g>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div
      ref={mapContainerRef}
      className={`relative ${className}`}
      style={{ height }}
    >
      {/* Zoom Controls */}
      {showZoomControls && (
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={resetZoom}
          scale={currentScale}
          minScale={minZoom}
          maxScale={maxZoom}
        />
      )}

      {/* Map Display */}
      {renderMapWithOverlays()}
    </div>
  );
};

export default UnifiedMap;
