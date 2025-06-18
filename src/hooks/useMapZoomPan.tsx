import { useCallback, useRef, useState, useEffect } from "react";

interface Point {
  x: number;
  y: number;
}

interface ZoomPanState {
  scale: number;
  translateX: number;
  translateY: number;
}

interface UseMapZoomPanOptions {
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
  mapWidth: number;
  mapHeight: number;
  containerRef: React.RefObject<HTMLElement>;
  onTransformUpdate?: (scale: number) => void;
  overlayRef?: React.RefObject<SVGSVGElement>;
}

export const useMapZoomPan = ({
  minScale = 0.5,
  maxScale = 5,
  initialScale = 1,
  mapWidth,
  mapHeight,
  containerRef,
  onTransformUpdate,
  overlayRef,
}: UseMapZoomPanOptions) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // 現在の変換状態を管理
  const [transform, setTransform] = useState<ZoomPanState>({
    scale: initialScale,
    translateX: 0,
    translateY: 0,
  });

  // ビューポートサイズを取得
  const getViewportSize = useCallback(() => {
    if (!containerRef.current) return { width: 800, height: 600 };
    const rect = containerRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, [containerRef]);

  // 制約を適用した変換を計算 - 依存配列を最小化
  const applyConstraints = useCallback(
    (newTransform: ZoomPanState) => {
      const viewport = getViewportSize();

      // スケールを制限
      const constrainedScale = Math.max(
        minScale,
        Math.min(maxScale, newTransform.scale)
      );

      const scaledMapWidth = mapWidth * constrainedScale;
      const scaledMapHeight = mapHeight * constrainedScale;

      let constrainedTranslateX = newTransform.translateX;
      let constrainedTranslateY = newTransform.translateY;

      // マップが画面より小さい場合は中央に配置
      if (scaledMapWidth <= viewport.width) {
        constrainedTranslateX = (viewport.width - scaledMapWidth) / 2;
      } else {
        // マップが画面より大きい場合は、境界内に制限
        const maxTranslateX = 0;
        const minTranslateX = viewport.width - scaledMapWidth;
        constrainedTranslateX = Math.max(
          minTranslateX,
          Math.min(maxTranslateX, constrainedTranslateX)
        );
      }

      if (scaledMapHeight <= viewport.height) {
        constrainedTranslateY = (viewport.height - scaledMapHeight) / 2;
      } else {
        const maxTranslateY = 0;
        const minTranslateY = viewport.height - scaledMapHeight;
        constrainedTranslateY = Math.max(
          minTranslateY,
          Math.min(maxTranslateY, constrainedTranslateY)
        );
      }

      return {
        scale: constrainedScale,
        translateX: constrainedTranslateX,
        translateY: constrainedTranslateY,
      };
    },
    [minScale, maxScale, mapWidth, mapHeight]
  );

  // 変換を要素に適用 - 依存配列を最小化
  const applyTransformToElements = useCallback(
    (newTransform: ZoomPanState, smooth = false) => {
      const constrainedTransform = applyConstraints(newTransform);

      const transformString = `translate(${constrainedTransform.translateX}px, ${constrainedTransform.translateY}px) scale(${constrainedTransform.scale})`;

      if (svgRef.current) {
        svgRef.current.style.transform = transformString;
        svgRef.current.style.transformOrigin = "0 0";
        if (smooth) {
          svgRef.current.style.transition = "transform 0.3s ease-out";
        } else {
          svgRef.current.style.transition = "none";
        }
      }

      if (overlayRef?.current) {
        overlayRef.current.style.transform = transformString;
        overlayRef.current.style.transformOrigin = "0 0";
        if (smooth) {
          overlayRef.current.style.transition = "transform 0.3s ease-out";
        } else {
          overlayRef.current.style.transition = "none";
        }
      }

      setTransform(constrainedTransform);
      onTransformUpdate?.(constrainedTransform.scale);

      return constrainedTransform;
    },
    []
  );

  // 初期配置を計算 - 依存配列を最小化
  const calculateInitialTransform = useCallback(() => {
    const viewport = getViewportSize();
    const scaleX = viewport.width / mapWidth;
    const scaleY = viewport.height / mapHeight;
    const fitScale = Math.min(scaleX, scaleY) * initialScale;

    const scaledWidth = mapWidth * fitScale;
    const scaledHeight = mapHeight * fitScale;
    const centerX = (viewport.width - scaledWidth) / 2;
    const centerY = (viewport.height - scaledHeight) / 2;

    return {
      scale: fitScale,
      translateX: centerX,
      translateY: centerY,
    };
  }, [mapWidth, mapHeight, initialScale]);

  // 初期化 - 依存配列を最小化して無限ループを防ぐ
  useEffect(() => {
    const initialTransform = calculateInitialTransform();
    applyTransformToElements(initialTransform, false);
  }, [mapWidth, mapHeight, initialScale]); // 関数ではなく基本的なプロパティのみを依存

  // 画面座標から世界座標への変換 - transformを直接参照して依存配列から除外
  const screenToWorldCoordinate = useCallback(
    (screenX: number, screenY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };

      const container = containerRef.current.getBoundingClientRect();
      const relativeX = screenX - container.left;
      const relativeY = screenY - container.top;

      const worldX = (relativeX - transform.translateX) / transform.scale;
      const worldY = (relativeY - transform.translateY) / transform.scale;

      const constrainedX = Math.max(0, Math.min(mapWidth, worldX));
      const constrainedY = Math.max(0, Math.min(mapHeight, worldY));

      return { x: constrainedX, y: constrainedY };
    },
    [mapWidth, mapHeight]
  );

  // マウスカーソル位置を固定点としたズーム - 依存配列を最小化
  const zoomAtPoint = useCallback(
    (centerPoint: Point, newScale: number, smooth = true) => {
      const constrainedScale = Math.max(minScale, Math.min(maxScale, newScale));

      // ズーム前後で同じ世界座標が同じ画面位置に来るように計算
      const viewport = getViewportSize();
      const screenCenter = { x: viewport.width / 2, y: viewport.height / 2 };

      const newTranslateX = screenCenter.x - centerPoint.x * constrainedScale;
      const newTranslateY = screenCenter.y - centerPoint.y * constrainedScale;

      const newTransform = {
        scale: constrainedScale,
        translateX: newTranslateX,
        translateY: newTranslateY,
      };

      applyTransformToElements(newTransform, smooth);
    },
    [minScale, maxScale]
  );

  // 画面中央基準ズームイン - 依存配列を最小化
  const zoomIn = useCallback(() => {
    const viewport = getViewportSize();
    const screenCenter = { x: viewport.width / 2, y: viewport.height / 2 };

    if (!containerRef.current) {
      const worldCenter = screenToWorldCoordinate(
        screenCenter.x,
        screenCenter.y
      );
      const newScale = transform.scale * 1.5;
      zoomAtPoint(worldCenter, newScale);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const worldCenter = screenToWorldCoordinate(
      rect.left + screenCenter.x,
      rect.top + screenCenter.y
    );

    const newScale = transform.scale * 1.5;
    zoomAtPoint(worldCenter, newScale);
  }, []); // 空の依存配列で関数を安定化

  // 画面中央基準ズームアウト - 依存配列を最小化
  const zoomOut = useCallback(() => {
    const viewport = getViewportSize();
    const screenCenter = { x: viewport.width / 2, y: viewport.height / 2 };

    if (!containerRef.current) {
      const worldCenter = screenToWorldCoordinate(
        screenCenter.x,
        screenCenter.y
      );
      const newScale = transform.scale / 1.5;
      zoomAtPoint(worldCenter, newScale);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const worldCenter = screenToWorldCoordinate(
      rect.left + screenCenter.x,
      rect.top + screenCenter.y
    );

    const newScale = transform.scale / 1.5;
    zoomAtPoint(worldCenter, newScale);
  }, []); // 空の依存配列で関数を安定化

  // 特定座標基準ズームイン - 依存配列を最小化
  const zoomInToCoordinate = useCallback((coord: Point) => {
    const newScale = transform.scale * 1.5;
    zoomAtPoint(coord, newScale);
  }, []);

  // 特定座標基準ズームアウト - 依存配列を最小化
  const zoomOutFromCoordinate = useCallback((coord: Point) => {
    const newScale = transform.scale / 1.5;
    zoomAtPoint(coord, newScale);
  }, []);

  // リセット - 依存配列を最小化
  const resetZoom = useCallback(() => {
    const initialTransform = calculateInitialTransform();
    applyTransformToElements(initialTransform, true);
  }, []);

  // パン操作 - 依存配列を最小化
  const pan = useCallback((deltaX: number, deltaY: number) => {
    const newTransform = {
      scale: transform.scale,
      translateX: transform.translateX + deltaX,
      translateY: transform.translateY + deltaY,
    };

    applyTransformToElements(newTransform, false);
  }, []);

  // 特定位置にズーム - 依存配列を最小化
  const zoomToLocation = useCallback(
    (x: number, y: number, targetScale: number = 3) => {
      zoomAtPoint({ x, y }, targetScale, true);
    },
    []
  );

  return {
    svgRef,
    zoomPan: transform,
    zoomIn,
    zoomOut,
    resetZoom,
    zoomToLocation,
    zoomInToCoordinate,
    zoomOutFromCoordinate,
    screenToViewBox: screenToWorldCoordinate,
    pan,
    // 新しいAPI
    zoomAtPoint,
    getViewportSize,
    applyTransform: applyTransformToElements,
  };
};
