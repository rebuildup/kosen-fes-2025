import { useRef, useEffect, useState } from "react";
import { useMapZoomPan } from "../../hooks/useMapZoomPan";
import { CAMPUS_MAP_BOUNDS } from "../../data/buildings";

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

interface UnifiedMapProps {
  // Map mode - affects behavior and interactions
  mode?: "display" | "detail" | "interactive";
  
  // Location markers to display
  markers?: LocationMarker[];
  
  // Interaction handlers
  onLocationHover?: (location: string | null) => void;
  onLocationSelect?: (location: string | null) => void;
  onCoordinateSelect?: (coordinate: Coordinate) => void;
  
  // Detail mode specific props
  highlightLocation?: string;
  highlightCoordinate?: Coordinate;
  
  // Interactive mode specific props
  selectedCoordinate?: Coordinate | null;
  
  // Styling
  className?: string;
  height?: string;
  
  // Advanced controls
  showZoomControls?: boolean;
  allowInteraction?: boolean;
  initialZoom?: number;
  maxZoom?: number;
  minZoom?: number;
}

const UnifiedMap = ({
  mode = "display",
  markers = [],
  onLocationHover,
  onLocationSelect,
  onCoordinateSelect,
  highlightLocation,
  highlightCoordinate,
  selectedCoordinate,
  className = "",
  height = "400px",
  showZoomControls = true,
  allowInteraction = true,
  initialZoom = 1,
  maxZoom = 5,
  minZoom = 0.5,
}: UnifiedMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // Initialize zoom/pan functionality
  const { svgRef, zoomPan, zoomIn, zoomOut, resetZoom, zoomToLocation } =
    useMapZoomPan({
      minScale: minZoom,
      maxScale: maxZoom,
      initialScale: initialZoom,
      mapWidth: CAMPUS_MAP_BOUNDS.width,
      mapHeight: CAMPUS_MAP_BOUNDS.height,
      containerRef: mapContainerRef,
    });

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

  // Handle coordinate selection for interactive mode
  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!allowInteraction || mode !== "interactive" || isDragging) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();

    // Calculate position relative to the SVG element
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;

    // Convert to SVG coordinate space
    const x = relativeX * CAMPUS_MAP_BOUNDS.width;
    const y = relativeY * CAMPUS_MAP_BOUNDS.height;

    // Ensure coordinates are within bounds
    const clampedX = Math.max(0, Math.min(CAMPUS_MAP_BOUNDS.width, x));
    const clampedY = Math.max(0, Math.min(CAMPUS_MAP_BOUNDS.height, y));

    onCoordinateSelect?.({ x: clampedX, y: clampedY });
  };

  // Handle mouse events for drag detection
  const handleMouseDown = () => setIsDragging(false);
  const handleMouseMove = () => setIsDragging(true);

  // Auto-zoom to highlighted location or coordinate
  useEffect(() => {
    if (highlightCoordinate) {
      const timer = setTimeout(() => {
        zoomToLocation(highlightCoordinate.x, highlightCoordinate.y, 3, 1.5);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [highlightCoordinate, zoomToLocation]);

  // Auto-zoom to selected coordinate in interactive mode
  useEffect(() => {
    if (selectedCoordinate && mode === "interactive") {
      const timer = setTimeout(() => {
        zoomToLocation(selectedCoordinate.x, selectedCoordinate.y, 3, 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedCoordinate, zoomToLocation, mode]);

  // Parse SVG content and add interactive elements
  const renderSvgWithOverlays = () => {
    if (!svgContent) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p style={{ color: "var(--color-text-secondary)" }}>Loading map...</p>
          </div>
        </div>
      );
    }

    return (
      <svg
        ref={svgRef}
        viewBox={CAMPUS_MAP_BOUNDS.viewBox}
        className="w-full h-full"
        onClick={handleMapClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{ cursor: mode === "interactive" ? "crosshair" : "grab" }}
        dangerouslySetInnerHTML={{
          __html: svgContent.replace(/<svg[^>]*>|<\/svg>/g, ""),
        }}
      />
    );
  };

  return (
    <div
      ref={mapContainerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height, backgroundColor: "var(--color-bg-secondary)" }}
    >
      {/* Main SVG Content */}
      <div className="absolute inset-0">
        {renderSvgWithOverlays()}
        
        {/* Overlay markers and interactive elements */}
        {svgContent && (
          <svg
            viewBox={CAMPUS_MAP_BOUNDS.viewBox}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {/* Location markers for display mode */}
            {mode === "display" &&
              markers.map((marker) => (
                <g
                  key={marker.id}
                  className="location-marker pointer-events-auto"
                  onMouseEnter={() => onLocationHover?.(marker.location)}
                  onMouseLeave={() => onLocationHover?.(null)}
                  onClick={() => onLocationSelect?.(marker.location)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={marker.coordinates.x}
                    cy={marker.coordinates.y}
                    r={
                      marker.isSelected ? 30 : marker.isHovered ? 25 : 20
                    }
                    fill={
                      marker.isSelected
                        ? "var(--primary)"
                        : marker.isHovered
                        ? "var(--primary-light)"
                        : "var(--secondary)"
                    }
                    stroke="white"
                    strokeWidth="3"
                  />
                  <text
                    x={marker.coordinates.x}
                    y={marker.coordinates.y + 8}
                    textAnchor="middle"
                    className="text-sm font-medium pointer-events-none"
                    fill="var(--color-text-primary)"
                  >
                    {marker.location.split(",")[0]}
                  </text>
                </g>
              ))}

            {/* Highlight marker for detail mode */}
            {mode === "detail" && highlightCoordinate && (
              <g>
                <circle
                  cx={highlightCoordinate.x}
                  cy={highlightCoordinate.y}
                  r="30"
                  fill="var(--primary)"
                  stroke="white"
                  strokeWidth="4"
                >
                  <animate
                    attributeName="r"
                    values="30;40;30"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="1;0.7;1"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <text
                  x={highlightCoordinate.x}
                  y={highlightCoordinate.y - 50}
                  textAnchor="middle"
                  className="text-lg font-bold"
                  fill="var(--primary)"
                >
                  {highlightLocation?.split(",")[0]}
                </text>
              </g>
            )}

            {/* Selected coordinate marker for interactive mode */}
            {mode === "interactive" && selectedCoordinate && (
              <g>
                {/* Ripple effect */}
                <circle
                  cx={selectedCoordinate.x}
                  cy={selectedCoordinate.y}
                  r="25"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values="25;45;25"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0;0.6"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Main marker */}
                <circle
                  cx={selectedCoordinate.x}
                  cy={selectedCoordinate.y}
                  r="15"
                  fill="var(--primary)"
                  stroke="white"
                  strokeWidth="3"
                />

                {/* Center dot */}
                <circle
                  cx={selectedCoordinate.x}
                  cy={selectedCoordinate.y}
                  r="4"
                  fill="white"
                />

                {/* Coordinate label */}
                <text
                  x={selectedCoordinate.x}
                  y={selectedCoordinate.y - 30}
                  textAnchor="middle"
                  className="text-sm font-bold"
                  fill="var(--color-text-primary)"
                  stroke="white"
                  strokeWidth="2"
                  paintOrder="stroke"
                >
                  📍 選択位置
                </text>
              </g>
            )}
          </svg>
        )}
      </div>

      {/* Zoom Controls - Top Right Only */}
      {showZoomControls && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={zoomIn}
            disabled={zoomPan.scale >= maxZoom}
            className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border-primary)",
            }}
            title="ズームイン"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <line x1="8" y1="11" x2="14" y2="11" />
              <line x1="11" y1="8" x2="11" y2="14" />
            </svg>
          </button>

          <button
            onClick={zoomOut}
            disabled={zoomPan.scale <= minZoom}
            className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border-primary)",
            }}
            title="ズームアウト"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>

          <button
            onClick={resetZoom}
            className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border-primary)",
            }}
            title="リセット"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </button>

          {/* Zoom Level Indicator */}
          <div
            className="flex items-center justify-center px-2 py-1 rounded-lg text-xs font-medium shadow-md"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border-primary)",
            }}
          >
            {Math.round(zoomPan.scale * 100)}%
          </div>
        </div>
      )}

      {/* Interactive mode instructions */}
      {mode === "interactive" && (
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
          <div className="flex items-center gap-2">
            <span>🖱️</span>
            <span>クリックして位置を選択</span>
          </div>
          {selectedCoordinate && (
            <div className="text-xs mt-1 opacity-75">
              選択中: X={selectedCoordinate.x.toFixed(1)}, Y=
              {selectedCoordinate.y.toFixed(1)}
            </div>
          )}
        </div>
      )}

      {/* Zoom level indicator for non-interactive modes */}
      {mode !== "interactive" && (
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-xs">
          ズーム: {(zoomPan.scale * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default UnifiedMap;