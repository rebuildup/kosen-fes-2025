import { useRef, useEffect, useState, useCallback } from "react";
import { useSimpleMapZoomPan } from "../../hooks/useMapZoomPan";
import { CAMPUS_MAP_BOUNDS } from "../../data/buildings";
import ZoomControls from "./ZoomControls";
import amenities from "../../data/mapAmenities";

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
  type: string;
  coordinates: Coordinate;
  isSelected?: boolean;
  isHovered?: boolean;
}

interface SimpleMapProps {
  // 基本設定
  mode?: "display" | "detail" | "interactive";
  height?: string;
  className?: string;

  // マーカーとコンテンツ
  markers?: LocationMarker[];
  contentItems?: ContentItem[];

  // ハイライト
  highlightCoordinate?: Coordinate;
  selectedCoordinate?: Coordinate | null;

  // インタラクション
  onCoordinateSelect?: (coordinate: Coordinate) => void;
  onLocationHover?: (location: string | null) => void;
  onLocationSelect?: (location: string | null) => void;

  // 設定
  showZoomControls?: boolean;
  allowCoordinateSelection?: boolean;
  initialZoom?: number;
  maxZoom?: number;
  minZoom?: number;
}

const SimpleMap = ({
  mode = "display",
  height = "400px",
  className = "",
  markers = [],
  contentItems = [],
  highlightCoordinate,
  selectedCoordinate,
  onCoordinateSelect,
  onLocationHover: _onLocationHover,
  onLocationSelect: _onLocationSelect,
  showZoomControls = true,
  allowCoordinateSelection = false,
  initialZoom = 1,
  maxZoom = 10,
  minZoom = 0.1,
}: SimpleMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [svgLoadError, setSvgLoadError] = useState<string | null>(null);

  // ズーム・パン機能
  const {
    containerRef,
    contentRef,
    transform,
    isDragging,
    zoomIn,
    zoomOut,
    resetTransform,
    zoomToPoint,
    screenToSVG,
    handleMouseDown,
    handleTouchStart,
  } = useSimpleMapZoomPan({
    width: CAMPUS_MAP_BOUNDS.width,
    height: CAMPUS_MAP_BOUNDS.height,
    minScale: minZoom,
    maxScale: maxZoom,
    initialScale: initialZoom,
  });

  // SVG読み込み
  useEffect(() => {
    const loadSVG = async () => {
      try {
        const response = await fetch("./campus-map.svg");
        if (!response.ok) {
          throw new Error("SVGファイルの読み込みに失敗しました");
        }
        const svgText = await response.text();
        setSvgContent(svgText);
        setSvgLoadError(null);
      } catch (error) {
        console.error("SVG loading error:", error);
        setSvgLoadError("マップの読み込みに失敗しました");
      }
    };

    loadSVG();
  }, []);

  // クリックハンドラー
  const handleSVGClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (isDragging) return;

      if (
        (mode === "interactive" || allowCoordinateSelection) &&
        onCoordinateSelect
      ) {
        const svgPoint = screenToSVG(e.clientX, e.clientY);
        onCoordinateSelect(svgPoint);
      }
    },
    [
      isDragging,
      mode,
      allowCoordinateSelection,
      onCoordinateSelect,
      screenToSVG,
    ]
  );

  // 固定サイズ計算 - ズームに関係なく常に読みやすいサイズ
  const getFixedMarkerSize = useCallback(
    (baseSize: number) => {
      // ズームレベルに応じた適切なサイズ（最小・最大制限付き）
      const scaledSize = baseSize / transform.scale;
      return Math.max(Math.min(scaledSize, baseSize * 3), baseSize * 0.3);
    },
    [transform.scale]
  );

  const getFixedStrokeWidth = useCallback(
    (baseWidth: number) => {
      const scaledWidth = baseWidth / transform.scale;
      return Math.max(Math.min(scaledWidth, baseWidth * 2), 0.5);
    },
    [transform.scale]
  );

  // 固定テキストサイズ - 常に読みやすい大きさ
  const getFixedTextSize = useCallback(() => {
    // ズームレベルに応じて段階的にサイズを調整
    const scale = transform.scale;
    if (scale >= 4) return 16; // 高ズーム時は大きく
    if (scale >= 2) return 14; // 中ズーム
    if (scale >= 1) return 12; // 標準
    if (scale >= 0.5) return 10; // 縮小時
    return 8; // 最小
  }, [transform.scale]);

  // ハイライト座標への自動ズーム
  useEffect(() => {
    if (highlightCoordinate && mode === "detail") {
      const timer = setTimeout(() => {
        zoomToPoint(highlightCoordinate, 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [highlightCoordinate, mode, zoomToPoint]);

  if (svgLoadError) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-red-500 mb-2">{svgLoadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>マップを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        height,
        cursor: isDragging
          ? "grabbing"
          : allowCoordinateSelection || mode === "interactive"
          ? "crosshair"
          : "grab",
      }}
    >
      {/* ズームコントロール */}
      {showZoomControls && (
        <ZoomControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={resetTransform}
          scale={transform.scale}
          minScale={minZoom}
          maxScale={maxZoom}
        />
      )}

      {/* マップコンテンツ */}
      <div
        ref={contentRef}
        style={{
          transformOrigin: "0 0",
          width: CAMPUS_MAP_BOUNDS.width,
          height: CAMPUS_MAP_BOUNDS.height,
          willChange: "transform",
          backfaceVisibility: "hidden",
          perspective: "1000px",
          imageRendering: "crisp-edges",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* ベースSVGマップ */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CAMPUS_MAP_BOUNDS.width} ${CAMPUS_MAP_BOUNDS.height}`}
          width={CAMPUS_MAP_BOUNDS.width}
          height={CAMPUS_MAP_BOUNDS.height}
          onClick={handleSVGClick}
          style={{
            display: "block",
            shapeRendering: "geometricPrecision",
            textRendering: "geometricPrecision",
            imageRendering: "crisp-edges",
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* オーバーレイSVG（マーカーなど） */}
        <svg
          viewBox={`0 0 ${CAMPUS_MAP_BOUNDS.width} ${CAMPUS_MAP_BOUNDS.height}`}
          width={CAMPUS_MAP_BOUNDS.width}
          height={CAMPUS_MAP_BOUNDS.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            shapeRendering: "geometricPrecision",
            textRendering: "geometricPrecision",
          }}
        >
          {/* コンテンツアイテムマーカー */}
          {contentItems.map((item) => (
            <g key={item.id}>
              <circle
                cx={item.coordinates.x}
                cy={item.coordinates.y}
                r={getFixedMarkerSize(item.isSelected ? 12 : 8)}
                fill={
                  item.type === "event"
                    ? "#405de6"
                    : item.type === "exhibit"
                    ? "#8b5cf6"
                    : item.type === "stall"
                    ? "#fcaf45"
                    : "#8e8e8e"
                }
                stroke="white"
                strokeWidth={getFixedStrokeWidth(2)}
                opacity={item.isHovered ? 1 : 0.8}
                className="map-marker-ultra-quality"
              />
              <text
                x={item.coordinates.x}
                y={item.coordinates.y - getFixedMarkerSize(15)}
                textAnchor="middle"
                fontSize={getFixedTextSize()}
                fontWeight="700"
                fill="#1f2937"
                className="map-text-ultra-quality"
                style={{
                  stroke: "white",
                  strokeWidth: getFixedStrokeWidth(1.2),
                }}
              >
                {item.title.length > 8
                  ? item.title.substring(0, 8) + "..."
                  : item.title}
              </text>
            </g>
          ))}

          {/* ロケーションマーカー */}
          {markers.map((marker) => (
            <g key={marker.id}>
              <circle
                cx={marker.coordinates.x}
                cy={marker.coordinates.y}
                r={getFixedMarkerSize(marker.isSelected ? 15 : 12)}
                fill={marker.isSelected ? "#405de6" : "#0066cc"}
                stroke="white"
                strokeWidth={getFixedStrokeWidth(3)}
                opacity={marker.isHovered ? 1 : 0.8}
              />
              <text
                x={marker.coordinates.x}
                y={marker.coordinates.y - getFixedMarkerSize(18)}
                textAnchor="middle"
                fontSize={getFixedTextSize()}
                fontWeight="700"
                fill="#1f2937"
                className="map-text-ultra-quality"
                style={{
                  stroke: "white",
                  strokeWidth: getFixedStrokeWidth(1.2),
                }}
              >
                {marker.location.length > 6
                  ? marker.location.substring(0, 6) + "..."
                  : marker.location}
              </text>
            </g>
          ))}

          {/* ハイライト座標 */}
          {highlightCoordinate && (
            <g>
              <circle
                cx={highlightCoordinate.x}
                cy={highlightCoordinate.y}
                r={getFixedMarkerSize(14)}
                fill="#8b5cf6"
                stroke="white"
                strokeWidth={getFixedStrokeWidth(3)}
                opacity="0.9"
              />
              <circle
                cx={highlightCoordinate.x}
                cy={highlightCoordinate.y}
                r={getFixedMarkerSize(7)}
                fill="white"
                opacity="0.8"
              />
            </g>
          )}

          {/* 選択された座標 */}
          {selectedCoordinate && (
            <g>
              <circle
                cx={selectedCoordinate.x}
                cy={selectedCoordinate.y}
                r={getFixedMarkerSize(12)}
                fill="#f59e0b"
                stroke="white"
                strokeWidth={getFixedStrokeWidth(3)}
                opacity="0.9"
              />
              <circle
                cx={selectedCoordinate.x}
                cy={selectedCoordinate.y}
                r={getFixedMarkerSize(6)}
                fill="white"
                opacity="0.9"
              />
              <text
                x={selectedCoordinate.x}
                y={selectedCoordinate.y - getFixedMarkerSize(18)}
                textAnchor="middle"
                fontSize={getFixedTextSize()}
                fontWeight="700"
                fill="#1f2937"
                className="map-text-ultra-quality"
                style={{
                  stroke: "white",
                  strokeWidth: getFixedStrokeWidth(1.2),
                }}
              >
                選択位置
              </text>
            </g>
          )}

          {/* 施設アメニティ（トイレ・ゴミ箱など） */}
          {amenities.map((a) => {
            const ax = a.x * CAMPUS_MAP_BOUNDS.width;
            const ay = a.y * CAMPUS_MAP_BOUNDS.height;
            const size = getFixedMarkerSize(10);
            if (a.type === "toilet") {
              return (
                <g key={a.id} pointerEvents="auto" className="map-amenity">
                  <rect
                    x={ax - size / 2}
                    y={ay - size / 2}
                    width={size}
                    height={size}
                    rx={2}
                    fill="#1da1f2"
                    stroke="white"
                    strokeWidth={getFixedStrokeWidth(1.5)}
                    opacity={0.95}
                  />
                  <text
                    x={ax}
                    y={ay + size / 4}
                    textAnchor="middle"
                    fontSize={getFixedTextSize() - 2}
                    fontWeight={700}
                    fill="white"
                    className="map-text-ultra-quality"
                  >
                    WC
                  </text>
                </g>
              );
            }

            if (a.type === "trash") {
              return (
                <g key={a.id} pointerEvents="auto" className="map-amenity">
                  <rect
                    x={ax - size / 2}
                    y={ay - size / 2}
                    width={size}
                    height={size}
                    rx={2}
                    fill="#10b981"
                    stroke="white"
                    strokeWidth={getFixedStrokeWidth(1.5)}
                    opacity={0.95}
                  />
                  <text
                    x={ax}
                    y={ay + size / 4}
                    textAnchor="middle"
                    fontSize={getFixedTextSize() - 2}
                    fontWeight={700}
                    fill="white"
                    className="map-text-ultra-quality"
                  >
                    🗑
                  </text>
                </g>
              );
            }

            return null;
          })}
        </svg>
      </div>
      {/* レジェンド */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 12,
          bottom: 12,
          zIndex: 30,
          background: "rgba(255,255,255,0.95)",
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.06)",
          fontSize: 12,
        }}
        className="map-legend glass-effect"
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span
              style={{
                width: 12,
                height: 12,
                background: "#1da1f2",
                borderRadius: 2,
              }}
            />
            <span>トイレ</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                background: "#10b981",
                borderRadius: 2,
              }}
            />
            <span>ゴミ箱</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;
