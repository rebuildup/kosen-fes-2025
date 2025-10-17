import type { CSSProperties } from "react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ItemTypeIcon from "../../components/common/ItemTypeIcon";
import { useLanguage } from "../../context/LanguageContext";
import { CAMPUS_MAP_BOUNDS } from "../../data/buildings";
import { UnifiedCard } from "../../shared/components/ui/UnifiedCard";
import type { Item } from "../../types/common";
import { MapPin, ClusterPin, HighlightPin } from "./MapPin";
import ZoomControls from "./ZoomControls";

const ADJUSTED_MAP_BOUNDS = {
  height: 800,
  marginX: 50,
  marginY: 40,
  width: 1100,
};

interface Coordinate {
  x: number;
  y: number;
}

interface InteractivePoint {
  id: string;
  coordinates: Coordinate;
  title: string;
  type: "event" | "exhibit" | "stall" | "location" | "toilet" | "trash";
  size?: number;
  color?: string;
  isSelected?: boolean;
  isHovered?: boolean;
  contentItem?: Item;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
}

interface PointCluster {
  id: string;
  coordinates: Coordinate;
  points: InteractivePoint[];
  count: number;
}

interface VectorMapProps {
  // 基本設定
  mode?: "display" | "detail" | "interactive";
  height?: string;
  className?: string;

  // ポイント
  points?: InteractivePoint[];
  highlightPoint?: Coordinate;

  // インタラクション
  onPointClick?: (pointId: string) => void;
  onPointHover?: (pointId: string | null) => void;
  onMapClick?: (coordinate: Coordinate) => void;

