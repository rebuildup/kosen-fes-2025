import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useMapZoomPan } from "../../hooks/useMapZoomPan";
import {
  CAMPUS_MAP_BOUNDS,
  getBuildingCoordinates,
} from "../../data/buildings";
import { getLocationCoordinates } from "../../data/locationCoordinates";
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

  // Initialize zoom/pan functionality
  const {
    svgRef,
    zoomPan: _,
    zoomIn,
    zoomOut,
    zoomInToCoordinate,
    zoomOutFromCoordinate,
    resetZoom,
    zoomToLocation,
    screenToViewBox,
    pan,
  } = useMapZoomPan({
    minScale: minZoom,
    maxScale: maxZoom,
    initialScale: initialZoom,
    mapWidth: CAMPUS_MAP_BOUNDS.width,
    mapHeight: CAMPUS_MAP_BOUNDS.height,
    containerRef: mapContainerRef,
    overlayRef: overlayRef,
    onTransformUpdate: useCallback((scale: number) => {
      setCurrentScale(scale);
    }, []),
  });

  // Coordinate-based zoom functions that maintain center coordinate
  const handleZoomIn = useCallback(() => {
    zoomIn();
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut();
  }, [zoomOut]);

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

  // Handle mouse interactions (wheel, drag) natively
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || !allowInteraction) return;

    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let lastMousePos = { x: 0, y: 0 };

    // Handle wheel events for zooming
    const handleWheelEvent = (e: WheelEvent) => {
      // Always prevent page scroll
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Convert to world coordinates
      const cursorWorldPos = screenToViewBox(e.clientX, e.clientY);

      // Determine zoom direction
      const zoomDirection = e.deltaY > 0 ? "out" : "in";

      if (zoomDirection === "in") {
        zoomInToCoordinate(cursorWorldPos);
      } else {
        zoomOutFromCoordinate(cursorWorldPos);
      }
    };

    // Handle mouse down for drag start
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Only left mouse button

      isDragging = true;
      dragStart = { x: e.clientX, y: e.clientY };
      lastMousePos = { x: e.clientX, y: e.clientY };

      container.style.cursor = "grabbing";

      // ドラッグ開始時にユーザー選択を無効化
      document.body.style.userSelect = "none";

      // Prevent text selection during drag
      e.preventDefault();
    };

    // Handle mouse move for dragging
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      e.preventDefault();

      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      // 最小移動量でフィルタリング（パフォーマンス向上）
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

      // Apply pan with the delta movement
      pan(deltaX, deltaY);

      lastMousePos = { x: e.clientX, y: e.clientY };
    };

    // Handle mouse up to end drag
    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;

      isDragging = false;
      container.style.cursor = "grab";

      // ドラッグ終了時にユーザー選択を復元
      document.body.style.userSelect = "";

      // Update isDragging state for click detection
      const dragDistance = Math.sqrt(
        Math.pow(e.clientX - dragStart.x, 2) +
          Math.pow(e.clientY - dragStart.y, 2)
      );

      // If the drag distance is small, it's considered a click
      setIsDragging(dragDistance > 5);

      // Reset drag state after a short delay
      setTimeout(() => setIsDragging(false), 100);
    };

    // Handle mouse leave to cancel drag
    const handleMouseLeave = () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = "grab";
        document.body.style.userSelect = "";
        setIsDragging(false);
      }
    };

    // Add event listeners
    container.addEventListener("wheel", handleWheelEvent, {
      passive: false,
      capture: false, // Changed to false to allow normal event flow
    });

    container.addEventListener("mousedown", handleMouseDown, {
      passive: false,
    });
    document.addEventListener("mousemove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp, { passive: false });
    container.addEventListener("mouseleave", handleMouseLeave, {
      passive: false,
    });

    // Firefox legacy support
    const handleLegacyWheel = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    container.addEventListener("DOMMouseScroll", handleLegacyWheel, {
      passive: false,
      capture: false,
    } as AddEventListenerOptions);

    return () => {
      container.removeEventListener("wheel", handleWheelEvent);
      container.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("DOMMouseScroll", handleLegacyWheel);
    };
  }, [
    allowInteraction,
    screenToViewBox,
    zoomInToCoordinate,
    zoomOutFromCoordinate,
    pan,
  ]);

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

  // Get coordinates for legacy location support (now using centralized system)
  const getLegacyLocationCoordinates = (
    location: string
  ): Coordinate | null => {
    // Try new centralized system first
    const newCoords = getLocationCoordinates(location);
    if (newCoords) {
      return newCoords;
    }

    // Fallback to building coordinates for backward compatibility
    const buildingCoords = getBuildingCoordinates(location);
    return buildingCoords || null;
  };

  // Combined markers from both legacy locations and new markers
  const allMarkers = useMemo((): LocationMarker[] => {
    const legacyMarkers: LocationMarker[] = locations.map((location) => ({
      id: `legacy-${location}`,
      location,
      coordinates: getLegacyLocationCoordinates(location) || { x: 0, y: 0 },
      isSelected: selectedLocation === location,
      isHovered: hoveredLocation === location,
    }));

    return [...markers, ...legacyMarkers].filter(
      (marker: LocationMarker) =>
        marker.coordinates.x !== 0 || marker.coordinates.y !== 0
    );
  }, [markers, locations, selectedLocation, hoveredLocation]);

  // Render the complete map with all overlays
  const renderMapWithOverlays = () => {
    if (!svgContent) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div className="text-gray-500">マップを読み込み中...</div>
        </div>
      );
    }

    return (
      <div className="w-full h-full relative">
        {/* Main SVG Map */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CAMPUS_MAP_BOUNDS.width} ${CAMPUS_MAP_BOUNDS.height}`}
          className={`w-full h-full ${
            allowCoordinateSelection || mode === "interactive"
              ? "cursor-crosshair"
              : ""
          }`}
          onClick={handleMapClick}
          style={{ touchAction: "none" }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Overlay SVG for markers and interactive elements */}
        <svg
          ref={overlayRef}
          viewBox={`0 0 ${CAMPUS_MAP_BOUNDS.width} ${CAMPUS_MAP_BOUNDS.height}`}
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
          {process.env.NODE_ENV === "development" &&
            (() => {
              // Get the actual screen center coordinates using the current zoom/pan state
              const actualCenterCoord = screenToViewBox(
                mapContainerRef.current?.offsetWidth
                  ? mapContainerRef.current.offsetWidth / 2
                  : 400,
                mapContainerRef.current?.offsetHeight
                  ? mapContainerRef.current.offsetHeight / 2
                  : 300
              );

              return (
                <g className="dev-center-guide" pointerEvents="none">
                  {/* Center crosshair */}
                  <line
                    x1={actualCenterCoord.x - 20}
                    y1={actualCenterCoord.y}
                    x2={actualCenterCoord.x + 20}
                    y2={actualCenterCoord.y}
                    stroke="#ff0000"
                    strokeWidth={getStrokeWidth(2)}
                    opacity="0.7"
                  />
                  <line
                    x1={actualCenterCoord.x}
                    y1={actualCenterCoord.y - 20}
                    x2={actualCenterCoord.x}
                    y2={actualCenterCoord.y + 20}
                    stroke="#ff0000"
                    strokeWidth={getStrokeWidth(2)}
                    opacity="0.7"
                  />
                  {/* Center coordinate display */}
                  <rect
                    x={actualCenterCoord.x + 25}
                    y={actualCenterCoord.y - 15}
                    width="120"
                    height="30"
                    fill="rgba(255, 0, 0, 0.8)"
                    rx="5"
                  />
                  <text
                    x={actualCenterCoord.x + 85}
                    y={actualCenterCoord.y}
                    textAnchor="middle"
                    fontSize={getTextSize(10)}
                    fontWeight="bold"
                    fill="white"
                  >
                    CENTER: ({Math.round(actualCenterCoord.x)},{" "}
                    {Math.round(actualCenterCoord.y)})
                  </text>
                </g>
              );
            })()}
        </svg>
      </div>
    );
  };

  return (
    <div
      ref={mapContainerRef}
      className={`relative ${className}`}
      style={{
        height,
        touchAction: "none",
        cursor: allowInteraction ? "grab" : "default",
      }}
      onWheel={(e) => {
        // Prevent page scroll when hovering over the map
        if (allowInteraction) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onWheelCapture={(e) => {
        // Capture phase - prevent any wheel events from bubbling up
        if (allowInteraction) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
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
