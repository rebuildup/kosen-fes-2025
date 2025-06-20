import { useRef, useEffect, useState, useCallback, useMemo } from "react";
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
  type: string;
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
  markers: _markers = [],
  locations: _locations = [],
  hoveredLocation,
  selectedLocation,
  onLocationHover: _onLocationHover,
  onLocationSelect: _onLocationSelect,
  contentItems = [],
  onContentItemHover: _onContentItemHover,
  onContentItemSelect: _onContentItemSelect,
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
  const [svgLoadError, setSvgLoadError] = useState<string | null>(null);
  const [currentScale, setCurrentScale] = useState(initialZoom);

  // 入力状態の管理
  const [isDragging, setIsDragging] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(
    null
  );
  const [lastTouchCenter, setLastTouchCenter] = useState<Coordinate | null>(
    null
  );

  // Initialize zoom/pan functionality
  const {
    svgRef,
    zoomIn,
    zoomOut,
    zoomInToCoordinate,
    zoomOutFromCoordinate,
    resetZoom,
    zoomToLocation,
    screenToViewBox,
    pan,
    zoomAtPoint,
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

  // Load SVG content dynamically with improved error handling
  useEffect(() => {
    let isMounted = true;

    const loadSvgContent = async () => {
      try {
        setSvgLoadError(null);

        const response = await fetch("/campus-map.svg");

        if (!response.ok) {
          throw new Error(
            `SVGの読み込みに失敗しました: ${response.status} ${response.statusText}`
          );
        }

        const svgText = await response.text();

        // SVGの基本的な検証
        if (!svgText.includes("<svg") || !svgText.includes("</svg>")) {
          throw new Error("無効なSVGファイルです");
        }

        if (isMounted) {
          setSvgContent(svgText);
        }
      } catch (error) {
        console.error("Failed to load campus map SVG:", error);
        if (isMounted) {
          setSvgLoadError(
            error instanceof Error
              ? error.message
              : "マップの読み込み中にエラーが発生しました"
          );
        }
      }
    };

    loadSvgContent();

    return () => {
      isMounted = false;
    };
  }, []);

  // マーカーのメモ化 - 不要な再計算を防ぐ
  const processedMarkers = useMemo(() => {
    const allMarkers: LocationMarker[] = [..._markers];

    // Legacy location supportを追加
    _locations.forEach((location) => {
      const coords = getBuildingCoordinates(location);
      if (coords) {
        allMarkers.push({
          id: location,
          location,
          coordinates: coords,
          isSelected: selectedLocation === location,
          isHovered: hoveredLocation === location,
        });
      }
    });

    return allMarkers;
  }, [_markers, _locations, selectedLocation, hoveredLocation]);

  // コンテンツアイテムのメモ化
  const processedContentItems = useMemo(() => {
    return contentItems.map((item) => ({
      ...item,
      isSelected: _highlightContentItem === item.id,
    }));
  }, [contentItems, _highlightContentItem]);

  // ユーティリティ関数
  const getTouchDistance = useCallback((touches: TouchList) => {
    if (touches.length < 2) return null;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }, []);

  const getTouchCenter = useCallback((touches: TouchList) => {
    if (touches.length < 2) return null;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  }, []);

  // マウスイベントハンドラー
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!allowInteraction || !mapContainerRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const worldPos = screenToViewBox(e.clientX, e.clientY);

      if (e.deltaY < 0) {
        zoomInToCoordinate(worldPos);
      } else {
        zoomOutFromCoordinate(worldPos);
      }
    },
    [
      allowInteraction,
      screenToViewBox,
      zoomInToCoordinate,
      zoomOutFromCoordinate,
    ]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!allowInteraction || e.button !== 0) return;

      setIsDragging(true);
      setIsTouch(false);

      if (mapContainerRef.current) {
        mapContainerRef.current.style.cursor = "grabbing";
      }

      e.preventDefault();
    },
    [allowInteraction]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || isTouch) return;

      e.preventDefault();
      pan(e.movementX, e.movementY);
    },
    [isDragging, isTouch, pan]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);

    if (mapContainerRef.current) {
      mapContainerRef.current.style.cursor = "grab";
    }
  }, []);

  // タッチイベントハンドラー
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!allowInteraction) return;

      setIsTouch(true);
      e.preventDefault();

      if (e.touches.length === 2) {
        // ピンチズーム開始
        const distance = getTouchDistance(e.touches);
        const center = getTouchCenter(e.touches);
        setLastTouchDistance(distance);
        setLastTouchCenter(center);
      } else if (e.touches.length === 1) {
        // ドラッグ開始
        setIsDragging(true);
      }
    },
    [allowInteraction, getTouchDistance, getTouchCenter]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!allowInteraction || !isTouch) return;

      e.preventDefault();

      if (e.touches.length === 2 && lastTouchDistance && lastTouchCenter) {
        // ピンチズーム
        const currentDistance = getTouchDistance(e.touches);
        const currentCenter = getTouchCenter(e.touches);

        if (currentDistance && currentCenter) {
          const scale = currentDistance / lastTouchDistance;
          const worldCenter = screenToViewBox(currentCenter.x, currentCenter.y);

          // ズーム実行
          zoomAtPoint(worldCenter, currentScale * scale, false);

          // パン実行（中心点の移動）
          const deltaX = currentCenter.x - lastTouchCenter.x;
          const deltaY = currentCenter.y - lastTouchCenter.y;
          pan(deltaX, deltaY);

          setLastTouchDistance(currentDistance);
          setLastTouchCenter(currentCenter);
        }
      } else if (e.touches.length === 1 && isDragging) {
        // シングルタッチドラッグ
        const touch = e.touches[0];
        const movement = {
          x: touch.clientX - (lastTouchCenter?.x || touch.clientX),
          y: touch.clientY - (lastTouchCenter?.y || touch.clientY),
        };

        pan(movement.x, movement.y);
        setLastTouchCenter({ x: touch.clientX, y: touch.clientY });
      }
    },
    [
      allowInteraction,
      isTouch,
      lastTouchDistance,
      lastTouchCenter,
      isDragging,
      getTouchDistance,
      getTouchCenter,
      screenToViewBox,
      zoomAtPoint,
      currentScale,
      pan,
    ]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setLastTouchDistance(null);
    setLastTouchCenter(null);
  }, []);

  // イベントリスナーの設定
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || !allowInteraction) return;

    // マウスイベント
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", handleMouseDown, {
      passive: false,
    });
    document.addEventListener("mousemove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp, { passive: false });

    // タッチイベント
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    allowInteraction,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // マップクリックハンドラー - interactiveモードでも機能するよう修正
  const handleMapClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (isDragging) return; // ドラッグ中はクリックを無視

      // interactiveモードまたはallowCoordinateSelectionが有効な場合
      if (
        (mode === "interactive" || allowCoordinateSelection) &&
        onCoordinateSelect
      ) {
        const worldPos = screenToViewBox(e.clientX, e.clientY);
        onCoordinateSelect(worldPos);
      }
    },
    [
      isDragging,
      mode,
      allowCoordinateSelection,
      onCoordinateSelect,
      screenToViewBox,
    ]
  );

  // フォーカス関連のエフェクト - デバウンス処理を追加
  useEffect(() => {
    if (highlightCoordinate) {
      const timer = setTimeout(() => {
        zoomToLocation(highlightCoordinate.x, highlightCoordinate.y, 4);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [highlightCoordinate, zoomToLocation]);

  useEffect(() => {
    if (selectedCoordinate) {
      const timer = setTimeout(() => {
        zoomToLocation(selectedCoordinate.x, selectedCoordinate.y, 3);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedCoordinate, zoomToLocation]);

  // Legacy location support
  useEffect(() => {
    if (selectedLocation) {
      const coords = getBuildingCoordinates(selectedLocation);
      if (coords) {
        const timer = setTimeout(() => {
          zoomToLocation(coords.x, coords.y, 4);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedLocation, zoomToLocation]);

  useEffect(() => {
    if (hoveredLocation && !selectedLocation) {
      const coords = getBuildingCoordinates(hoveredLocation);
      if (coords) {
        const timer = setTimeout(() => {
          zoomToLocation(coords.x, coords.y, 3);
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [hoveredLocation, selectedLocation, zoomToLocation]);

  // マーカーサイズ計算
  const getMarkerSize = useCallback(
    (baseSize: number = 20) => {
      const scaledSize = baseSize / currentScale;
      return Math.max(8, Math.min(50, scaledSize));
    },
    [currentScale]
  );

  const getTextSize = useCallback(
    (baseSize: number = 12) => {
      const scaledSize = baseSize / currentScale;
      return Math.max(6, Math.min(20, scaledSize));
    },
    [currentScale]
  );

  const getStrokeWidth = useCallback(
    (baseWidth: number = 1) => {
      return baseWidth / currentScale;
    },
    [currentScale]
  );

  // マップレンダリング
  const renderMapWithOverlays = () => {
    if (svgLoadError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-red-50 rounded-lg border-2 border-red-200">
          <div className="text-red-600 mb-2">⚠️ マップの読み込みエラー</div>
          <div className="text-red-500 text-sm">{svgLoadError}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            再読み込み
          </button>
        </div>
      );
    }

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
              : isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
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
          style={{ touchAction: "none" }}
        >
          {/* Content Items */}
          {processedContentItems.map((item) => (
            <g key={item.id} className="content-item">
              <circle
                cx={item.coordinates.x}
                cy={item.coordinates.y}
                r={getMarkerSize(item.isSelected ? 26 : 20)}
                fill={
                  item.type === "event"
                    ? "var(--color-accent, #405de6)"
                    : item.type === "exhibit"
                    ? "var(--color-secondary, #8b5cf6)"
                    : item.type === "stall"
                    ? "var(--color-warning, #fcaf45)"
                    : "var(--color-text-secondary, #8e8e8e)"
                }
                stroke="white"
                strokeWidth={getStrokeWidth(2)}
                opacity={item.isHovered ? 1 : 0.8}
              />
              <text
                x={item.coordinates.x}
                y={item.coordinates.y - getMarkerSize(28)}
                textAnchor="middle"
                fontSize={getTextSize(10)}
                fontWeight="bold"
                fill="var(--color-text-primary, #262626)"
                className="pointer-events-none"
              >
                {item.title.length > 10
                  ? item.title.substring(0, 10) + "..."
                  : item.title}
              </text>
            </g>
          ))}

          {/* Location Markers */}
          {processedMarkers.map((marker) => (
            <g key={marker.id} className="location-marker">
              <circle
                cx={marker.coordinates.x}
                cy={marker.coordinates.y}
                r={getMarkerSize(marker.isSelected ? 30 : 24)}
                fill={
                  marker.isSelected
                    ? "var(--color-accent, #405de6)"
                    : "var(--color-primary, #0066cc)"
                }
                stroke="white"
                strokeWidth={getStrokeWidth(3)}
                opacity={marker.isHovered ? 1 : 0.8}
              />
              <text
                x={marker.coordinates.x}
                y={marker.coordinates.y - getMarkerSize(32)}
                textAnchor="middle"
                fontSize={getTextSize(9)}
                fontWeight="bold"
                fill="var(--color-text-primary, #262626)"
                className="pointer-events-none"
              >
                {marker.location.length > 8
                  ? marker.location.substring(0, 8) + "..."
                  : marker.location}
              </text>
            </g>
          ))}

          {/* Highlight Coordinate Marker */}
          {highlightCoordinate && (
            <g className="highlight-marker">
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
            <g className="coordinate-marker">
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
        </svg>
      </div>
    );
  };

  return (
    <div
      ref={mapContainerRef}
      className={`relative ${className} map-container`}
      style={{
        height,
        touchAction: "none",
        cursor: allowInteraction
          ? isDragging
            ? "grabbing"
            : "grab"
          : "default",
      }}
    >
      {/* Zoom Controls */}
      {showZoomControls && (
        <ZoomControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
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