  // 設定
  showControls?: boolean;
  enableFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  fullscreenLabel?: string;
  maxZoom?: number;
  minZoom?: number;
  initialZoom?: number; // 追加: 初期ズーム倍率
}

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const computeFittedViewBox = (
  points: InteractivePoint[],
  zoom: number,
): ViewBox => {
  const mapWidth = CAMPUS_MAP_BOUNDS.width;
  const mapHeight = CAMPUS_MAP_BOUNDS.height;
  const targetWidth = mapWidth / zoom;
  const targetHeight = mapHeight / zoom;

  let centerX = mapWidth / 2;
  let centerY = mapHeight / 2;

  if (points.length > 0) {
    const xs = points.map((p) => p.coordinates.x);
    const ys = points.map((p) => p.coordinates.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    centerX = (minX + maxX) / 2;
    centerY = (minY + maxY) / 2;
  }

  const horizontalPadding = mapWidth * 0.2;
  const verticalPadding = mapHeight * 0.2;

  const minX = -horizontalPadding;
  const maxX = mapWidth + horizontalPadding - targetWidth;
  const minY = -verticalPadding;
  const maxY = mapHeight + verticalPadding - targetHeight;

  return {
    height: targetHeight,
    width: targetWidth,
    x: clamp(centerX - targetWidth / 2, minX, maxX),
    y: clamp(centerY - targetHeight / 2, minY, maxY),
  };
};

const resolveInitialViewBox = (
  points: InteractivePoint[],
  mode: VectorMapProps["mode"],
  zoom: number,
): ViewBox => {
  if (mode === "display" && points.length > 0) {
    return computeFittedViewBox(points, zoom);
  }
  return computeFittedViewBox([], zoom);
};

const VectorMap: React.FC<VectorMapProps> = ({
  className = "",
  enableFullscreen = true,
  fullscreenLabel,
  height = "400px",
  highlightPoint,
  initialZoom = 1, // 追加: デフォルト値
  isFullscreen,
  maxZoom = 10,
  minZoom = 0.1,
  mode = "display",
  onMapClick,
  onPointClick,
  onPointHover,
  onToggleFullscreen,
  points = [],
  showControls = true,
}) => {
  const { t } = useLanguage();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const [placeholderHeight, setPlaceholderHeight] = useState<number | null>(
    null,
  );

  const fullscreenEnabled = enableFullscreen !== false;
  const resolvedFullscreen =
    typeof isFullscreen === "boolean" ? isFullscreen : internalFullscreen;
  const resolvedFullscreenLabel =
    fullscreenLabel ??
    (resolvedFullscreen ? t("map.exitFullscreen") : t("map.enterFullscreen"));

  const [viewBox, setViewBox] = useState<ViewBox>(() =>
    resolveInitialViewBox(points, mode, initialZoom),
  );

  // Interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Coordinate>({ x: 0, y: 0 });
  const [dragStartViewBox, setDragStartViewBox] = useState<ViewBox>(viewBox);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // マップ操作中の状態管理（ピン非表示用） - 機能を無効化
  // const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null); // requestAnimationFrame ID

  // Touch state for mobile
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>(initialZoom);

  const handleFullscreenToggle = useCallback(() => {
    if (!fullscreenEnabled) {
      return;
    }

    if (!resolvedFullscreen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.height > 0) {
        setPlaceholderHeight(rect.height);
      }
    }

    if (onToggleFullscreen) {
      onToggleFullscreen();
      return;
    }

    setInternalFullscreen((prev) => !prev);
  }, [fullscreenEnabled, onToggleFullscreen, resolvedFullscreen]);

  useEffect(() => {
    const derivedZoom = CAMPUS_MAP_BOUNDS.width / viewBox.width;
    setCurrentZoomLevel(derivedZoom);
  }, [viewBox.width]);

  useEffect(() => {
    if (resolvedFullscreen) {
      return;
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.height > 0) {
        setPlaceholderHeight((prev) => {
          if (prev === null || Math.abs(prev - rect.height) > 1) {
            return rect.height;
          }
          return prev;
        });
      }
    }
  }, [resolvedFullscreen, height]);

  const [isShiftPressed, setIsShiftPressed] = useState<boolean>(false);

  // Touch interaction state
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [touchStartPos, setTouchStartPos] = useState<Coordinate>({
    x: 0,
    y: 0,
  });
  const [isTouchGesture, setIsTouchGesture] = useState<boolean>(false);

  // Content card state
  const [selectedPoint, setSelectedPoint] = useState<InteractivePoint | null>(
    null,
  );
  const [selectedCluster, setSelectedCluster] = useState<
    InteractivePoint[] | null
  >(null);
  const [cardPosition, setCardPosition] = useState<{
    x: number;
    y: number;
    transform?: string;
    placement?: string;
  }>({ x: 0, y: 0 });

  // Mobile hover simulation state
  const [mobileHoveredPoint, setMobileHoveredPoint] = useState<string | null>(
    null,
  );
  const [lastMobileTapPointId, setLastMobileTapPointId] = useState<
    string | null
  >(null);
  const [lastMobileTapTime, setLastMobileTapTime] = useState<number>(0);

  // マップ操作でカードを閉じる関数
  const closeCard = useCallback(() => {
    if (selectedPoint) {
      setSelectedPoint(null);
    }
    if (selectedCluster) {
      setSelectedCluster(null);
    }
    // Clear mobile hover state
    setMobileHoveredPoint(null);
    setLastMobileTapPointId(null);
  }, [selectedPoint, selectedCluster]);

  // Convert screen coordinates to SVG coordinates with accurate aspect ratio handling
  // SVGの実際の描画領域を計算するヘルパー（viewBox比率と描画領域のズレを調整）
  const getSVGContentRect = useCallback((svgRect: DOMRect) => {
    const originalViewBoxRatio =
      CAMPUS_MAP_BOUNDS.width / CAMPUS_MAP_BOUNDS.height;
    const svgRatio = svgRect.width / svgRect.height;

    let contentWidth: number;
    let contentHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (originalViewBoxRatio > svgRatio) {
      contentWidth = svgRect.width;
      contentHeight = svgRect.width / originalViewBoxRatio;
      offsetX = 0;
      offsetY = (svgRect.height - contentHeight) / 2;
    } else {
      contentWidth = svgRect.height * originalViewBoxRatio;
      contentHeight = svgRect.height;
      offsetX = (svgRect.width - contentWidth) / 2;
      offsetY = 0;
    }

    return { height: contentHeight, offsetX, offsetY, width: contentWidth };
  }, []);

  const screenToSVG = useCallback(
    (screenX: number, screenY: number): Coordinate => {
      if (!svgRef.current) return { x: 0, y: 0 };

      const svgRect = svgRef.current.getBoundingClientRect();

      // スクリーン座標をSVG要素内の相対座標に変換
      const relativeX = screenX - svgRect.left;
      const relativeY = screenY - svgRect.top;

      // Calculate the actual content area within SVG element (considering preserveAspectRatio)
      const contentRect = getSVGContentRect(svgRect);

      // Adjust relative coordinates to account for letterboxing/pillarboxing
      const adjustedRelativeX = relativeX - contentRect.offsetX;
      const adjustedRelativeY = relativeY - contentRect.offsetY;

      // ALWAYS use content area aware transformation for consistent accuracy
      // Content Areaを考慮した座標変換を常に使用
      const svgX =
        viewBox.x + (adjustedRelativeX / contentRect.width) * viewBox.width;
      const svgY =
        viewBox.y + (adjustedRelativeY / contentRect.height) * viewBox.height;

      return { x: svgX, y: svgY };
    },
    [viewBox, getSVGContentRect],
  );

  // SVG座標からコンテナ相対座標への変換（ピン配置用）
  const svgToScreen = useCallback(
    (svgX: number, svgY: number): { x: number; y: number } | null => {
      if (!svgRef.current || !containerRef.current) return null;

      const svgRect = svgRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const contentRect = getSVGContentRect(svgRect);

      // SVG座標からViewBox内の相対位置を計算
      const relativeX = (svgX - viewBox.x) / viewBox.width;
      const relativeY = (svgY - viewBox.y) / viewBox.height;

      // ViewBox相対位置からコンテンツ領域内の位置を計算
      const contentX = contentRect.offsetX + relativeX * contentRect.width;
      const contentY = contentRect.offsetY + relativeY * contentRect.height;

      // SVG要素内の位置を計算
      const svgAbsoluteX = svgRect.left + contentX;
      const svgAbsoluteY = svgRect.top + contentY;

      // コンテナ相対座標に変換（ピンはコンテナ内でposition: absolute）
      const containerRelativeX = svgAbsoluteX - containerRect.left;
      const containerRelativeY = svgAbsoluteY - containerRect.top;

      return { x: containerRelativeX, y: containerRelativeY };
    },
    [viewBox, getSVGContentRect],
  );

  // マップ操作の開始/終了を管理 - 機能を無効化
  const startInteraction = useCallback(() => {
    // ピン非表示機能を無効化したため、何もしない
  }, []);

  const endInteraction = useCallback(() => {
    // ピン非表示機能を無効化したため、何もしない
  }, []);

  // Zoom functions with viewBox precision
  const zoomIn = useCallback(() => {
    startInteraction();
    setViewBox((prev) => {
      const scale = 0.8; // 20% zoom in
      const newWidth = prev.width * scale;
      const newHeight = prev.height * scale;

      // 実際に適用される幅と高さを先に計算（maxZoomによる制限を考慮）
      const actualWidth = Math.max(
        newWidth,
        (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) / maxZoom,
      );
      const actualHeight = Math.max(
        newHeight,
        (ADJUSTED_MAP_BOUNDS.height + ADJUSTED_MAP_BOUNDS.marginY * 2) /
          maxZoom,
      );

      // 現在の中心点を計算
      const centerX = prev.x + prev.width / 2;
      const centerY = prev.y + prev.height / 2;

      // 中心点を保持したまま新しいサイズに調整
      const newX = centerX - actualWidth / 2;
      const newY = centerY - actualHeight / 2;

      console.log("[ZOOM IN]", {
        prev: { x: prev.x, y: prev.y, width: prev.width, height: prev.height },
        center: { centerX, centerY },
        newSize: { newWidth, newHeight },
        actualSize: { actualWidth, actualHeight },
        newPos: { newX, newY },
        wasLimited: newWidth !== actualWidth || newHeight !== actualHeight,
      });

      return {
        height: actualHeight,
        width: actualWidth,
        x: newX,
        y: newY,
      };
    });
    endInteraction();
  }, [maxZoom, startInteraction, endInteraction]);

  const zoomOut = useCallback(() => {
    startInteraction();
    setViewBox((prev) => {
      const scale = 1.25; // 25% zoom out
      const newWidth = prev.width * scale;
      const newHeight = prev.height * scale;

      // 実際に適用される幅と高さを先に計算（minZoomによる制限を考慮）
      const actualWidth = Math.min(
        newWidth,
        (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) / minZoom,
      );
      const actualHeight = Math.min(
        newHeight,
        (ADJUSTED_MAP_BOUNDS.height + ADJUSTED_MAP_BOUNDS.marginY * 2) /
          minZoom,
      );

      // 現在の中心点を計算
      const centerX = prev.x + prev.width / 2;
      const centerY = prev.y + prev.height / 2;

      // 中心点を保持したまま新しいサイズに調整
      const newX = centerX - actualWidth / 2;
      const newY = centerY - actualHeight / 2;

      console.log("[ZOOM OUT]", {
        prev: { x: prev.x, y: prev.y, width: prev.width, height: prev.height },
        center: { centerX, centerY },
        newSize: { newWidth, newHeight },
        actualSize: { actualWidth, actualHeight },
        newPos: { newX, newY },
        wasLimited: newWidth !== actualWidth || newHeight !== actualHeight,
      });

      return {
        height: actualHeight,
        width: actualWidth,
        x: newX,
        y: newY,
      };
    });
    endInteraction();
  }, [minZoom, startInteraction, endInteraction]);

  const resetView = useCallback(() => {
    startInteraction();
    setViewBox(resolveInitialViewBox(points, mode, initialZoom));
    endInteraction();
  }, [points, mode, initialZoom, startInteraction, endInteraction]);

  const zoomToPoint = useCallback(
    (point: Coordinate, zoomLevel: number = 2) => {
      startInteraction();
      const targetWidth = CAMPUS_MAP_BOUNDS.width / zoomLevel;
      const targetHeight = CAMPUS_MAP_BOUNDS.height / zoomLevel;

      // パン制限を考慮した座標計算
      const mapWidth = CAMPUS_MAP_BOUNDS.width;
      const mapHeight = CAMPUS_MAP_BOUNDS.height;

      // 方向別の余白設定（左・上をより広く）
      const paddingLeft = mapWidth * 0.3; // 左方向：30%
      const paddingRight = mapWidth * 0.1; // 右方向：10%
      const paddingTop = mapHeight * 0.3; // 上方向：30%
      const paddingBottom = mapHeight * 0.1; // 下方向：10%

      const maxX = mapWidth + paddingRight - targetWidth;
      const minX = -paddingLeft;
      const maxY = mapHeight + paddingBottom - targetHeight;
      const minY = -paddingTop;

      // ポイントを中央に配置した座標を計算
      const centerX = point.x - targetWidth / 2;
      const centerY = point.y - targetHeight / 2;

      setViewBox({
        height: targetHeight,
        width: targetWidth,
        x: Math.max(minX, Math.min(maxX, centerX)),
        y: Math.max(minY, Math.min(maxY, centerY)),
      });
      endInteraction();
    },
    [startInteraction, endInteraction],
  );

  // Hide mouse cursor when leaving the map
  const handleMouseLeave = useCallback(() => {
    // Remove any hover states
    setHoveredPoint(null);
    onPointHover?.(null);
  }, [onPointHover]);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;

      // マップ操作開始
      startInteraction();
      // マップ操作開始時にカードを閉じる
      closeCard();

      // Shift+ドラッグでズーム選択モード
      if (isShiftPressed) {
        // ズーム選択の開始位置を記録
        setDragStart({ x: e.clientX, y: e.clientY });
        setDragStartViewBox(viewBox);
        setIsDragging(true);
      } else {
        // 通常のドラッグモード
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setDragStartViewBox(viewBox);
      }
      e.preventDefault();
    },
    [viewBox, closeCard, isShiftPressed, startInteraction],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      // requestAnimationFrameで既存のリクエストをキャンセル
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // 次のフレームで実行
      rafIdRef.current = requestAnimationFrame(() => {
        if (!containerRef.current || !svgRef.current) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const contentRect = getSVGContentRect(svgRect);
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        // Shift+ドラッグの場合はズーム操作
        if (isShiftPressed) {
          const distance = Math.hypot(deltaX, deltaY);
          const zoomFactor =
            distance > 0 ? Math.max(0.5, Math.min(2, 1 + deltaY / 100)) : 1;

          const centerSVG = screenToSVG(dragStart.x, dragStart.y);
          const targetWidth = dragStartViewBox.width * zoomFactor;
          const targetHeight = dragStartViewBox.height * zoomFactor;

          setViewBox({
            height: targetHeight,
            width: targetWidth,
            x: centerSVG.x - targetWidth / 2,
            y: centerSVG.y - targetHeight / 2,
          });
          return;
        }

        // SVGコンテンツ領域のサイズを使用してスケールを計算
        const scaleX = viewBox.width / contentRect.width;
        const scaleY = viewBox.height / contentRect.height;

        const newX = dragStartViewBox.x - deltaX * scaleX;
        const newY = dragStartViewBox.y - deltaY * scaleY;

        // パン制限を完全に無効化 - 自由に移動可能
        setViewBox({
          height: dragStartViewBox.height,
          width: dragStartViewBox.width,
          x: newX,
          y: newY,
        });
      });
    },
    [
      isDragging,
      dragStart,
      dragStartViewBox,
      viewBox.width,
      viewBox.height,
      isShiftPressed,
      screenToSVG,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    endInteraction();
  }, [endInteraction]);

  // SVGの実際の描画領域を計算する関数
  // 注意：Content Areaは元のviewBoxサイズ（2000x1343）に基づいて計算する必要がある
  // 現在のzoom/pan状態には依存しない

  // Touch event handlers for mobile (ViewBox based)
  const [touchDistance, setTouchDistance] = useState<number>(0);

  type TouchCollection = TouchList | React.TouchList;

  const getTouchDistance = useCallback((touches: TouchCollection): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }, []);

  const getTouchCenter = useCallback((touches: TouchCollection): Coordinate => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // ReactのtouchStartイベントはpassiveなのでpreventDefault()を呼び出さない
      // 代わりにtouchmove/touchendで{ passive: false }を使用

      const now = Date.now();
      setTouchStartTime(now);
      setTouchStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setIsTouchGesture(false);

      // マップ操作開始
      startInteraction();

      if (e.touches.length === 1) {
        // Single touch - prepare for drag but don't close card yet
        setIsDragging(true);
        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        setDragStartViewBox(viewBox);
      } else if (e.touches.length === 2) {
        // Multi-touch - definitely a gesture, close card
        closeCard();
        setIsDragging(false);
        setTouchDistance(getTouchDistance(e.touches));
        setIsTouchGesture(true);
      }
    },
    [viewBox, closeCard, getTouchDistance, startInteraction],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!containerRef.current) return;

      // Check if touch is over a card area
      const cardElements = document.querySelectorAll(".map-card-overlay");
      let isOverCard = false;

      for (const cardElement of cardElements) {
        const rect = cardElement.getBoundingClientRect();
        if (
          e.touches[0].clientX >= rect.left &&
          e.touches[0].clientX <= rect.right &&
          e.touches[0].clientY >= rect.top &&
          e.touches[0].clientY <= rect.bottom
        ) {
          isOverCard = true;
          break;
        }
      }

      // If over card, don't interfere with card touch events
      if (isOverCard) {
        return;
      }

      // Calculate movement distance to detect if this is a gesture
      const deltaX = e.touches[0].clientX - touchStartPos.x;
      const deltaY = e.touches[0].clientY - touchStartPos.y;
      const distance = Math.hypot(deltaX, deltaY);

      // If movement is significant, mark as gesture and close card
      if (distance > 5 && !isTouchGesture) {
        setIsTouchGesture(true);
        closeCard();
      }

      // Only prevent default if this is clearly a gesture
      if (
        (isTouchGesture || distance > 5 || e.touches.length > 1) &&
        e.cancelable
      ) {
        try {
          e.preventDefault();
        } catch (error) {
          console.debug("preventDefault failed on touchmove:", error);
        }
      }

      if (
        e.touches.length === 1 &&
        isDragging &&
        containerRef.current &&
        (isTouchGesture || distance > 5)
      ) {
        // requestAnimationFrameで既存のリクエストをキャンセル
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }

        // 次のフレームで実行
        rafIdRef.current = requestAnimationFrame(() => {
          if (!containerRef.current || !svgRef.current) return;

          const deltaX = e.touches[0].clientX - dragStart.x;
          const deltaY = e.touches[0].clientY - dragStart.y;

          const svgRect = svgRef.current.getBoundingClientRect();
          const contentRect = getSVGContentRect(svgRect);

          // SVGコンテンツ領域のサイズを使用してスケールを計算
          const scaleX = viewBox.width / contentRect.width;
          const scaleY = viewBox.height / contentRect.height;

          const newX = dragStartViewBox.x - deltaX * scaleX;
          const newY = dragStartViewBox.y - deltaY * scaleY;

          // パン制限を完全に無効化 - 自由に移動可能
          setViewBox({
            height: dragStartViewBox.height,
            width: dragStartViewBox.width,
            x: newX,
            y: newY,
          });
        });
      } else if (e.touches.length === 2 && touchDistance > 0) {
        const newDistance = getTouchDistance(e.touches);
        const newCenter = getTouchCenter(e.touches);
        const scale = touchDistance / newDistance;

        const centerSVG = screenToSVG(newCenter.x, newCenter.y);

        setViewBox((prev) => {
          const newWidth = Math.max(
            Math.min(
              prev.width * scale,
              (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
                minZoom,
            ),
            (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
              maxZoom,
          );
          const newHeight = Math.max(
            Math.min(
              prev.height * scale,
              (ADJUSTED_MAP_BOUNDS.height + ADJUSTED_MAP_BOUNDS.marginY * 2) /
                minZoom,
            ),
            (ADJUSTED_MAP_BOUNDS.height + ADJUSTED_MAP_BOUNDS.marginY * 2) /
              maxZoom,
          );

          // タッチの中心位置を保ったままズーム（パン制限なし）
          const newX =
            centerSVG.x - (centerSVG.x - prev.x) * (newWidth / prev.width);
          const newY =
            centerSVG.y - (centerSVG.y - prev.y) * (newHeight / prev.height);

          return {
            height: newHeight,
            width: newWidth,
            x: newX,
            y: newY,
          };
        });

        setTouchDistance(newDistance);
      }
    },
    [
      isDragging,
      dragStart,
      dragStartViewBox,
      touchDistance,
      screenToSVG,
      minZoom,
      maxZoom,
      viewBox.width,
      viewBox.height,
      getTouchDistance,
      touchStartPos,
      isTouchGesture,
      closeCard,
      getTouchCenter,
    ],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!containerRef.current) return;

      const now = Date.now();
      const touchDuration = now - touchStartTime;
      const lastTouch = e.changedTouches[0];

      // Check if touch is over a card area
      const cardElements = document.querySelectorAll(".map-card-overlay");
      let isOverCard = false;

      for (const cardElement of cardElements) {
        const rect = cardElement.getBoundingClientRect();
        if (
          lastTouch.clientX >= rect.left &&
          lastTouch.clientX <= rect.right &&
          lastTouch.clientY >= rect.top &&
          lastTouch.clientY <= rect.bottom
        ) {
          isOverCard = true;
          break;
        }
      }

      // If over card, don't interfere with card touch events
      if (isOverCard) {
        return;
      }

      // Calculate final movement distance
      const deltaX = lastTouch.clientX - touchStartPos.x;
      const deltaY = lastTouch.clientY - touchStartPos.y;
      const totalDistance = Math.hypot(deltaX, deltaY);

      // Check if this was a tap (short duration, minimal movement, single touch)
      const isTap =
        touchDuration < 500 &&
        totalDistance < 10 &&
        !isTouchGesture &&
        e.touches.length === 0;

      if (isTap) {
        // Handle tap - check for double tap first
        const timeDiff = now - lastTapTime;

        if (timeDiff < 300 && timeDiff > 0) {
          // Double tap detected - perform zoom
          const svgCoord = screenToSVG(lastTouch.clientX, lastTouch.clientY);

          // ズームレベルサイクル: 1x → 2x → 4x → 8x → 1x
          const zoomLevels = [1, 2, 4, 8];
          const currentIndex = zoomLevels.findIndex(
            (level) => Math.abs(currentZoomLevel - level) < 0.5,
          );
          const nextIndex = (currentIndex + 1) % zoomLevels.length;
          const nextZoomLevel = zoomLevels[nextIndex];

          // ダブルタップ位置を中心にズーム
          zoomToPoint(svgCoord, nextZoomLevel);
          setCurrentZoomLevel(nextZoomLevel);

          if (e.cancelable) {
            e.preventDefault();
          }
          return;
        } else {
          // Single tap - allow it to propagate to click handlers
          // Don't prevent default for single taps to allow click events
          setLastTapTime(now);

          // Simulate a click event for touch devices
          if (svgRef.current && mode === "interactive" && onMapClick) {
            // Use the same coordinate calculation method as mouse clicks for consistency
            const svgRect = svgRef.current.getBoundingClientRect();
            const relativeX = lastTouch.clientX - svgRect.left;
            const relativeY = lastTouch.clientY - svgRect.top;

            // Calculate the actual content area within SVG element (considering preserveAspectRatio)
            const contentRect = getSVGContentRect(svgRect);

            // Adjust relative coordinates to account for letterboxing/pillarboxing
            const adjustedRelativeX = relativeX - contentRect.offsetX;
            const adjustedRelativeY = relativeY - contentRect.offsetY;

            // ALWAYS use content area aware transformation for consistent accuracy
            // Content Areaを考慮した座標変換を常に使用 (same as handleSVGClick for consistency)
            const svgX =
              viewBox.x +
              (adjustedRelativeX / contentRect.width) * viewBox.width;
            const svgY =
              viewBox.y +
              (adjustedRelativeY / contentRect.height) * viewBox.height;

            // Apply coordinate limits and precision (same as mouse handler)
            const mapClickMargin =
              Math.max(CAMPUS_MAP_BOUNDS.width, CAMPUS_MAP_BOUNDS.height) * 2;
            const clampedX = Math.max(
              -mapClickMargin,
              Math.min(CAMPUS_MAP_BOUNDS.width + mapClickMargin, svgX),
            );
            const clampedY = Math.max(
              -mapClickMargin,
              Math.min(CAMPUS_MAP_BOUNDS.height + mapClickMargin, svgY),
            );

            const preciseX = Math.round(clampedX * 100) / 100;
            const preciseY = Math.round(clampedY * 100) / 100;

            // Add a small delay to ensure this doesn't conflict with point clicks
            setTimeout(() => {
              onMapClick({ x: preciseX, y: preciseY });
            }, 10);
          }

          return; // Don't prevent default for single taps
        }
      }

      // Only prevent default for gestures
      if ((isTouchGesture || totalDistance > 10) && e.cancelable) {
        try {
          e.preventDefault();
        } catch {
          // Silently handle preventDefault failures
        }
      }

      if (e.touches.length === 0) {
        setIsDragging(false);
        setTouchDistance(0);
        setIsTouchGesture(false);
        endInteraction();
      }
    },
    [
      lastTapTime,
      currentZoomLevel,
      screenToSVG,
      zoomToPoint,
      touchStartTime,
      touchStartPos,
      isTouchGesture,
      mode,
      onMapClick,
      endInteraction,
      getSVGContentRect,
      viewBox,
    ],
  );

  // Wheel zoom handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!containerRef.current) return;

      // カードエリア上かチェック
      const cardElements = document.querySelectorAll(".map-card-overlay");
      let isOverCard = false;

      for (const cardElement of cardElements) {
        const rect = cardElement.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          isOverCard = true;
          break;
        }
      }

      // カードエリア上の場合はカードのスクロールを許可
      if (isOverCard) {
        return; // ブラウザのデフォルトスクロールを許可
      }

      e.preventDefault();

      // ズーム操作開始
      startInteraction();
      // ズーム操作時にカードを閉じる
      closeCard();

      const mouseSVG = screenToSVG(e.clientX, e.clientY);

      const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;

      setViewBox((prev) => {
        const newWidth = Math.max(
          Math.min(
            prev.width * zoomFactor,
            (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
              minZoom,
          ),
          (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
            maxZoom,
        );
        const newHeight = Math.max(
          Math.min(
            prev.height * zoomFactor,
            (ADJUSTED_MAP_BOUNDS.height + ADJUSTED_MAP_BOUNDS.marginY * 2) /
              minZoom,
          ),
          (ADJUSTED_MAP_BOUNDS.height + ADJUSTED_MAP_BOUNDS.marginY * 2) /
            maxZoom,
        );

        // ポインター位置を中心にズーム（パン制限なし）
        const newX =
          mouseSVG.x - (mouseSVG.x - prev.x) * (newWidth / prev.width);
        const newY =
          mouseSVG.y - (mouseSVG.y - prev.y) * (newHeight / prev.height);

        return {
          height: newHeight,
          width: newWidth,
          x: newX,
          y: newY,
        };
      });
      endInteraction();
    },
    [
      screenToSVG,
      minZoom,
      maxZoom,
      closeCard,
      startInteraction,
      endInteraction,
    ],
  );

  // カードの最適な表示位置を計算する関数
  const calculateCardPosition = useCallback(
    (
      pointCoordinates: Coordinate,
      screenEvent?: React.MouseEvent,
      isCluster: boolean = false,
    ) => {
      if (!containerRef.current) return { placement: "bottom", x: 0, y: 0 };

      const containerRect = containerRef.current.getBoundingClientRect();
      const cardWidth = isCluster ? 400 : 300;
      const cardHeight = isCluster ? 300 : 200;
      const margin = 20;

      let baseX: number, baseY: number;

      if (screenEvent) {
        baseX = screenEvent.clientX - containerRect.left;
        baseY = screenEvent.clientY - containerRect.top;
      } else {
        // SVG座標からスクリーン座標に変換
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          baseX =
            ((pointCoordinates.x - viewBox.x) / viewBox.width) * svgRect.width;
          baseY =
            ((pointCoordinates.y - viewBox.y) / viewBox.height) *
            svgRect.height;
        } else {
          baseX = containerRect.width / 2;
          baseY = containerRect.height / 2;
        }
      }

      // ポイント位置に基づく動的優先順位の計算
      const leftThird = containerRect.width / 3;
      const rightThird = (containerRect.width * 2) / 3;
      const topThird = containerRect.height / 3;
      const bottomThird = (containerRect.height * 2) / 3;

      // 位置に基づく優先順位を動的に調整
      let priorities = { bottom: 1, left: 4, right: 3, top: 2 };

      if (baseX < leftThird) {
        // 左側 - 右方向を優先
        priorities = { bottom: 2, left: 4, right: 1, top: 3 };
      } else if (baseX > rightThird) {
        // 右側 - 左方向を優先
        priorities = { bottom: 2, left: 1, right: 4, top: 3 };
      }

      if (baseY < topThird) {
        // 上部 - 下方向を優先
        priorities = { bottom: 1, left: 3, right: 2, top: 4 };
      } else if (baseY > bottomThird) {
        // 下部 - 上方向を優先
        priorities = { bottom: 4, left: 3, right: 2, top: 1 };
      }

      // 4つの方向での配置可能性をチェック（動的優先順位）
      const placements = [
        {
          finalX: baseX,
          finalY: baseY + 50,
          name: "bottom",
          priority: priorities.bottom,
          spaceAvailable:
            containerRect.height - (baseY + 50 + cardHeight + margin),
          transform: "translate(-50%, 0%)",
          viable: baseY + 50 + cardHeight + margin < containerRect.height,
          x: baseX,
          y: baseY + 50,
        },
        {
          finalX: baseX,
          finalY: baseY - 50,
          name: "top",
          priority: priorities.top,
          spaceAvailable: baseY - 50 - cardHeight - margin,
          transform: "translate(-50%, -100%)",
          viable: baseY - 50 - cardHeight - margin > 0,
          x: baseX,
          y: baseY - 50,
        },
        {
          finalX: baseX + 50,
          finalY: baseY,
          name: "right",
          priority: priorities.right,
          spaceAvailable:
            containerRect.width - (baseX + 50 + cardWidth + margin),
          transform: "translate(0%, -50%)",
          viable: baseX + 50 + cardWidth + margin < containerRect.width,
          x: baseX + 50,
          y: baseY,
        },
        {
          finalX: baseX - 50,
          finalY: baseY,
          name: "left",
          priority: priorities.left,
          spaceAvailable: baseX - 50 - cardWidth - margin,
          transform: "translate(-100%, -50%)",
          viable: baseX - 50 - cardWidth - margin > 0,
          x: baseX - 50,
          y: baseY,
        },
      ];

      // 最適な配置を選択（スペースと位置を考慮）
      const viablePlacements = placements.filter((p) => p.viable);

      const selectedPlacement =
        viablePlacements.length > 0
          ? [...viablePlacements].sort(
              (
                a: { spaceAvailable: number; priority: number },
                b: { spaceAvailable: number; priority: number },
              ) => {
                const aHasSpace = a.spaceAvailable > 50;
                const bHasSpace = b.spaceAvailable > 50;
                if (aHasSpace && !bHasSpace) return -1;
                if (!aHasSpace && bHasSpace) return 1;
                if (aHasSpace && bHasSpace) {
                  return a.priority - b.priority;
                }
                return b.spaceAvailable - a.spaceAvailable;
              },
            )[0]
          : [...placements].sort(
              (a: { spaceAvailable: number }, b: { spaceAvailable: number }) =>
                b.spaceAvailable - a.spaceAvailable,
            )[0];

      // transformを考慮した最終位置を設定
      let finalX = selectedPlacement.finalX;
      let finalY = selectedPlacement.finalY;

      // 境界チェックとフォールバック調整
      if (!selectedPlacement.viable) {
        // 画面中央にフォールバック
        finalX = containerRect.width / 2;
        finalY = containerRect.height / 2;
      }

      return {
        placement: selectedPlacement.name,
        transform: selectedPlacement.transform,
        x: finalX,
        y: finalY,
      };
    },
    [viewBox],
  );

  // Point interaction handlers
  const handlePointClick = useCallback(
    (
      point: InteractivePoint,
      screenEvent?: React.MouseEvent,
      isMobileTap?: boolean,
    ) => {
      const now = Date.now();

      // Mobile hover simulation logic
      if (isMobileTap && point.contentItem) {
        // Check if this is the second tap on the same point within 2 seconds
        if (
          lastMobileTapPointId === point.id &&
          now - lastMobileTapTime < 2000 &&
          mobileHoveredPoint === point.id
        ) {
          // Second tap - navigate to detail page or trigger onClick
          point.onClick?.();
          onPointClick?.(point.id);
          // Clear mobile hover state
          setMobileHoveredPoint(null);
          setLastMobileTapPointId(null);
          return;
        } else {
          // First tap - show hover (mobile card display)
          setMobileHoveredPoint(point.id);
          setLastMobileTapPointId(point.id);
          setLastMobileTapTime(now);

          // Show content card like hover
          setSelectedPoint(point);
          setSelectedCluster(null); // クラスターを閉じる

          // カードの最適な表示位置を計算
          const position = calculateCardPosition(
            point.coordinates,
            screenEvent,
            false,
          );
          setCardPosition(position);
          return;
        }
      }

      // Desktop behavior or non-mobile tap
      if (point.contentItem) {
        setSelectedPoint(point);
        setSelectedCluster(null); // クラスターを閉じる

        // カードの最適な表示位置を計算
        const position = calculateCardPosition(
          point.coordinates,
          screenEvent,
          false,
        );
        setCardPosition(position);
      }

      point.onClick?.();
      onPointClick?.(point.id);
    },
    [
      onPointClick,
      lastMobileTapPointId,
      lastMobileTapTime,
      mobileHoveredPoint,
      calculateCardPosition,
    ],
  );

  // Cluster interaction handlers
  const handleClusterClick = useCallback(
    (cluster: PointCluster, screenEvent?: React.MouseEvent) => {
      setSelectedCluster(cluster.points);
      setSelectedPoint(null); // 単一ポイントを閉じる

      // カードの最適な表示位置を計算
      const position = calculateCardPosition(
        cluster.coordinates,
        screenEvent,
        true,
      );
      setCardPosition(position);
    },
    [calculateCardPosition],
  );

  const handlePointHover = useCallback(
    (point: InteractivePoint | null) => {
      const newHoveredId = point?.id || null;
      setHoveredPoint(newHoveredId);
      onPointHover?.(newHoveredId);
      point?.onHover?.(!!point);
    },
    [onPointHover],
  );

  // SVG click handler
  const handleSVGClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return;

      // カードを閉じる（SVGの背景をクリックした時）
      if ((selectedPoint || selectedCluster) && e.target === svgRef.current) {
        setSelectedPoint(null);
        setSelectedCluster(null);
      }

      if (mode === "interactive" && onMapClick) {
        // SVG要素の正確な境界を取得
        if (!svgRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();

        // SVG境界チェックを緩和（マップ全体で操作可能）
        const clickSVGMargin = Math.max(svgRect.width, svgRect.height) * 10;
        if (
          e.clientX < svgRect.left - clickSVGMargin ||
          e.clientX > svgRect.right + clickSVGMargin ||
          e.clientY < svgRect.top - clickSVGMargin ||
          e.clientY > svgRect.bottom + clickSVGMargin
        ) {
          return; // SVG境界外のクリックは無視
        }

        // SVG要素内での正確な相対座標を計算（Content Area Aware変換方式）
        const relativeX = e.clientX - svgRect.left;
        const relativeY = e.clientY - svgRect.top;

        // Calculate the actual content area within SVG element (considering preserveAspectRatio)
        const contentRect = getSVGContentRect(svgRect);

        // Adjust relative coordinates to account for letterboxing/pillarboxing
        const adjustedRelativeX = relativeX - contentRect.offsetX;
        const adjustedRelativeY = relativeY - contentRect.offsetY;

        // ALWAYS use content area aware transformation for consistent accuracy
        // Content Areaを考慮した座標変換を常に使用
        const svgX =
          viewBox.x + (adjustedRelativeX / contentRect.width) * viewBox.width;
        const svgY =
          viewBox.y + (adjustedRelativeY / contentRect.height) * viewBox.height;

        // マップ座標制限を緩和（マップ外でもポイント選択可能）
        const mapClickMargin =
          Math.max(CAMPUS_MAP_BOUNDS.width, CAMPUS_MAP_BOUNDS.height) * 2;
        const clampedX = Math.max(
          -mapClickMargin,
          Math.min(CAMPUS_MAP_BOUNDS.width + mapClickMargin, svgX),
        );
        const clampedY = Math.max(
          -mapClickMargin,
          Math.min(CAMPUS_MAP_BOUNDS.height + mapClickMargin, svgY),
        );

        // 座標精度を小数点第2位まで向上
        const preciseX = Math.round(clampedX * 100) / 100;
        const preciseY = Math.round(clampedY * 100) / 100;

        onMapClick({ x: preciseX, y: preciseY });
      }
    },
    [
      isDragging,
      mode,
      onMapClick,
      viewBox,
      selectedPoint,
      selectedCluster,
      getSVGContentRect,
    ],
  );

  // Keyboard event handlers for Shift key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Shift") {
      setIsShiftPressed(true);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === "Shift") {
      setIsShiftPressed(false);
    }
  }, []);

  // Event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse events (keep document level for drag continuation)
    // mousemoveはpassiveにしてパフォーマンス向上
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseup", handleMouseUp, { passive: true });

    // Touch events (attach to container only to prevent interference)
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });
    container.addEventListener("wheel", handleWheel, { passive: false });

    // Keyboard events for Shift key detection
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    handleKeyDown,
    handleKeyUp,
  ]);

  // Auto fit view based on points (for map page)
  const autoFitToPoints = useCallback(() => {
    if (points.length === 0) return;

    setViewBox(computeFittedViewBox(points, initialZoom));
  }, [points, initialZoom]);

  // Auto zoom to highlight point (for detail pages)
  const [hasAutoZoomed, setHasAutoZoomed] = useState(false);

  useEffect(() => {
    if (highlightPoint && mode === "detail" && !hasAutoZoomed) {
      const timer = setTimeout(() => {
        zoomToPoint(highlightPoint, 4);
        setHasAutoZoomed(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [highlightPoint, mode, zoomToPoint, hasAutoZoomed]);

  // Auto fit to all points (for map page)
  useEffect(() => {
    if (mode === "display" && points.length > 0) {
      const frame = requestAnimationFrame(() => autoFitToPoints());
      return () => cancelAnimationFrame(frame);
    }
    return;
  }, [mode, points.length, autoFitToPoints]);

  // Reset auto zoom flag when highlightPoint changes
  useEffect(() => {
    setHasAutoZoomed(false);
  }, [highlightPoint]);

  // クラスタリング機能
  const CLUSTER_DISTANCE_THRESHOLD = 25; // ピクセル単位（35→25にさらに減少でクラスタリングを積極化）
  const LABEL_WIDTH = 200; // ラベルの幅（ピクセル）
  const LABEL_HEIGHT = 40; // ラベルの高さ（ピクセル、2行分）

  const createClusters = useCallback((): PointCluster[] => {
    if (points.length === 0) return [];

    // ローカルで距離計算関数を定義
    const calculateDistance = (p1: Coordinate, p2: Coordinate): number => {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

    const clusters: PointCluster[] = [];
    const usedPoints = new Set<string>();

    // スケール調整されたクラスタリング距離を計算
    const zoomLevel =
      (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
      viewBox.width;
    const adjustedThreshold = CLUSTER_DISTANCE_THRESHOLD / Math.sqrt(zoomLevel);

    // 最小クラスターサイズ（2つ以上のポイントでクラスターを作成）

    for (const point of points) {
      if (usedPoints.has(point.id)) continue;

      const clusterPoints: InteractivePoint[] = [point];
      usedPoints.add(point.id);

      // 近くの他のポイントを探す
      for (const otherPoint of points) {
        if (usedPoints.has(otherPoint.id)) continue;

        const distance = calculateDistance(
          point.coordinates,
          otherPoint.coordinates,
        );
        if (distance <= adjustedThreshold) {
          clusterPoints.push(otherPoint);
          usedPoints.add(otherPoint.id);
        }
      }

      // クラスターの中心座標を計算
      const centerX =
        clusterPoints.reduce((sum, p) => sum + p.coordinates.x, 0) /
        clusterPoints.length;
      const centerY =
        clusterPoints.reduce((sum, p) => sum + p.coordinates.y, 0) /
        clusterPoints.length;

      // 一つのクラスターとして作成（条件を簡素化）
      clusters.push({
        coordinates: { x: centerX, y: centerY },
        count: clusterPoints.length,
        id: `cluster-${clusterPoints
          .map((p) => p.id)
          .sort((a: string, b: string) => a.localeCompare(b))
          .join("-")}`,
        points: clusterPoints,
      });
    }

    return clusters;
  }, [points, viewBox.width]);

  const clusters = useMemo(() => createClusters(), [createClusters]);

  // ピンのスクリーン座標を計算（ズーム/パンに追従）
  const pinsScreenPositions = useMemo(() => {
    const positions = clusters.map((cluster) => {
      const screenPos = svgToScreen(
        cluster.coordinates.x,
        cluster.coordinates.y,
      );
      return {
        cluster,
        screenPosition: screenPos || { x: 0, y: 0 },
      };
    });

    // クラスター同士の重複チェックと非表示判定
    const visiblePositions = positions.map((pos) => {
      // クラスターは常に表示する（非表示判定を無効化）
      return { ...pos, visible: true, showLabel: false };
    });

    // ラベル表示の条件をチェック（連鎖的な左右反転で最大化）

    // ラベル矩形を計算する関数
    const calculateLabelRect = (
      pos: (typeof visiblePositions)[0],
      direction: "left" | "right",
    ) => {
      return {
        x:
          direction === "right"
            ? pos.screenPosition.x + 32
            : pos.screenPosition.x - 32 - LABEL_WIDTH,
        y: pos.screenPosition.y - LABEL_HEIGHT / 2,
        width: LABEL_WIDTH,
        height: LABEL_HEIGHT,
      };
    };

    // 矩形が重なっているかチェックする関数
    const rectanglesOverlap = (
      rect1: { x: number; y: number; width: number; height: number },
      rect2: { x: number; y: number; width: number; height: number },
      margin = 5,
    ) => {
      return (
        rect1.x < rect2.x + rect2.width + margin &&
        rect1.x + rect1.width > rect2.x - margin &&
        rect1.y < rect2.y + rect2.height + margin &&
        rect1.y + rect1.height > rect2.y - margin
      );
    };

    // 配置が有効かチェックする関数
    const isValidPlacement = (
      rect: { x: number; y: number; width: number; height: number },
      selfIndex: number,
      labels: Array<{
        index: number;
        direction: "left" | "right";
        rect: { x: number; y: number; width: number; height: number };
      }>,
    ) => {
      // ピンとの重なりチェック
      for (let j = 0; j < visiblePositions.length; j++) {
        if (selfIndex === j || !visiblePositions[j].visible) continue;
        const otherPos = visiblePositions[j];
        const pinRect = {
          x: otherPos.screenPosition.x - 12,
          y: otherPos.screenPosition.y - 16,
          width: 24,
          height: 32,
        };
        if (rectanglesOverlap(rect, pinRect, 2)) {
          return false;
        }
      }

      // 他のラベルとの重なりチェック
      for (const other of labels) {
        if (other.index === selfIndex) continue;
        if (rectanglesOverlap(rect, other.rect)) {
          return false;
        }
      }

      return true;
    };

    // 連鎖的に反転を試みる関数（バックトラッキング）
    const tryFlipChain = (
      targetIndex: number,
      targetDirection: "left" | "right",
      labels: Array<{
        index: number;
        direction: "left" | "right";
        rect: { x: number; y: number; width: number; height: number };
      }>,
      visited: Set<number>,
      maxDepth: number,
    ): Array<{
      index: number;
      direction: "left" | "right";
      rect: { x: number; y: number; width: number; height: number };
    }> | null => {
      // 深さ制限（無限ループ防止）
      if (visited.size >= maxDepth) return null;
      if (visited.has(targetIndex)) return null;

      const targetPos = visiblePositions[targetIndex];
      const targetRect = calculateLabelRect(targetPos, targetDirection);

      // この配置が有効かチェック
      if (isValidPlacement(targetRect, targetIndex, labels)) {
        return [
          { index: targetIndex, direction: targetDirection, rect: targetRect },
        ];
      }

      // 重なっているラベルを見つけて反転を試みる
      const conflicts = labels.filter((label) =>
        rectanglesOverlap(targetRect, label.rect),
      );

      visited.add(targetIndex);

      // 各衝突について、相手を反転して解決できるか試す
      for (const conflict of conflicts) {
        const newDirection = conflict.direction === "left" ? "right" : "left";
        const labelsWithoutConflict = labels.filter(
          (l) => l.index !== conflict.index,
        );

        // 相手を反転して連鎖的に試行
        const chainResult = tryFlipChain(
          conflict.index,
          newDirection,
          labelsWithoutConflict,
          new Set(visited),
          maxDepth,
        );

        if (chainResult) {
          // 成功：相手の反転 + 自分の配置
          return [
            ...chainResult,
            {
              index: targetIndex,
              direction: targetDirection,
              rect: targetRect,
            },
          ];
        }
      }

      visited.delete(targetIndex);
      return null;
    };

    // 確定したラベルの情報を保存
    const confirmedLabels: Array<{
      index: number;
      direction: "left" | "right";
      rect: { x: number; y: number; width: number; height: number };
    }> = [];

    // ビューポートの中心座標を計算
    const viewportCenterX = viewBox.width / 2;
    const viewportCenterY = viewBox.height / 2;

    // ビューポート中心からの距離でソート（中心に近いものから処理）
    const sortedIndices = visiblePositions
      .map((pos, index) => {
        const dx = pos.screenPosition.x - viewportCenterX;
        const dy = pos.screenPosition.y - viewportCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return { index, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .map((item) => item.index);

    // 中心から近い順に処理
    for (const i of sortedIndices) {
      const pos = visiblePositions[i];

      // クラスターは常に表示
      if (pos.cluster.count !== 1) {
        const defaultDirection =
          pos.screenPosition.x > viewBox.width / 2 ? "left" : "right";
        confirmedLabels.push({
          index: i,
          direction: defaultDirection,
          rect: calculateLabelRect(pos, defaultDirection),
        });
        continue;
      }

      // デフォルトの方向
      const defaultDirection =
        pos.screenPosition.x > viewBox.width / 2 ? "left" : "right";
      const oppositeDirection = defaultDirection === "left" ? "right" : "left";

      // 1. デフォルト方向で試行
      let labelRect = calculateLabelRect(pos, defaultDirection);
      if (isValidPlacement(labelRect, i, confirmedLabels)) {
        confirmedLabels.push({
          index: i,
          direction: defaultDirection,
          rect: labelRect,
        });
        continue;
      }

      // 2. 自分を反転して試行
      labelRect = calculateLabelRect(pos, oppositeDirection);
      if (isValidPlacement(labelRect, i, confirmedLabels)) {
        confirmedLabels.push({
          index: i,
          direction: oppositeDirection,
          rect: labelRect,
        });
        continue;
      }

      // 3. デフォルト方向で連鎖的な反転を試行（最大3段階まで）
      labelRect = calculateLabelRect(pos, defaultDirection);
      let chainResult = tryFlipChain(
        i,
        defaultDirection,
        confirmedLabels,
        new Set(),
        3,
      );

      if (chainResult) {
        // 連鎖反転に成功：影響を受けたラベルを更新
        const newLabel = chainResult[chainResult.length - 1];
        const updates = chainResult.slice(0, -1);

        // 既存のラベルを更新
        for (const update of updates) {
          const existingIndex = confirmedLabels.findIndex(
            (l) => l.index === update.index,
          );
          if (existingIndex !== -1) {
            confirmedLabels[existingIndex] = update;
          }
        }

        // 新しいラベルを追加
        confirmedLabels.push(newLabel);
        continue;
      }

      // 4. 反対方向で連鎖的な反転を試行
      chainResult = tryFlipChain(
        i,
        oppositeDirection,
        confirmedLabels,
        new Set(),
        3,
      );

      if (chainResult) {
        // 連鎖反転に成功
        const newLabel = chainResult[chainResult.length - 1];
        const updates = chainResult.slice(0, -1);

        for (const update of updates) {
          const existingIndex = confirmedLabels.findIndex(
            (l) => l.index === update.index,
          );
          if (existingIndex !== -1) {
            confirmedLabels[existingIndex] = update;
          }
        }

        confirmedLabels.push(newLabel);
        continue;
      }

      // 5. どうしても配置できない場合は非表示
      // confirmedLabelsに追加しないため、showLabelがfalseになる
    }

    // 結果を返す（確定したラベルのマップを作成）
    const labelMap = new Map(
      confirmedLabels.map((label) => [label.index, label.direction]),
    );

    return visiblePositions.map((pos, index) => {
      const direction = labelMap.get(index);
      const showLabel = direction !== undefined;
      return { ...pos, showLabel, labelPosition: direction };
    });
  }, [clusters, svgToScreen, viewBox.width]);

  // ハイライトポイントのスクリーン座標
  const highlightScreenPosition = useMemo(() => {
    if (!highlightPoint) return null;
    return svgToScreen(highlightPoint.x, highlightPoint.y);
  }, [highlightPoint, svgToScreen]);

  useEffect(() => {
    if (!fullscreenEnabled || !resolvedFullscreen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (onToggleFullscreen) {
          onToggleFullscreen();
        } else {
          setInternalFullscreen(false);
        }
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenEnabled, onToggleFullscreen, resolvedFullscreen]);

  // SVGのクリーンアップとレンダリング最適化
  useEffect(() => {
    // コンポーネントアンマウント時のクリーンアップ
    return () => {
      // インタラクションタイムアウトをクリア
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = null;
      }
      // requestAnimationFrameをキャンセル
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      setSelectedPoint(null);
      setSelectedCluster(null);
      setHoveredPoint(null);
    };
  }, []);

  const placeholderStyle: CSSProperties | undefined = resolvedFullscreen
    ? placeholderHeight === null
      ? height
        ? { minHeight: height, width: "100%" }
        : { width: "100%" }
      : { height: `${placeholderHeight}px`, width: "100%" }
    : undefined;

  const containerClassNames = [
    "relative overflow-hidden vector-map-container",
    className,
    resolvedFullscreen ? "rounded-none" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const containerStyle: CSSProperties = {
    backgroundColor: resolvedFullscreen
      ? "var(--color-bg-secondary)"
      : undefined,
    borderRadius: resolvedFullscreen ? 0 : undefined,
    boxShadow: resolvedFullscreen
      ? "0 20px 40px rgba(15, 23, 42, 0.35)"
      : undefined,
    cursor: isDragging ? "grabbing" : isShiftPressed ? "zoom-in" : "grab",
    height: resolvedFullscreen ? "100vh" : height,
    imageRendering: "optimizeQuality" as CSSProperties["imageRendering"],
    inset: resolvedFullscreen ? 0 : undefined,
    maxWidth: resolvedFullscreen ? "100vw" : "100%",
    position: resolvedFullscreen ? "fixed" : undefined,
    shapeRendering: "geometricPrecision" as CSSProperties["shapeRendering"],
    touchAction: "manipulation",
    userSelect: "none",
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    width: resolvedFullscreen ? "100vw" : "100%",
    zIndex: resolvedFullscreen ? 60 : undefined,
  };

  return (
    <>
      {resolvedFullscreen && (
        <div aria-hidden="true" className="w-full" style={placeholderStyle} />
      )}
      <div
        ref={containerRef}
        className={containerClassNames}
        style={containerStyle}
      >
        {/* Controls */}
        {showControls && (
          <ZoomControls
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={resetView}
            onToggleFullscreen={
              fullscreenEnabled ? handleFullscreenToggle : undefined
            }
            isFullscreen={resolvedFullscreen}
            fullscreenLabel={resolvedFullscreenLabel}
            scale={CAMPUS_MAP_BOUNDS.width / viewBox.width}
            minScale={minZoom}
            maxScale={maxZoom}
          />
        )}

        {/* Vector SVG Map */}
        <svg
          ref={svgRef}
          className="h-full w-full"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          preserveAspectRatio="xMidYMid meet"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleSVGClick}
          onMouseLeave={handleMouseLeave}
          style={{
            backfaceVisibility: "hidden",
            shapeRendering: "geometricPrecision",
            textRendering: "geometricPrecision",
            vectorEffect: "non-scaling-stroke",
            willChange: "transform",
          }}
        >
          <defs>
            <style>
              {`
              .map-base { fill: #e6e6e6; }
              .map-roof { fill: #b3b3b3; }
              .map-building { fill: gray; }
              ${
                mode === "interactive"
                  ? `.map-building { pointer-events: none; }
                     .map-building:hover { fill: #666; }`
                  : ""
              }
              .map-point { cursor: pointer; transition: all 0.2s ease; }
               
              .map-text { 
                font-family: system-ui, -apple-system, sans-serif;
                font-weight: 600;
                text-anchor: middle;
                dominant-baseline: central;
                pointer-events: none;
                paint-order: stroke fill;
                stroke: white;
                stroke-width: 2;
                stroke-linecap: round;
                stroke-linejoin: round;
              }
            `}
            </style>
          </defs>

          {/* Base Layer */}
          <g id="base">
            <polygon
              className="map-base"
              points="709.5134 643.5586 769.4722 667.5421 813.4421 701.5188 835.427 731.4983 975.331 815.4407 1053.2776 809.4448 1079.2598 835.427 1067.268 849.4174 693.5243 835.427 695.523 759.4791 699.5202 637.5627 701.5188 621.5737 717.5079 543.6271 657.549 405.7217 645.5572 411.7176 689.5271 521.6422 695.523 549.623 683.5312 631.5668 679.5339 653.5517 675.5367 821.4366 673.538 831.4297 657.549 835.427 503.6546 831.4297 491.6628 825.4339 487.6655 805.4476 497.6587 321.7789 493.6614 313.7848 169.8835 305.7903 163.8876 309.7875 165.8862 325.7766 447.6929 337.7683 459.6847 349.7601 461.6833 451.6902 67.9534 441.697 69.952 395.7286 57.9602 391.7313 57.9602 365.7491 63.9561 309.7875 75.9479 301.793 77.9465 277.8095 35.9753 281.8067 31.9781 331.7724 37.974 463.682 25.9822 971.3338 13.9904 955.3447 5.9959 933.3598 9.9931 97.9328 9.9931 0 501.6559 0 569.6093 205.8588 725.5024 547.6244 709.5134 643.5586"
            />
            <polygon
              className="map-base"
              points="459.6847 651.5531 447.6929 661.5463 67.9534 655.5504 65.9548 569.6093 73.9493 463.682 459.6847 477.6724 459.6847 651.5531"
            />
            <polygon
              className="map-base"
              points="453.6888 961.3406 428.1581 976.6573 242.4325 971.3509 231.841 957.3434 197.8643 959.342 191.8684 969.3352 53.963 967.3365 49.9657 959.342 49.9657 835.427 55.9616 831.4297 59.9589 815.4407 65.9548 691.5257 77.9465 681.5326 169.8835 681.5326 249.8286 689.5271 375.7423 689.5271 445.6943 693.5243 455.6875 703.5175 449.6916 905.379 453.6888 961.3406"
            />
            <polygon
              className="map-base"
              points="321.7793 1193.1816 315.7834 1193.1816 263.8191 1187.1857 21.9849 1185.1871 0 1169.1981 3.9973 1045.2831 7.9945 1021.2995 23.9836 1009.3077 159.7644 1011.3064 167.8849 1015.3036 171.8821 1023.2981 173.8807 1037.2885 251.8273 1039.2872 275.8108 1043.2844 275.8108 1115.2351 279.8081 1121.231 351.7587 1123.2296 357.7546 1125.2282 359.7533 1129.2255 355.756 1161.2036 337.7683 1173.1953 321.7793 1193.1816"
            />
            <polygon
              className="map-base"
              points="907.3776 1161.2036 869.4037 1165.2008 695.523 1157.2063 525.6395 1157.2063 483.6683 1097.2474 485.6669 933.3598 491.6628 875.3996 499.6573 865.4064 547.6244 859.4105 727.501 871.4023 905.379 877.3982 911.3749 883.3941 907.3776 1161.2036"
            />
            <polygon
              className="map-base"
              points="905.379 1289.1158 847.4188 1273.1268 489.6641 1213.1679 455.6875 1165.2008 421.7108 1165.2008 419.7121 1151.2104 437.6998 1149.2118 439.6984 1133.2227 475.6737 1133.2227 481.6696 1145.2145 507.6518 1177.1926 523.6408 1183.1885 881.3955 1201.1761 901.3818 1221.1624 907.3776 1229.1569 905.379 1289.1158"
            />
            <polygon
              className="map-base"
              points="1099.2461 1245.146 959.342 1249.1432 943.353 1243.1474 941.3543 1065.2694 941.3543 913.3735 945.3516 905.379 953.3461 905.379 1087.2543 923.3667 1105.2419 939.3557 1099.2461 1245.146"
            />
            <polygon
              className="map-base"
              points="1097.2474 1339.0816 1087.2543 1343.0788 965.3379 1303.1062 951.3475 1283.1199 955.3447 1275.1254 1123.2296 1269.1295 1125.2282 921.3681 1117.2337 905.379 989.3214 891.3886 985.3242 883.3941 991.3201 879.3968 1113.2365 877.3982 1301.1076 1083.257 1097.2474 1339.0816"
            />
          </g>

          {/* Roof Layer */}
          <g id="roof">
            <polygon
              className="map-roof"
              points="199.8629 797.453 79.9452 793.4558 79.9452 781.464 201.8615 783.4626 199.8629 797.453"
            />
            <polygon
              className="map-roof"
              points="191.8684 815.4407 77.9465 811.4434 77.9465 799.4517 193.867 801.4503 191.8684 815.4407"
            />
            <polygon
              className="map-roof"
              points="91.9369 867.4051 131.9095 869.4037 129.9109 881.3955 61.9575 879.3968 59.9589 845.4201 91.9369 849.4174 91.9369 867.4051"
            />
            <polygon
              className="map-roof"
              points="201.8615 833.4284 199.8629 879.3968 149.8972 877.3982 151.8958 857.4119 95.9342 853.4147 95.9342 839.4243 151.8958 841.4229 153.8944 831.4297 201.8615 833.4284"
            />
            <polygon
              className="map-roof"
              points="319.7807 817.4393 297.7957 817.4393 297.7957 797.453 319.6326 797.2852 319.7807 817.4393"
            />
            <polygon
              className="map-roof"
              points="743.4901 911.3749 583.5997 905.379 583.5997 885.3927 745.4887 889.39 743.4901 911.3749"
            />
            <polygon
              className="map-roof"
              points="731.4983 985.3242 631.5668 981.3269 631.5668 969.3352 733.4969 973.3324 731.4983 985.3242"
            />
            <polygon
              className="map-roof"
              points="851.416 987.3228 745.4887 985.3242 745.4887 971.3338 851.416 973.3324 851.416 987.3228"
            />
            <rect
              className="map-roof"
              x="535.6326"
              y="621.5737"
              width="31.9781"
              height="61.9575"
            />

            <rect
              className="map-roof"
              x="801.4503"
              y="737.4942"
              width="27.9808"
              height="67.9534"
            />
            <polygon
              className="map-roof"
              points="735.4955 809.4448 703.5175 809.4448 705.5161 747.4873 735.4955 747.4873 735.4955 809.4448"
            />
            <polygon
              className="map-roof"
              points="759.4791 719.5065 741.4914 719.5065 743.4901 677.5353 759.4791 679.5339 759.4791 719.5065"
            />

            <polygon
              className="map-roof"
              points="677.5353 1043.2844 641.56 1043.2844 641.56 1023.2981 661.5463 1023.2981 661.5463 1015.3036 679.5339 1015.3036 677.5353 1043.2844"
            />

            <polygon
              className="map-roof"
              points="625.5709 1027.2954 593.5929 1025.2968 593.5929 1015.3036 627.5696 1017.3023 625.5709 1027.2954"
            />

            <rect
              className="map-roof"
              x="565.6121"
              y="1011.3064"
              width="21.9849"
              height="19.9863"
            />

            <polygon
              className="map-roof"
              points="1071.2652 985.3242 965.3379 985.3242 965.3379 949.3489 1071.2652 953.3461 1071.2652 985.3242"
            />

            <polygon
              className="map-roof"
              points="743.4901 1041.2858 687.5284 1039.2872 689.5271 1019.3009 743.4901 1021.2995 743.4901 1041.2858"
            />
            <polygon
              className="map-roof"
              points="797.453 1035.2899 765.475 1035.2899 767.4736 1015.3036 799.4517 1017.3023 797.453 1035.2899"
            />
            <polygon
              className="map-roof"
              points="895.3859 1037.2885 823.4352 1033.2913 823.4352 1019.3009 895.3859 1023.2981 895.3859 1037.2885"
            />
            <polygon
              className="map-roof"
              points="907.3776 977.3297 883.3941 977.3297 885.3927 889.39 908.5597 889.823 907.3776 977.3297"
            />

            <polygon
              className="map-roof"
              points="881.3955 937.3571 869.4037 937.3571 869.4037 889.39 883.3941 889.39 881.3955 937.3571"
            />
            <polygon
              className="map-roof"
              points="325.7766 885.3927 309.7875 885.3927 313.7848 867.4051 327.7752 869.4037 325.7766 885.3927"
            />
            <polygon
              className="map-roof"
              points="347.7615 883.3941 333.7711 883.3941 335.7697 869.4037 349.7601 871.4023 347.7615 883.3941"
            />
            <polygon
              className="map-roof"
              points="369.7464 885.3927 357.7546 885.3927 357.7546 869.4037 369.7464 871.4023 369.7464 885.3927"
            />
            <rect
              className="map-roof"
              x="423.7094"
              y="907.3776"
              width="93.9356"
              height="11.9918"
            />
            <polygon
              className="map-roof"
              points="217.8506 705.5161 157.8917 699.5202 159.8903 685.5298 219.8492 689.5271 217.8506 705.5161"
            />
            <polygon
              className="map-roof"
              points="321.7793 717.5079 265.8177 715.5092 267.8163 693.5243 321.7793 693.5243 321.7793 717.5079"
            />
            <rect
              className="map-roof"
              x="343.7642"
              y="695.523"
              width="53.963"
              height="21.9849"
            />

            <polygon
              className="map-roof"
              points="353.7574 1151.2104 321.7793 1149.2118 321.7793 1129.2255 353.7574 1131.2241 353.7574 1151.2104"
            />
          </g>

          {/* Buildings Layer */}
          <g id="buildings">
            <polygon
              id="第二体育館"
              className="map-building"
              points="213.8533 275.8108 133.9082 275.8108 131.9095 283.8053 109.9246 283.8053 109.9246 273.8122 81.9438 273.8122 81.9438 251.8273 25.9822 249.8286 29.9794 103.9287 223.8465 107.926 213.8533 275.8108"
            />

            <polygon
              id="管理棟"
              className="map-building"
              points="267.8163 777.4668 263.8191 897.3845 387.7341 899.3831 387.7341 879.3968 433.7025 881.3955 431.7039 953.3461 63.9561 943.353 67.9534 893.3872 207.8574 895.3859 211.0996 776.0485 267.8163 777.4668"
            />
            <polygon
              id="図書館棟"
              className="map-building"
              points="613.5792 365.7491 637.5627 365.7491 637.5627 415.7149 647.5559 415.7149 647.5559 451.6902 637.5627 451.6902 637.5627 499.6573 581.6011 499.6573 581.6011 545.6258 667.5421 545.6258 667.5421 629.5682 509.6504 629.5682 509.6504 535.6326 525.6395 535.6326 525.6395 497.6587 513.6477 497.6587 513.6477 359.7533 613.5792 361.7519 613.5792 365.7491"
            />
            <polygon
              id="学生会館"
              className="map-building"
              points="661.5463 791.4572 515.6463 785.4613 515.6463 675.5367 661.5463 675.5367 661.5463 791.4572"
            />
            <polygon
              id="物質棟"
              className="map-building"
              points="817.4393 1149.2118 531.6354 1141.2173 529.6367 1057.2748 549.623 1057.2748 549.623 1061.2721 591.5942 1063.2707 595.5915 1053.2776 887.3914 1069.2666 885.3927 1149.2118 835.427 1149.2118 817.4393 1149.2118"
            />
            <polygon
              id="一般棟"
              className="map-building"
              points="853.4147 963.3393 549.623 955.3447 547.6244 961.3406 511.6491 959.342 513.6477 889.39 553.6203 891.3886 555.6189 905.379 855.4133 917.3708 853.4147 963.3393"
            />
            <polygon
              id="第一体育館"
              className="map-building"
              points="1077.2611 1197.1789 1069.2666 1197.1789 1065.2694 1227.1583 959.342 1225.1597 961.3406 1199.1775 953.3461 1199.1775 955.3447 979.3283 1081.2584 981.3269 1077.2611 1197.1789"
            />
            <polygon
              id="経営情報学科棟"
              className="map-building"
              points="831.4297 835.427 831.4297 795.4544 935.3585 799.4517 935.3585 805.4476 955.3447 807.4462 955.3447 839.4243 831.4297 835.427"
            />

            <polygon
              id="ものづくり工房"
              className="map-building"
              points="793.4558 803.4489 739.4928 803.4489 741.4914 717.5079 795.4544 719.5065 793.4558 803.4489"
            />

            <polygon
              id="実習工場"
              className="map-building"
              points="287.8026 435.7012 73.9493 425.708 73.9493 388.4282 61.9575 385.7354 63.9561 369.7464 73.9493 369.7464 77.9465 305.7903 115.9205 307.7889 115.9205 321.7793 155.8931 321.7793 155.8931 335.7697 289.8012 345.7628 287.8026 435.7012"
            />
            <polygon
              id="経営情報学科棟2"
              className="map-building"
              points="447.6929 447.6929 299.7944 441.697 301.793 409.719 293.7985 407.7204 295.7971 351.7587 451.6902 357.7546 447.6929 447.6929"
            />
            <polygon
              id="実習工場2"
              className="map-building"
              points="307.7889 643.5586 71.9507 637.5627 81.9438 487.6655 309.7875 495.66 307.8605 638.2678 307.7889 643.5586"
            />
            <polygon
              id="制御情報工学科棟"
              className="map-building"
              points="425.708 565.6121 311.7862 563.6134 313.7848 503.6546 425.708 507.6518 425.708 565.6121"
            />
            <polygon
              id="地域共同テクノセンター"
              className="map-building"
              points="425.708 641.56 307.8605 638.2678 308.815 567.6285 425.708 571.6079 425.708 641.56"
            />
            <polygon
              id="機電棟"
              className="map-building"
              points="439.6984 783.4626 267.8163 777.4668 211.0996 776.0485 69.952 771.4709 69.952 717.5079 439.6984 727.501 439.6984 783.4626"
            />
            <polygon
              id="専攻科棟"
              className="map-building"
              points="153.8944 1133.2227 57.9602 1135.2214 59.9589 1047.2817 243.8328 1053.2776 241.8341 1133.2227 171.8821 1131.2241 169.8835 1121.231 153.8944 1121.231 153.8944 1133.2227"
            />
            <polygon
              className="map-building"
              points="533.634 1111.2378 511.6491 1111.2378 513.6477 957.3434 533.634 957.3434 533.634 1111.2378"
            />
            <polygon
              id="武道場"
              className="map-building"
              points="1187.1857 1169.1981 1131.2241 1165.2008 1129.2977 1008.296 1189.1844 1011.3064 1187.1857 1169.1981"
            />
          </g>

          {/* ピンはSVG外部にレンダリング - SVG内には何も表示しない */}
        </svg>

        {/* 独立したピンレイヤー（SVG外部、固定サイズ） */}
        <div
          className="map-pins-layer"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 1, // 常に表示（非表示機能を無効化）
            transform: "translateZ(0)", // GPU加速を有効化
            backfaceVisibility: "hidden", // GPU加速の最適化
          }}
        >
          {pinsScreenPositions.map(
            ({
              cluster,
              screenPosition,
              visible,
              showLabel,
              labelPosition,
            }) => {
              // クラスターが非表示の場合はスキップ
              if (!visible) return null;

              if (cluster.count === 1) {
                const point = cluster.points[0];
                const isHovered = hoveredPoint === point.id;
                const isMobileHovered = mobileHoveredPoint === point.id;

                // location タイプはピンとして表示しない
                if (point.type === "location") return null;

                return (
                  <MapPin
                    key={cluster.id}
                    id={point.id}
                    position={screenPosition}
                    svgCoordinate={cluster.coordinates}
                    type={
                      point.type as
                        | "event"
                        | "exhibit"
                        | "stall"
                        | "toilet"
                        | "trash"
                    }
                    color={point.color}
                    label={showLabel ? point.title : undefined}
                    labelPosition={
                      labelPosition ||
                      (screenPosition.x > viewBox.width / 2 ? "left" : "right")
                    }
                    isHovered={isHovered}
                    isMobileHovered={isMobileHovered}
                    onClick={(e) => {
                      if (e.type === "touchend") {
                        e.stopPropagation();
                        e.preventDefault();
                        handlePointClick(point, undefined, true);
                      } else {
                        handlePointClick(point, e as React.MouseEvent);
                      }
                    }}
                    onMouseEnter={() => handlePointHover(point)}
                    onMouseLeave={() => handlePointHover(null)}
                  />
                );
              }

              // クラスター表示
              const clusterType = cluster.points[0]?.type || "event";
              const typeLabel =
                clusterType === "event"
                  ? "イベント"
                  : clusterType === "exhibit"
                    ? "展示"
                    : "露店";

              return (
                <ClusterPin
                  key={cluster.id}
                  id={cluster.id}
                  position={screenPosition}
                  count={cluster.count}
                  label={
                    showLabel ? `${cluster.count}件の${typeLabel}` : undefined
                  }
                  labelPosition={
                    screenPosition.x > viewBox.width / 2 ? "left" : "right"
                  }
                  isHovered={false}
                  onClick={(e) => {
                    if (e.type === "touchend") {
                      e.stopPropagation();
                      e.preventDefault();
                      handleClusterClick(cluster);
                    } else {
                      handleClusterClick(cluster, e as React.MouseEvent);
                    }
                  }}
                />
              );
            },
          )}

          {/* ハイライトピン - 詳細ページとインタラクティブページでは非表示 */}
          {highlightScreenPosition &&
            mode !== "detail" &&
            mode !== "interactive" && (
              <HighlightPin position={highlightScreenPosition} />
            )}
        </div>

        {/* Single Content Card Overlay */}
        {selectedPoint && selectedPoint.contentItem && (
          <div
            className="map-card-overlay pointer-events-auto absolute z-30"
            style={{
              left: `${cardPosition.x}px`,
              top: `${cardPosition.y}px`,
              transform: cardPosition.transform || "translate(-50%, -50%)",
              width: "240px", // 300px → 240px に縮小
            }}
          >
            {/* Mobile hover indicator */}
            {mobileHoveredPoint === selectedPoint.id && (
              <div
                className="absolute -top-2 -right-2 z-10 rounded-full bg-blue-500 px-2 py-1 text-xs text-white shadow-lg"
                style={{ fontSize: "10px" }}
              >
                タップで詳細へ
              </div>
            )}

            {/* Content Card */}
            <div
              style={{
                width: "240px",
                position: "relative",
              }}
            >
              {/* カードと背景を重ねる領域 */}
              <div
                style={{
                  position: "relative",
                }}
              >
                {/* 背景フレーム */}
                <div
                  className="card-background pointer-events-none absolute rounded-lg shadow-xl transition-all duration-200"
                  style={{
                    border: "2px solid white",
                    padding: "2px",
                    background:
                      selectedPoint.contentItem.type === "event"
                        ? "#EA4335"
                        : selectedPoint.contentItem.type === "exhibit"
                          ? "#4285F4"
                          : "#FF6B35",
                    transform: "translateY(0)",
                    zIndex: 0,
                    top: "-6px",
                    left: "-6px",
                    right: "-6px",
                    bottom: "-6px",
                  }}
                />
                {/* カードコンテンツ - カード自体がホバーを検知 */}
                <div
                  className="card-content"
                  style={{
                    display: "contents",
                  }}
                  onMouseEnter={(e) => {
                    // カード内のホバーで背景を動かす
                    const bg = e.currentTarget.parentElement?.querySelector(
                      ".card-background",
                    ) as HTMLElement;
                    if (bg) {
                      bg.style.transform = "translateY(-4px)";
                      bg.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const bg = e.currentTarget.parentElement?.querySelector(
                      ".card-background",
                    ) as HTMLElement;
                    if (bg) {
                      bg.style.transform = "translateY(0)";
                      bg.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
                    }
                  }}
                >
                  <UnifiedCard
                    item={selectedPoint.contentItem}
                    variant="compact"
                    showTags={true}
                    showDescription={true}
                    showAnimation={false}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multiple Content Cards Overlay (Cluster) */}
        {selectedCluster && selectedCluster.length > 0 && (
          <div
            className="map-card-overlay pointer-events-auto absolute z-30"
            style={{
              left: `${cardPosition.x}px`,
              maxHeight: "360px", // さらに縮小
              top: `${cardPosition.y}px`,
              transform: cardPosition.transform || "translate(-50%, -50%)",
              width: "280px", // 320px → 280px にさらに縮小
            }}
          >
            {/* Cluster Cards Container - シンプルでモダンなデザイン */}
            <div
              className="overflow-hidden rounded-xl bg-white/50 shadow-2xl backdrop-blur-sm"
              style={{
                width: "100%",
                border: "1px solid rgba(255, 255, 255, 0.5)",
              }}
            >
              {/* Header - アイコン別の件数表示 */}
              <div
                className="flex items-center gap-3 border-b border-gray-100/30 px-4 py-3"
                style={{
                  background: "transparent",
                }}
              >
                {(() => {
                  // 各タイプの件数をカウント
                  const counts = selectedCluster.reduce(
                    (acc, point) => {
                      if (point.contentItem) {
                        const type = point.contentItem.type;
                        acc[type] = (acc[type] || 0) + 1;
                      }
                      return acc;
                    },
                    {} as Record<string, number>,
                  );

                  return (
                    <>
                      {counts.event && counts.event > 0 && (
                        <div className="flex items-center gap-1.5">
                          <ItemTypeIcon type="event" size="small" />
                          <span className="text-sm font-semibold text-gray-700">
                            {counts.event}
                          </span>
                        </div>
                      )}
                      {counts.exhibit && counts.exhibit > 0 && (
                        <div className="flex items-center gap-1.5">
                          <ItemTypeIcon type="exhibit" size="small" />
                          <span className="text-sm font-semibold text-gray-700">
                            {counts.exhibit}
                          </span>
                        </div>
                      )}
                      {counts.stall && counts.stall > 0 && (
                        <div className="flex items-center gap-1.5">
                          <ItemTypeIcon type="stall" size="small" />
                          <span className="text-sm font-semibold text-gray-700">
                            {counts.stall}
                          </span>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Cards List - コンパクトな表示 */}
              <div
                className="overflow-visible p-2" // overflow-y-auto → overflow-visible に変更
                style={{
                  maxHeight: "300px",
                  overflowY: "auto", // スタイルでスクロールを制御
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
                }}
              >
                <div className="space-y-1.5">
                  {selectedCluster
                    .filter((point) => point.contentItem)
                    .map((point, index) => {
                      // ピンと同じアクセントカラーを取得
                      const accentColor =
                        point.contentItem!.type === "event"
                          ? "#EA4335" // ピンと同じ赤
                          : point.contentItem!.type === "exhibit"
                            ? "#4285F4" // ピンと同じ青
                            : "#FF6B35"; // ピンと同じオレンジ (stall)

                      return (
                        <div
                          key={`${point.id}-${index}`}
                          style={{
                            position: "relative",
                          }}
                        >
                          {/* カードと背景を重ねる領域 */}
                          <div
                            style={{
                              position: "relative",
                            }}
                          >
                            {/* 背景フレーム */}
                            <div
                              className="cluster-card-background pointer-events-none absolute rounded-lg transition-all duration-200"
                              style={{
                                border: "2px solid white",
                                padding: "2px",
                                background: accentColor,
                                transform: "translateY(0)",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                zIndex: 0,
                                top: "-8px",
                                left: "-8px",
                                right: "-8px",
                                bottom: "-8px",
                              }}
                            />
                            {/* カードコンテンツ - カード自体がホバーを検知 */}
                            <div
                              className="cluster-card-content"
                              style={{
                                display: "contents",
                              }}
                              onMouseEnter={(e) => {
                                const bg =
                                  e.currentTarget.parentElement?.querySelector(
                                    ".cluster-card-background",
                                  ) as HTMLElement;
                                if (bg) {
                                  bg.style.transform = "translateY(-4px)";
                                  bg.style.boxShadow =
                                    "0 8px 16px rgba(0, 0, 0, 0.25)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                const bg =
                                  e.currentTarget.parentElement?.querySelector(
                                    ".cluster-card-background",
                                  ) as HTMLElement;
                                if (bg) {
                                  bg.style.transform = "translateY(0)";
                                  bg.style.boxShadow =
                                    "0 2px 8px rgba(0, 0, 0, 0.15)";
                                }
                              }}
                            >
                              <UnifiedCard
                                item={point.contentItem!}
                                variant="compact"
                                showTags={false}
                                showDescription={false}
                                showAnimation={false}
                                className="border-0"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VectorMap;
