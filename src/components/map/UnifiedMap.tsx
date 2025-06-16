import { useRef, useEffect, useState, useCallback } from "react";
import { useMapZoomPan } from "../../hooks/useMapZoomPan";
import { CAMPUS_MAP_BOUNDS } from "../../data/buildings";
import gsap from "gsap";

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
  const overlayRef = useRef<SVGSVGElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [currentScale, setCurrentScale] = useState(initialZoom);

  // Initialize zoom/pan functionality
  const { svgRef, zoomPan, zoomIn, zoomOut, resetZoom, zoomToLocation } =
    useMapZoomPan({
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

  // Calculate marker size based on actual current scale
  const getMarkerSize = (baseSize: number = 20) => {
    // ズームレベルに応じてサイズを調整（最小10px、最大40px）
    const scaledSize = baseSize / currentScale;
    return Math.max(10, Math.min(40, scaledSize));
  };

  // Calculate text size based on actual current scale
  const getTextSize = (baseSize: number = 12) => {
    const scaledSize = baseSize / currentScale;
    return Math.max(8, Math.min(16, scaledSize));
  };

  // Calculate stroke width based on actual current scale
  const getStrokeWidth = (baseWidth: number = 1) => {
    return baseWidth / currentScale;
  };

  // Handle coordinate selection for interactive mode
  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!allowInteraction || mode !== "interactive" || isDragging) return;

    const svg = event.currentTarget;
    const container = mapContainerRef.current;
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

      console.log("Matrix-based click coordinates:", {
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

      onCoordinateSelect?.({ x: clampedX, y: clampedY });
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

      console.log("Fallback click coordinates:", {
        screen: { x: clickX, y: clickY },
        svg: { x: svgX, y: svgY },
        clamped: { x: clampedX, y: clampedY },
        actualTransform: { scale: actualScale, x: actualX, y: actualY },
      });

      onCoordinateSelect?.({ x: clampedX, y: clampedY });
    }
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
            <p style={{ color: "var(--color-text-secondary)" }}>
              Loading map...
            </p>
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

        {/* Overlay markers and interactive elements - ズーム・パンに正しく追従 */}
        {svgContent && (
          <svg
            ref={overlayRef}
            viewBox={CAMPUS_MAP_BOUNDS.viewBox}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {/* Location markers for display mode */}
            {mode === "display" &&
              markers.map((marker) => {
                const markerSize = getMarkerSize(
                  marker.isSelected ? 30 : marker.isHovered ? 25 : 20
                );
                const textSize = getTextSize(12);

                return (
                  <g
                    key={marker.id}
                    className="location-marker pointer-events-auto"
                    onMouseEnter={() => onLocationHover?.(marker.location)}
                    onMouseLeave={() => onLocationHover?.(null)}
                    onClick={() => onLocationSelect?.(marker.location)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* ピンの影 */}
                    <circle
                      cx={marker.coordinates.x + 2}
                      cy={marker.coordinates.y + 2}
                      r={markerSize}
                      fill="rgba(0,0,0,0.2)"
                      opacity="0.5"
                    />

                    {/* メインピン */}
                    <circle
                      cx={marker.coordinates.x}
                      cy={marker.coordinates.y}
                      r={markerSize}
                      fill={
                        marker.isSelected
                          ? "var(--primary)"
                          : marker.isHovered
                          ? "var(--primary-light)"
                          : "var(--secondary)"
                      }
                      stroke="white"
                      strokeWidth={getStrokeWidth(3)}
                      style={{
                        filter: marker.isSelected
                          ? "drop-shadow(0 0 10px var(--primary))"
                          : "none",
                        transition: "all 0.3s ease",
                      }}
                    />

                    {/* 内側のドット */}
                    <circle
                      cx={marker.coordinates.x}
                      cy={marker.coordinates.y}
                      r={markerSize * 0.3}
                      fill="white"
                    />

                    {/* ラベル */}
                    <text
                      x={marker.coordinates.x}
                      y={marker.coordinates.y - markerSize - 5}
                      textAnchor="middle"
                      fontSize={textSize}
                      fontWeight="500"
                      fill="var(--color-text-primary)"
                      stroke="white"
                      strokeWidth={getStrokeWidth(2)}
                      paintOrder="stroke"
                      className="pointer-events-none"
                    >
                      {marker.location.split(",")[0]}
                    </text>
                  </g>
                );
              })}

            {/* Highlight marker for detail mode */}
            {mode === "detail" && highlightCoordinate && (
              <g>
                {/* アニメーション付きリップル効果 */}
                <circle
                  cx={highlightCoordinate.x}
                  cy={highlightCoordinate.y}
                  r={getMarkerSize(30)}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth={getStrokeWidth(2)}
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values={`${getMarkerSize(30)};${getMarkerSize(
                      50
                    )};${getMarkerSize(30)}`}
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

                {/* メインマーカー */}
                <circle
                  cx={highlightCoordinate.x}
                  cy={highlightCoordinate.y}
                  r={getMarkerSize(25)}
                  fill="var(--primary)"
                  stroke="white"
                  strokeWidth={getStrokeWidth(4)}
                  style={{
                    filter: "drop-shadow(0 0 15px var(--primary))",
                  }}
                />

                {/* 中央のドット */}
                <circle
                  cx={highlightCoordinate.x}
                  cy={highlightCoordinate.y}
                  r={getMarkerSize(8)}
                  fill="white"
                />

                {/* ラベル */}
                <text
                  x={highlightCoordinate.x}
                  y={highlightCoordinate.y - getMarkerSize(25) - 10}
                  textAnchor="middle"
                  fontSize={getTextSize(14)}
                  fontWeight="bold"
                  fill="var(--primary)"
                  stroke="white"
                  strokeWidth={getStrokeWidth(3)}
                  paintOrder="stroke"
                >
                  {highlightLocation?.split(",")[0]}
                </text>
              </g>
            )}

            {/* Selected coordinate marker for interactive mode */}
            {mode === "interactive" && selectedCoordinate && (
              <g>
                {/* リップル効果 */}
                <circle
                  cx={selectedCoordinate.x}
                  cy={selectedCoordinate.y}
                  r={getMarkerSize(25)}
                  fill="none"
                  stroke="var(--primary)"
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

                {/* メインマーカー */}
                <circle
                  cx={selectedCoordinate.x}
                  cy={selectedCoordinate.y}
                  r={getMarkerSize(15)}
                  fill="var(--primary)"
                  stroke="white"
                  strokeWidth={getStrokeWidth(3)}
                  style={{
                    filter: "drop-shadow(0 0 8px var(--primary))",
                  }}
                />

                {/* 中央のドット */}
                <circle
                  cx={selectedCoordinate.x}
                  cy={selectedCoordinate.y}
                  r={getMarkerSize(4)}
                  fill="white"
                />

                {/* 座標ラベル */}
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
                  ({selectedCoordinate.x.toFixed(0)},{" "}
                  {selectedCoordinate.y.toFixed(0)})
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
