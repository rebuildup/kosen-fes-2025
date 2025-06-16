import { useRef, useEffect, useState, useCallback } from "react";
import { CAMPUS_MAP_BOUNDS, buildings } from "../../data/buildings";
import { useMapZoomPan } from "../../hooks/useMapZoomPan";
import gsap from "gsap";

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
  const [currentScale, setCurrentScale] = useState(1);

  const { svgRef, zoomPan, zoomIn, zoomOut, resetZoom, zoomToLocation } =
    useMapZoomPan({
      minScale: 0.5,
      maxScale: 8,
      initialScale: 1,
      mapWidth: CAMPUS_MAP_BOUNDS.width,
      mapHeight: CAMPUS_MAP_BOUNDS.height,
      containerRef: mapRef,
      onTransformUpdate: useCallback((scale: number) => {
        setCurrentScale(scale);
      }, []),
    });

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

  // Handle map click for coordinate selection
  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) return; // Don't select if user was dragging

    const svg = event.currentTarget;
    const container = mapRef.current;
    if (!container || !svgRef.current) return;

    try {
      // SVGの現在の変換行列を取得
      const svgMatrix = svg.getScreenCTM();
      if (!svgMatrix) {
        console.warn("Could not get SVG screen CTM");
        return;
      }

      // マウスの絶対座標を取得
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;

      // 変換行列を使用してSVG座標系に変換
      const svgPoint = point.matrixTransform(svgMatrix.inverse());

      // 座標を境界内にクランプ
      const clampedX = Math.max(
        0,
        Math.min(CAMPUS_MAP_BOUNDS.width, svgPoint.x)
      );
      const clampedY = Math.max(
        0,
        Math.min(CAMPUS_MAP_BOUNDS.height, svgPoint.y)
      );

      console.log("Interactive Matrix-based click coordinates:", {
        clientCoords: { x: event.clientX, y: event.clientY },
        svgMatrix: {
          a: svgMatrix.a,
          b: svgMatrix.b,
          c: svgMatrix.c,
          d: svgMatrix.d,
          e: svgMatrix.e,
          f: svgMatrix.f,
        },
        svgPoint: { x: svgPoint.x, y: svgPoint.y },
        clamped: { x: clampedX, y: clampedY },
        bounds: CAMPUS_MAP_BOUNDS,
      });

      onCoordinateSelect({ x: clampedX, y: clampedY });
    } catch (error) {
      console.warn(
        "SVG matrix transform failed, falling back to manual calculation:",
        error
      );

      // フォールバック: 手動計算
      const containerRect = container.getBoundingClientRect();
      const clickX = event.clientX - containerRect.left;
      const clickY = event.clientY - containerRect.top;

      const actualScale =
        (gsap.getProperty(svgRef.current!, "scaleX") as number) || currentScale;
      const actualX = (gsap.getProperty(svgRef.current!, "x") as number) || 0;
      const actualY = (gsap.getProperty(svgRef.current!, "y") as number) || 0;

      const viewBoxWidth = CAMPUS_MAP_BOUNDS.width;
      const viewBoxHeight = CAMPUS_MAP_BOUNDS.height;
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      const scaleX = containerWidth / viewBoxWidth;
      const scaleY = containerHeight / viewBoxHeight;
      const uniformScale = Math.min(scaleX, scaleY);

      const scaledViewBoxWidth = viewBoxWidth * uniformScale;
      const scaledViewBoxHeight = viewBoxHeight * uniformScale;
      const offsetX = (containerWidth - scaledViewBoxWidth) / 2;
      const offsetY = (containerHeight - scaledViewBoxHeight) / 2;

      const adjustedClickX = clickX - offsetX;
      const adjustedClickY = clickY - offsetY;

      const preTransformX = (adjustedClickX - actualX) / actualScale;
      const preTransformY = (adjustedClickY - actualY) / actualScale;

      const svgX = preTransformX / uniformScale;
      const svgY = preTransformY / uniformScale;

      const clampedX = Math.max(0, Math.min(CAMPUS_MAP_BOUNDS.width, svgX));
      const clampedY = Math.max(0, Math.min(CAMPUS_MAP_BOUNDS.height, svgY));

      console.log("Interactive Fallback click coordinates:", {
        screen: { x: clickX, y: clickY },
        svg: { x: svgX, y: svgY },
        clamped: { x: clampedX, y: clampedY },
        actualTransform: { scale: actualScale, x: actualX, y: actualY },
      });

      onCoordinateSelect({ x: clampedX, y: clampedY });
    }
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
              .building { fill: #d1d5db; stroke: #9ca3af; }
              .location-text { fill: #065f46; font-weight: bold; }
              .selected-marker { 
                filter: drop-shadow(0 0 12px var(--color-accent));
              }
              .marker-ring {
                fill: none;
                stroke: var(--color-accent);
                opacity: 0.6;
                animation: ripple 2s infinite;
              }
              @keyframes ripple {
                0% { r: ${getMarkerSize(20)}; opacity: 0.6; }
                100% { r: ${getMarkerSize(40)}; opacity: 0; }
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
                  strokeWidth: getStrokeWidth(1),
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
                  fontSize: getTextSize(10),
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
              strokeWidth={getStrokeWidth(1)}
              opacity="0.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Selected coordinate marker */}
        {selectedCoordinate && (
          <g className="selected-marker">
            {/* Ripple effect - 動的サイズ */}
            <circle
              cx={selectedCoordinate.x}
              cy={selectedCoordinate.y}
              r={getMarkerSize(25)}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={getStrokeWidth(2)}
              opacity="0.6"
            >
              <animate
                attributeName="r"
                values={`${getMarkerSize(25)};${getMarkerSize(
                  45
                )};${getMarkerSize(25)}`}
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

            {/* Main marker - 動的サイズ */}
            <circle
              cx={selectedCoordinate.x}
              cy={selectedCoordinate.y}
              r={getMarkerSize(15)}
              fill="var(--color-accent)"
              stroke="white"
              strokeWidth={getStrokeWidth(3)}
              style={{
                filter: "drop-shadow(0 0 8px var(--color-accent))",
              }}
            />

            {/* Center dot - 動的サイズ */}
            <circle
              cx={selectedCoordinate.x}
              cy={selectedCoordinate.y}
              r={getMarkerSize(4)}
              fill="white"
            />

            {/* Coordinate label - 動的サイズとズームに応じた位置調整 */}
            <text
              x={selectedCoordinate.x}
              y={selectedCoordinate.y - getMarkerSize(15) - 8}
              textAnchor="middle"
              fontSize={getTextSize(12)}
              fontWeight="bold"
              fill="var(--color-text-primary)"
              stroke="white"
              strokeWidth={getStrokeWidth(2)}
              paintOrder="stroke"
            >
              📍 選択位置
            </text>

            {/* 座標値表示 */}
            <text
              x={selectedCoordinate.x}
              y={selectedCoordinate.y + getMarkerSize(15) + 15}
              textAnchor="middle"
              fontSize={getTextSize(10)}
              fill="var(--color-text-secondary)"
              stroke="white"
              strokeWidth={getStrokeWidth(1)}
              paintOrder="stroke"
            >
              X={selectedCoordinate.x.toFixed(1)}, Y=
              {selectedCoordinate.y.toFixed(1)}
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
