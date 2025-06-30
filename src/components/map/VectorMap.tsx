import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { CAMPUS_MAP_BOUNDS } from "../../data/buildings";
import { UnifiedCard } from "../../shared/components/ui/UnifiedCard";
import { Item } from "../../types/common";

interface Coordinate {
  x: number;
  y: number;
}

interface InteractivePoint {
  id: string;
  coordinates: Coordinate;
  title: string;
  type: "event" | "exhibit" | "stall" | "location";
  size?: number;
  color?: string;
  isSelected?: boolean;
  isHovered?: boolean;
  contentItem?: Item; // コンテンツカード表示用
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
  maxZoom?: number;
  minZoom?: number;
}

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const VectorMap: React.FC<VectorMapProps> = ({
  mode = "display",
  height = "400px",
  className = "",
  points = [],
  highlightPoint,
  onPointClick,
  onPointHover,
  onMapClick,
  showControls = true,
  maxZoom = 10,
  minZoom = 0.1,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // マップの実際の範囲に合わせた調整済み境界
  // 削除した右側屋根部分を考慮して幅を1100に調整、上下左右に適度な余白を追加
  const ADJUSTED_MAP_BOUNDS = {
    width: 1100, // 右側を削除したため幅を縮小
    height: 800, // 高さも適度に調整
    marginX: 50, // 左右の余白
    marginY: 40, // 上下の余白
  };

  const [viewBox, setViewBox] = useState<ViewBox>({
    x: 0,
    y: 0,
    width: CAMPUS_MAP_BOUNDS.width,
    height: CAMPUS_MAP_BOUNDS.height,
  });

  // Interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Coordinate>({ x: 0, y: 0 });
  const [dragStartViewBox, setDragStartViewBox] = useState<ViewBox>(viewBox);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // Touch state for mobile
  const [touchDistance, setTouchDistance] = useState<number>(0);
  const [, setTouchCenter] = useState<Coordinate>({ x: 0, y: 0 });

  // Content card state
  const [selectedPoint, setSelectedPoint] = useState<InteractivePoint | null>(
    null
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

  // マップ操作でカードを閉じる関数
  const closeCard = useCallback(() => {
    if (selectedPoint) {
      setSelectedPoint(null);
    }
    if (selectedCluster) {
      setSelectedCluster(null);
    }
  }, [selectedPoint, selectedCluster]);

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = useCallback(
    (screenX: number, screenY: number): Coordinate => {
      if (!svgRef.current) return { x: 0, y: 0 };

      const svgRect = svgRef.current.getBoundingClientRect();

      // スクリーン座標をSVG要素内の相対座標に変換
      const relativeX = screenX - svgRect.left;
      const relativeY = screenY - svgRect.top;

      // SVG座標系に変換（viewBoxを考慮）
      const svgX = viewBox.x + (relativeX / svgRect.width) * viewBox.width;
      const svgY = viewBox.y + (relativeY / svgRect.height) * viewBox.height;

      return { x: svgX, y: svgY };
    },
    [viewBox]
  );

  // Zoom functions with viewBox precision
  const zoomIn = useCallback(() => {
    setViewBox((prev) => {
      const scale = 0.8; // 20% zoom in
      const newWidth = prev.width * scale;
      const newHeight = prev.height * scale;
      const centerX = prev.x + prev.width / 2;
      const centerY = prev.y + prev.height / 2;

      // パン制限をズームイン操作にも適用
      const mapWidth = CAMPUS_MAP_BOUNDS.width;
      const mapHeight = CAMPUS_MAP_BOUNDS.height;

      // 方向別の余白設定（左・上をより広く）
      const paddingLeft = mapWidth * 0.3; // 左方向：30%
      const paddingRight = mapWidth * 0.1; // 右方向：10%
      const paddingTop = mapHeight * 0.3; // 上方向：30%
      const paddingBottom = mapHeight * 0.1; // 下方向：10%

      const maxX = mapWidth + paddingRight - newWidth;
      const minX = -paddingLeft;
      const maxY = mapHeight + paddingBottom - newHeight;
      const minY = -paddingTop;

      return {
        x: Math.max(minX, Math.min(maxX, centerX - newWidth / 2)),
        y: Math.max(minY, Math.min(maxY, centerY - newHeight / 2)),
        width: Math.max(
          newWidth,
          (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
            maxZoom
        ),
        height: Math.max(
          newHeight,
          (ADJUSTED_MAP_BOUNDS.height + ADJUSTED_MAP_BOUNDS.marginY * 2) /
            maxZoom
        ),
      };
    });
  }, [maxZoom, ADJUSTED_MAP_BOUNDS]);

  const zoomOut = useCallback(() => {
    setViewBox((prev) => {
      const scale = 1.25; // 25% zoom out
      const newWidth = prev.width * scale;
      const newHeight = prev.height * scale;
      const centerX = prev.x + prev.width / 2;
      const centerY = prev.y + prev.height / 2;

      // パン制限をズームアウト操作にも適用
      const mapWidth = CAMPUS_MAP_BOUNDS.width;
      const mapHeight = CAMPUS_MAP_BOUNDS.height;

      // 方向別の余白設定（左・上をより広く）
      const paddingLeft = mapWidth * 0.3; // 左方向：30%
      const paddingRight = mapWidth * 0.1; // 右方向：10%
      const paddingTop = mapHeight * 0.3; // 上方向：30%
      const paddingBottom = mapHeight * 0.1; // 下方向：10%

      const maxX = mapWidth + paddingRight - newWidth;
      const minX = -paddingLeft;
      const maxY = mapHeight + paddingBottom - newHeight;
      const minY = -paddingTop;

      return {
        x: Math.max(minX, Math.min(maxX, centerX - newWidth / 2)),
        y: Math.max(minY, Math.min(maxY, centerY - newHeight / 2)),
        width: Math.min(
          newWidth,
          (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
            minZoom
        ),
        height: Math.min(
          newHeight,
          (ADJUSTED_MAP_BOUNDS.height + ADJUSTED_MAP_BOUNDS.marginY * 2) /
            minZoom
        ),
      };
    });
  }, [minZoom, ADJUSTED_MAP_BOUNDS]);

  const resetView = useCallback(() => {
    setViewBox({
      x: 0,
      y: 0,
      width: CAMPUS_MAP_BOUNDS.width,
      height: CAMPUS_MAP_BOUNDS.height,
    });
  }, []);

  const zoomToPoint = useCallback(
    (point: Coordinate, zoomLevel: number = 2) => {
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
        x: Math.max(minX, Math.min(maxX, centerX)),
        y: Math.max(minY, Math.min(maxY, centerY)),
        width: targetWidth,
        height: targetHeight,
      });
    },
    []
  );

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;

      // マップ操作開始時にカードを閉じる
      closeCard();

      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragStartViewBox(viewBox);
      e.preventDefault();
    },
    [viewBox, closeCard]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const scaleX = viewBox.width / containerRect.width;
      const scaleY = viewBox.height / containerRect.height;

      const newX = dragStartViewBox.x - deltaX * scaleX;
      const newY = dragStartViewBox.y - deltaY * scaleY;

      // パン範囲制限：マップの表示可能範囲を定義
      const mapWidth = CAMPUS_MAP_BOUNDS.width;
      const mapHeight = CAMPUS_MAP_BOUNDS.height;

      // 方向別の余白設定（左・上をより広く）
      const paddingLeft = mapWidth * 0.3; // 左方向：30%
      const paddingRight = mapWidth * 0.1; // 右方向：10%
      const paddingTop = mapHeight * 0.3; // 上方向：30%
      const paddingBottom = mapHeight * 0.1; // 下方向：10%

      const maxX = mapWidth + paddingRight - viewBox.width; // 右方向の制限
      const minX = -paddingLeft; // 左方向の制限
      const maxY = mapHeight + paddingBottom - viewBox.height; // 下方向の制限
      const minY = -paddingTop; // 上方向の制限

      setViewBox({
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(minY, Math.min(maxY, newY)),
        width: dragStartViewBox.width,
        height: dragStartViewBox.height,
      });
    },
    [isDragging, dragStart, dragStartViewBox, viewBox.width, viewBox.height]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // SVGの実際の描画領域を計算する関数
  const getSVGContentRect = useCallback(
    (svgRect: DOMRect) => {
      // viewBoxのアスペクト比
      const viewBoxRatio = viewBox.width / viewBox.height;
      // SVG要素のアスペクト比
      const svgRatio = svgRect.width / svgRect.height;

      let contentWidth: number,
        contentHeight: number,
        offsetX: number,
        offsetY: number;

      if (viewBoxRatio > svgRatio) {
        // viewBoxの方が横長 → 横幅がSVGの幅に合わせられ、上下に余白
        contentWidth = svgRect.width;
        contentHeight = svgRect.width / viewBoxRatio;
        offsetX = 0;
        offsetY = (svgRect.height - contentHeight) / 2;
      } else {
        // viewBoxの方が縦長 → 縦幅がSVGの高さに合わせられ、左右に余白
        contentWidth = svgRect.height * viewBoxRatio;
        contentHeight = svgRect.height;
        offsetX = (svgRect.width - contentWidth) / 2;
        offsetY = 0;
      }

      return { width: contentWidth, height: contentHeight, offsetX, offsetY };
    },
    [viewBox]
  );

  // Touch event handlers for mobile
  const getTouchDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: React.TouchList): Coordinate => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();

      // タッチ操作開始時にカードを閉じる
      closeCard();

      if (e.touches.length === 1) {
        setIsDragging(true);
        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        setDragStartViewBox(viewBox);
      } else if (e.touches.length === 2) {
        setIsDragging(false);
        setTouchDistance(getTouchDistance(e.touches));
        setTouchCenter(getTouchCenter(e.touches));
      }
    },
    [viewBox, closeCard]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      // マップコンテナ内のタッチイベントかチェック
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const isWithinContainer = touch && 
        touch.clientX >= containerRect.left &&
        touch.clientX <= containerRect.right &&
        touch.clientY >= containerRect.top &&
        touch.clientY <= containerRect.bottom;

      // マップ範囲内のタッチのみ処理し、範囲外は通常のスクロールを許可
      if (!isWithinContainer) return;

      e.preventDefault();

      if (e.touches.length === 1 && isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const deltaX = e.touches[0].clientX - dragStart.x;
        const deltaY = e.touches[0].clientY - dragStart.y;

        const scaleX = viewBox.width / containerRect.width;
        const scaleY = viewBox.height / containerRect.height;

        const newX = dragStartViewBox.x - deltaX * scaleX;
        const newY = dragStartViewBox.y - deltaY * scaleY;

        // パン範囲制限：マップの表示可能範囲を定義
        const mapWidth = CAMPUS_MAP_BOUNDS.width;
        const mapHeight = CAMPUS_MAP_BOUNDS.height;

        // 方向別の余白設定（左・上をより広く）
        const paddingLeft = mapWidth * 0.3; // 左方向：30%
        const paddingRight = mapWidth * 0.1; // 右方向：10%
        const paddingTop = mapHeight * 0.3; // 上方向：30%
        const paddingBottom = mapHeight * 0.1; // 下方向：10%

        const maxX = mapWidth + paddingRight - viewBox.width; // 右方向の制限
        const minX = -paddingLeft; // 左方向の制限
        const maxY = mapHeight + paddingBottom - viewBox.height; // 下方向の制限
        const minY = -paddingTop; // 上方向の制限

        setViewBox({
          x: Math.max(minX, Math.min(maxX, newX)),
          y: Math.max(minY, Math.min(maxY, newY)),
          width: dragStartViewBox.width,
          height: dragStartViewBox.height,
        });
      } else if (e.touches.length === 2 && touchDistance > 0) {
        const newDistance = getTouchDistance(e.touches as any);
        const newCenter = getTouchCenter(e.touches as any);
        const scale = touchDistance / newDistance;

        const centerSVG = screenToSVG(newCenter.x, newCenter.y);

        setViewBox((prev) => {
          const newWidth = Math.max(
            Math.min(
              prev.width * scale,
              (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
                minZoom
            ),
            (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
              maxZoom
          );
          const newHeight = Math.max(
            Math.min(
              prev.height * scale,
              (ADJUSTED_MAP_BOUNDS.height + ADJUSTED_MAP_BOUNDS.marginY * 2) /
                minZoom
            ),
            (ADJUSTED_MAP_BOUNDS.height + ADJUSTED_MAP_BOUNDS.marginY * 2) /
              maxZoom
          );

          // パン範囲制限をズーム操作にも適用
          const mapWidth = CAMPUS_MAP_BOUNDS.width;
          const mapHeight = CAMPUS_MAP_BOUNDS.height;

          // 方向別の余白設定（左・上をより広く）
          const paddingLeft = mapWidth * 0.3; // 左方向：30%
          const paddingRight = mapWidth * 0.1; // 右方向：10%
          const paddingTop = mapHeight * 0.3; // 上方向：30%
          const paddingBottom = mapHeight * 0.1; // 下方向：10%

          const maxX = mapWidth + paddingRight - newWidth;
          const minX = -paddingLeft;
          const maxY = mapHeight + paddingBottom - newHeight;
          const minY = -paddingTop;

          return {
            x: Math.max(minX, Math.min(maxX, centerSVG.x - newWidth / 2)),
            y: Math.max(minY, Math.min(maxY, centerSVG.y - newHeight / 2)),
            width: newWidth,
            height: newHeight,
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
    ]
  );

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // マップコンテナ内のタッチエンドイベントかチェック
    if (!containerRef.current) return;
    
    // タッチエンドの場合は残っているタッチがマップ内にあるかチェック
    if (e.touches.length > 0) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const isWithinContainer = touch && 
        touch.clientX >= containerRect.left &&
        touch.clientX <= containerRect.right &&
        touch.clientY >= containerRect.top &&
        touch.clientY <= containerRect.bottom;

      // マップ範囲外のタッチエンドは無視
      if (!isWithinContainer) return;
    }

    e.preventDefault();
    if (e.touches.length === 0) {
      setIsDragging(false);
      setTouchDistance(0);
    }
  }, []);

  // Wheel zoom handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!containerRef.current) return;

      // マップコンテナ内のホイールイベントかチェック
      const containerRect = containerRef.current.getBoundingClientRect();
      const isWithinContainer = 
        e.clientX >= containerRect.left &&
        e.clientX <= containerRect.right &&
        e.clientY >= containerRect.top &&
        e.clientY <= containerRect.bottom;

      // マップ範囲外のホイールは通常のスクロールを許可
      if (!isWithinContainer) return;

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

      // ズーム操作時にカードを閉じる
      closeCard();

      const mouseSVG = screenToSVG(e.clientX, e.clientY);

      const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;

      setViewBox((prev) => {
        const newWidth = Math.max(
          Math.min(
            prev.width * zoomFactor,
            (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
              minZoom
          ),
          (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
            maxZoom
        );
        const newHeight = Math.max(
          Math.min(
            prev.height * zoomFactor,
            (ADJUSTED_MAP_BOUNDS.height + ADJUSTED_MAP_BOUNDS.marginY * 2) /
              minZoom
          ),
          (ADJUSTED_MAP_BOUNDS.height + ADJUSTED_MAP_BOUNDS.marginY * 2) /
            maxZoom
        );

        // パン制限をホイールズーム操作にも適用
        const mapWidth = CAMPUS_MAP_BOUNDS.width;
        const mapHeight = CAMPUS_MAP_BOUNDS.height;

        // 方向別の余白設定（左・上をより広く）
        const paddingLeft = mapWidth * 0.3; // 左方向：30%
        const paddingRight = mapWidth * 0.1; // 右方向：10%
        const paddingTop = mapHeight * 0.3; // 上方向：30%
        const paddingBottom = mapHeight * 0.1; // 下方向：10%

        const maxX = mapWidth + paddingRight - newWidth;
        const minX = -paddingLeft;
        const maxY = mapHeight + paddingBottom - newHeight;
        const minY = -paddingTop;

        return {
          x: Math.max(
            minX,
            Math.min(
              maxX,
              mouseSVG.x - (mouseSVG.x - prev.x) * (newWidth / prev.width)
            )
          ),
          y: Math.max(
            minY,
            Math.min(
              maxY,
              mouseSVG.y - (mouseSVG.y - prev.y) * (newHeight / prev.height)
            )
          ),
          width: newWidth,
          height: newHeight,
        };
      });
    },
    [screenToSVG, minZoom, maxZoom, closeCard]
  );

  // Point interaction handlers
  const handlePointClick = useCallback(
    (point: InteractivePoint, screenEvent?: React.MouseEvent) => {
      // コンテンツカードを表示
      if (point.contentItem) {
        setSelectedPoint(point);
        setSelectedCluster(null); // クラスターを閉じる

        // カードの最適な表示位置を計算
        const position = calculateCardPosition(
          point.coordinates,
          screenEvent,
          false
        );
        setCardPosition(position);
      }

      point.onClick?.();
      onPointClick?.(point.id);
    },
    [onPointClick, viewBox]
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
        true
      );
      setCardPosition(position);
    },
    [viewBox]
  );

  const handlePointHover = useCallback(
    (point: InteractivePoint | null) => {
      const newHoveredId = point?.id || null;
      setHoveredPoint(newHoveredId);
      onPointHover?.(newHoveredId);
      point?.onHover?.(!!point);
    },
    [onPointHover]
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

        // SVG要素内での正確な相対座標を計算
        const relativeX = e.clientX - svgRect.left;
        const relativeY = e.clientY - svgRect.top;

        // SVGの実際の描画領域を取得
        const contentRect = getSVGContentRect(svgRect);

        // コンテンツ領域内の相対座標に変換
        const contentRelativeX = relativeX - contentRect.offsetX;
        const contentRelativeY = relativeY - contentRect.offsetY;

        // コンテンツ領域制限を緩和（クリック処理）
        // const clickContentMargin =
        //   Math.max(contentRect.width, contentRect.height) * 10;

        // 座標変換: SVG全体で動作する柔軟な変換
        const relativeRatioX = contentRelativeX / contentRect.width;
        const relativeRatioY = contentRelativeY / contentRect.height;

        // viewBox座標系での座標を計算
        const viewBoxX = viewBox.x + relativeRatioX * viewBox.width;
        const viewBoxY = viewBox.y + relativeRatioY * viewBox.height;

        // viewBox座標がそのままマップ座標（1:1の関係）
        const svgX = viewBoxX;
        const svgY = viewBoxY;

        // マップ座標制限を緩和（マップ外でもポイント選択可能）
        const mapClickMargin =
          Math.max(CAMPUS_MAP_BOUNDS.width, CAMPUS_MAP_BOUNDS.height) * 2;
        const clampedX = Math.max(
          -mapClickMargin,
          Math.min(CAMPUS_MAP_BOUNDS.width + mapClickMargin, svgX)
        );
        const clampedY = Math.max(
          -mapClickMargin,
          Math.min(CAMPUS_MAP_BOUNDS.height + mapClickMargin, svgY)
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
    ]
  );

  // Event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
  ]);

  // Auto zoom to highlight point (only once)
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

  // Reset auto zoom flag when highlightPoint changes
  useEffect(() => {
    setHasAutoZoomed(false);
  }, [highlightPoint]);

  // Calculate dynamic point sizes based on zoom level
  const getPointSize = useCallback(
    (baseSize: number = 8) => {
      const zoomLevel =
        (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
        viewBox.width;
      return Math.max(baseSize / Math.sqrt(zoomLevel), 4);
    },
    [viewBox.width, ADJUSTED_MAP_BOUNDS]
  );

  const getTextSize = useCallback(() => {
    const zoomLevel =
      (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
      viewBox.width;
    return Math.max(12 / Math.sqrt(zoomLevel), 8);
  }, [viewBox.width, ADJUSTED_MAP_BOUNDS]);

  // テキスト表示のズームレベル制御
  const shouldShowText = useCallback(() => {
    // 詳細ページではテキストを表示しない
    if (mode === "detail") return false;

    const zoomLevel =
      (ADJUSTED_MAP_BOUNDS.width + ADJUSTED_MAP_BOUNDS.marginX * 2) /
      viewBox.width;
    // ズームレベルが1.5以上の時のみテキストを表示
    return zoomLevel >= 1.5;
  }, [viewBox.width, ADJUSTED_MAP_BOUNDS, mode]);

  // クラスタリング機能
  const CLUSTER_DISTANCE_THRESHOLD = 35; // ピクセル単位（50→35にさらに減少でクラスタリングを積極化）

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
          otherPoint.coordinates
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
        id: `cluster-${clusterPoints
          .map((p) => p.id)
          .sort()
          .join("-")}`,
        coordinates: { x: centerX, y: centerY },
        points: clusterPoints,
        count: clusterPoints.length,
      });
    }

    return clusters;
  }, [points, viewBox.width]);

  // カードの最適な表示位置を計算する関数
  const calculateCardPosition = useCallback(
    (
      pointCoordinates: Coordinate,
      screenEvent?: React.MouseEvent,
      isCluster: boolean = false
    ) => {
      if (!containerRef.current) return { x: 0, y: 0, placement: "bottom" };

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
      let priorities = { bottom: 1, top: 2, right: 3, left: 4 };

      if (baseX < leftThird) {
        // 左側 - 右方向を優先
        priorities = { right: 1, bottom: 2, top: 3, left: 4 };
      } else if (baseX > rightThird) {
        // 右側 - 左方向を優先
        priorities = { left: 1, bottom: 2, top: 3, right: 4 };
      }

      if (baseY < topThird) {
        // 上部 - 下方向を優先
        priorities = { bottom: 1, right: 2, left: 3, top: 4 };
      } else if (baseY > bottomThird) {
        // 下部 - 上方向を優先
        priorities = { top: 1, right: 2, left: 3, bottom: 4 };
      }

      // 4つの方向での配置可能性をチェック（動的優先順位）
      const placements = [
        {
          name: "bottom",
          x: baseX,
          y: baseY + 50,
          transform: "translate(-50%, 0%)",
          viable: baseY + 50 + cardHeight + margin < containerRect.height,
          finalX: baseX,
          finalY: baseY + 50,
          priority: priorities.bottom,
          spaceAvailable:
            containerRect.height - (baseY + 50 + cardHeight + margin),
        },
        {
          name: "top",
          x: baseX,
          y: baseY - 50,
          transform: "translate(-50%, -100%)",
          viable: baseY - 50 - cardHeight - margin > 0,
          finalX: baseX,
          finalY: baseY - 50,
          priority: priorities.top,
          spaceAvailable: baseY - 50 - cardHeight - margin,
        },
        {
          name: "right",
          x: baseX + 50,
          y: baseY,
          transform: "translate(0%, -50%)",
          viable: baseX + 50 + cardWidth + margin < containerRect.width,
          finalX: baseX + 50,
          finalY: baseY,
          priority: priorities.right,
          spaceAvailable:
            containerRect.width - (baseX + 50 + cardWidth + margin),
        },
        {
          name: "left",
          x: baseX - 50,
          y: baseY,
          transform: "translate(-100%, -50%)",
          viable: baseX - 50 - cardWidth - margin > 0,
          finalX: baseX - 50,
          finalY: baseY,
          priority: priorities.left,
          spaceAvailable: baseX - 50 - cardWidth - margin,
        },
      ];

      // 最適な配置を選択（スペースと位置を考慮）
      const viablePlacements = placements.filter((p) => p.viable);

      let selectedPlacement;
      if (viablePlacements.length > 0) {
        // 利用可能なスペースでソート（降順）し、同じスペースなら優先順位で決定
        selectedPlacement = viablePlacements.sort((a, b) => {
          // まず十分なスペースがあるかチェック
          const aHasSpace = a.spaceAvailable > 50;
          const bHasSpace = b.spaceAvailable > 50;

          if (aHasSpace && !bHasSpace) return -1;
          if (!aHasSpace && bHasSpace) return 1;

          // 両方ともスペースがある、またはない場合は優先順位で決定
          if (aHasSpace && bHasSpace) {
            return a.priority - b.priority;
          }

          // スペースが不足している場合は、より多くのスペースがある方を選択
          return b.spaceAvailable - a.spaceAvailable;
        })[0];
      } else {
        // フォールバック: 最もスペースがある方向を選択
        selectedPlacement = placements.sort(
          (a, b) => b.spaceAvailable - a.spaceAvailable
        )[0];
      }

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
        x: finalX,
        y: finalY,
        transform: selectedPlacement.transform,
        placement: selectedPlacement.name,
      };
    },
    [viewBox]
  );

  const clusters = useMemo(() => createClusters(), [createClusters]);

  // SVGのクリーンアップとレンダリング最適化
  useEffect(() => {
    // コンポーネントアンマウント時のクリーンアップ
    return () => {
      setSelectedPoint(null);
      setSelectedCluster(null);
      setHoveredPoint(null);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden vector-map-container ${className}`}
      style={{
        height,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        userSelect: "none",
        imageRendering: "optimizeQuality" as any,
        shapeRendering: "geometricPrecision" as any,
      }}
    >
      {/* Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <button
            onClick={zoomIn}
            className="p-2 bg-white text-gray-700 rounded hover:bg-gray-100 transition-colors"
            style={{ minWidth: "40px", minHeight: "40px" }}
          >
            ＋
          </button>
          <button
            onClick={zoomOut}
            className="p-2 bg-white text-gray-700 rounded hover:bg-gray-100 transition-colors"
            style={{ minWidth: "40px", minHeight: "40px" }}
          >
            －
          </button>
          <button
            onClick={resetView}
            className="p-2 bg-white text-gray-700 rounded hover:bg-gray-100 transition-colors text-xs"
            style={{ minWidth: "40px", minHeight: "40px" }}
          >
            ⌂
          </button>
        </div>
      )}

      {/* Vector SVG Map */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleSVGClick}
        style={{
          vectorEffect: "non-scaling-stroke",
          shapeRendering: "geometricPrecision",
          textRendering: "geometricPrecision",
          willChange: "transform",
          backfaceVisibility: "hidden",
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
              .map-point:hover { filter: drop-shadow(0 0 8px rgba(0,0,0,0.3)); }
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

        {/* Interactive Points/Clusters Layer */}
        <g id="points">
          {clusters.map((cluster) => (
            <g key={cluster.id} className="map-cluster">
              {cluster.count === 1 ? (
                // 単一ポイント
                <>
                  <circle
                    cx={cluster.coordinates.x}
                    cy={cluster.coordinates.y}
                    r={getPointSize(cluster.points[0].size || 8)}
                    fill={
                      cluster.points[0].color ||
                      getPointColor(cluster.points[0].type)
                    }
                    stroke="white"
                    strokeWidth={2}
                    opacity={
                      cluster.points[0].isHovered ||
                      hoveredPoint === cluster.points[0].id
                        ? 1
                        : 0.9
                    }
                    style={{
                      cursor: "pointer",
                      transition: "opacity 0.2s ease",
                    }}
                    onClick={(e) => handlePointClick(cluster.points[0], e)}
                    onMouseEnter={() => handlePointHover(cluster.points[0])}
                    onMouseLeave={() => handlePointHover(null)}
                  />
                  {shouldShowText() && (
                    <text
                      x={cluster.coordinates.x}
                      y={
                        cluster.coordinates.y -
                        getPointSize(cluster.points[0].size || 8) -
                        5
                      }
                      className="map-text"
                      fontSize={getTextSize()}
                      fill="#1f2937"
                      textAnchor="middle"
                      onClick={(e) => handlePointClick(cluster.points[0], e)}
                      onMouseEnter={() => handlePointHover(cluster.points[0])}
                      onMouseLeave={() => handlePointHover(null)}
                      style={{ cursor: "pointer" }}
                    >
                      {cluster.points[0].title.length > 8
                        ? cluster.points[0].title.substring(0, 8) + "..."
                        : cluster.points[0].title}
                    </text>
                  )}
                </>
              ) : (
                // クラスター（複数ポイント）
                <>
                  <circle
                    cx={cluster.coordinates.x}
                    cy={cluster.coordinates.y}
                    r={getPointSize(12)} // 少し大きめのサイズ
                    fill="#6366f1"
                    stroke="white"
                    strokeWidth={3}
                    opacity={0.9}
                    style={{
                      cursor: "pointer",
                      transition: "opacity 0.2s ease",
                    }}
                    onClick={(e) => handleClusterClick(cluster, e)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                    }}
                  />
                  {shouldShowText() && (
                    <text
                      x={cluster.coordinates.x}
                      y={cluster.coordinates.y}
                      className="map-cluster-text"
                      fontSize={getTextSize() * 0.8}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontWeight="bold"
                      onClick={(e) => handleClusterClick(cluster, e)}
                      style={{ cursor: "pointer", pointerEvents: "none" }}
                    >
                      {cluster.count}
                    </text>
                  )}
                </>
              )}
            </g>
          ))}

          {/* Highlight Point */}
          {highlightPoint && (
            <g>
              {/* Pulsing outer ring */}
              <circle
                cx={highlightPoint.x}
                cy={highlightPoint.y}
                r={getPointSize(25)}
                fill="#8b5cf6"
                opacity="0.3"
              >
                <animate
                  attributeName="r"
                  values={`${getPointSize(20)};${getPointSize(
                    35
                  )};${getPointSize(20)}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.1;0.3"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Main point */}
              <circle
                cx={highlightPoint.x}
                cy={highlightPoint.y}
                r={getPointSize(16)}
                fill="#8b5cf6"
                stroke="white"
                strokeWidth={4}
                opacity="1"
              />
              {/* Inner white dot */}
              <circle
                cx={highlightPoint.x}
                cy={highlightPoint.y}
                r={getPointSize(8)}
                fill="white"
                opacity="0.9"
              />
            </g>
          )}
        </g>
      </svg>

      {/* Single Content Card Overlay */}
      {selectedPoint && selectedPoint.contentItem && (
        <div
          className="absolute z-30 pointer-events-auto map-card-overlay"
          style={{
            left: `${cardPosition.x}px`,
            top: `${cardPosition.y}px`,
            width: "300px",
            transform: cardPosition.transform || "translate(-50%, -50%)",
          }}
        >
          {/* Content Card */}
          <div
            className="rounded-lg shadow-xl overflow-hidden"
            style={{ width: "100%", minHeight: "200px" }}
          >
            <UnifiedCard
              item={selectedPoint.contentItem}
              variant="compact"
              showTags={true}
              showDescription={true}
            />
          </div>
        </div>
      )}

      {/* Multiple Content Cards Overlay (Cluster) */}
      {selectedCluster && selectedCluster.length > 0 && (
        <div
          className="absolute z-30 pointer-events-auto map-card-overlay"
          style={{
            left: `${cardPosition.x}px`,
            top: `${cardPosition.y}px`,
            width: "400px",
            maxHeight: "500px",
            transform: cardPosition.transform || "translate(-50%, -50%)",
          }}
        >
          {/* Cluster Cards Container */}
          <div
            className="rounded-lg shadow-xl overflow-hidden backdrop-blur-sm bg-white/90"
            style={{ width: "100%" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3">
              <h3 className="font-semibold text-sm">
                {selectedCluster.length}件のコンテンツ
              </h3>
            </div>

            {/* Cards List */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-2">
              {selectedCluster
                .filter((point) => point.contentItem)
                .map((point, index) => (
                  <div
                    key={`${point.id}-${index}`}
                    className="border border-gray-100 rounded-lg overflow-hidden"
                  >
                    <UnifiedCard
                      item={point.contentItem!}
                      variant="compact"
                      showTags={false}
                      showDescription={false}
                      className="border-0"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get point color based on type
function getPointColor(type: string): string {
  switch (type) {
    case "event":
      return "#405de6";
    case "exhibit":
      return "#8b5cf6";
    case "stall":
      return "#fcaf45";
    default:
      return "#6b7280";
  }
}

export default VectorMap;
