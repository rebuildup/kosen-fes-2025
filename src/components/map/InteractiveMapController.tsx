import { useRef, useEffect, useState } from "react";
import { CAMPUS_MAP_BOUNDS, buildings } from "../../data/buildings";
import { useMapZoomPan } from "../../hooks/useMapZoomPan";

interface Coordinate {
  x: number;
  y: number;
}

interface InteractiveMapControllerProps {
  onCoordinateSelect: (coordinate: Coordinate) => void;
  selectedCoordinate?: Coordinate | null;
  className?: string;
}

const InteractiveMapController = ({
  onCoordinateSelect,
  selectedCoordinate,
  className,
}: InteractiveMapControllerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { svgRef, zoomPan, zoomIn, zoomOut, resetZoom, zoomToLocation } =
    useMapZoomPan({
      minScale: 0.5,
      maxScale: 8,
      initialScale: 1,
      mapWidth: CAMPUS_MAP_BOUNDS.width,
      mapHeight: CAMPUS_MAP_BOUNDS.height,
      containerRef: mapRef,
    });

  // Handle map click for coordinate selection
  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) return; // Don't select if user was dragging

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

    console.log("Click coordinates:", {
      screen: { x: event.clientX, y: event.clientY },
      relative: { x: relativeX, y: relativeY },
      svg: { x, y },
      clamped: { x: clampedX, y: clampedY },
      bounds: CAMPUS_MAP_BOUNDS,
    });

    onCoordinateSelect({ x: clampedX, y: clampedY });
  };

  // Handle mouse events for drag detection
  const handleMouseDown = () => setIsDragging(false);
  const handleMouseMove = () => setIsDragging(true);

  // Auto-zoom to selected coordinate
  useEffect(() => {
    if (selectedCoordinate) {
      const timer = setTimeout(() => {
        zoomToLocation(selectedCoordinate.x, selectedCoordinate.y, 3, 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedCoordinate, zoomToLocation]);

  return (
    <div
      ref={mapRef}
      className={`relative rounded-lg overflow-hidden border cursor-crosshair ${
        className || ""
      }`}
      style={{ borderColor: "var(--color-border-primary)", minHeight: "400px" }}
    >
      <svg
        ref={svgRef}
        viewBox={CAMPUS_MAP_BOUNDS.viewBox}
        className="w-full h-full"
        onClick={handleMapClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <defs>
          <style>
            {`
              .campus-bg { fill: #e8f4f8; }
              .building { fill: #d1d5db; stroke: #9ca3af; stroke-width: 1; }
              .location-marker { fill: #10b981; stroke: #065f46; stroke-width: 1; opacity: 0.7; }
              .location-text { font-size: 10px; fill: #065f46; font-weight: bold; }
              .selected-marker { 
                filter: drop-shadow(0 0 12px var(--color-accent));
                animation: mapPulse 2s infinite;
              }
              .marker-ring {
                fill: none;
                stroke: var(--color-accent);
                stroke-width: 2;
                opacity: 0.6;
                animation: ripple 2s infinite;
              }
              @keyframes mapPulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.1); }
              }
              @keyframes ripple {
                0% { r: 20; opacity: 0.6; }
                100% { r: 40; opacity: 0; }
              }
            `}
          </style>
        </defs>

        {/* Campus background */}
        <rect
          x="0"
          y="0"
          width={CAMPUS_MAP_BOUNDS.width}
          height={CAMPUS_MAP_BOUNDS.height}
          className="campus-bg"
        />

        {/* Render actual campus buildings */}
        <g id="campus-buildings">
          {buildings.map((building) => (
            <g key={building.id}>
              <polygon
                points={building.polygon}
                className="building"
                style={{
                  fill: "#d1d5db",
                  stroke: "#9ca3af",
                  strokeWidth: 1,
                  cursor: "pointer",
                }}
              >
                <title>{building.name}</title>
              </polygon>
              <text
                x={building.centerX}
                y={building.centerY}
                textAnchor="middle"
                className="location-text"
                style={{
                  fontSize: "10px",
                  fill: "#065f46",
                  fontWeight: "bold",
                  pointerEvents: "none",
                }}
              >
                {building.name}
              </text>
            </g>
          ))}
        </g>

        {/* Grid lines for better positioning */}
        <defs>
          <pattern
            id="grid"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity="0.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Selected coordinate marker */}
        {selectedCoordinate && (
          <g className="selected-marker">
            {/* Ripple effect - fixed positioning */}
            <circle
              cx={selectedCoordinate.x}
              cy={selectedCoordinate.y}
              r="25"
              fill="none"
              stroke="var(--color-accent)"
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

            {/* Main marker - static */}
            <circle
              cx={selectedCoordinate.x}
              cy={selectedCoordinate.y}
              r="15"
              fill="var(--color-accent)"
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

            {/* Coordinate label - improved positioning */}
            <text
              x={selectedCoordinate.x}
              y={selectedCoordinate.y - 30}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
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

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={zoomIn}
          className="p-3 rounded-lg shadow-lg transition-all hover:scale-110 font-bold text-lg"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            color: "var(--color-text-primary)",
          }}
          title="ズームイン"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="p-3 rounded-lg shadow-lg transition-all hover:scale-110 font-bold text-lg"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            color: "var(--color-text-primary)",
          }}
          title="ズームアウト"
        >
          −
        </button>
        <button
          onClick={resetZoom}
          className="p-2 rounded-lg shadow-lg transition-all hover:scale-110 text-xs font-medium"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            color: "var(--color-text-primary)",
          }}
          title="リセット"
        >
          🎯
        </button>
      </div>

      {/* Instructions overlay */}
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

      {/* Scale indicator */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-xs">
        ズーム: {(zoomPan.scale * 100).toFixed(0)}%
      </div>

      {/* Building legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs max-w-48">
        <div
          className="font-bold mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          🏢 主要な建物
        </div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {buildings.slice(0, 6).map((building) => (
            <div key={building.id} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span style={{ color: "var(--color-text-secondary)" }}>
                {building.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapController;
