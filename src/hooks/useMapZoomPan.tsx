import { useCallback, useRef, useState, useEffect } from "react";

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

  // 制約を適用した変換を計算
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
        // マップが画面より大きい場合は、適度なオーバースクロールを許容
        const overscrollMargin = Math.min(100, scaledMapWidth * 0.1);
        const maxTranslateX = overscrollMargin;
        const minTranslateX =
          viewport.width - scaledMapWidth - overscrollMargin;
        constrainedTranslateX = Math.max(
          minTranslateX,
          Math.min(maxTranslateX, constrainedTranslateX)
        );
      }

      if (scaledMapHeight <= viewport.height) {
        constrainedTranslateY = (viewport.height - scaledMapHeight) / 2;
      } else {
        const overscrollMargin = Math.min(100, scaledMapHeight * 0.1);
        const maxTranslateY = overscrollMargin;
        const minTranslateY =
          viewport.height - scaledMapHeight - overscrollMargin;
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
    [getViewportSize, minScale, maxScale, mapWidth, mapHeight]
  );

  // CSS transformを直接適用
  const applyTransformToElements = useCallback(
    (newTransform: ZoomPanState, smooth = false) => {
      const constrainedTransform = applyConstraints(newTransform);

      const transformString = `translate(${constrainedTransform.translateX}px, ${constrainedTransform.translateY}px) scale(${constrainedTransform.scale})`;

      if (svgRef.current) {
        svgRef.current.style.transform = transformString;
        svgRef.current.style.transformOrigin = "0 0";
        if (smooth) {
          svgRef.current.style.transition = "transform 0.15s ease-out";
        } else {
          svgRef.current.style.transition = "none";
        }
      }

      if (overlayRef?.current) {
        overlayRef.current.style.transform = transformString;
        overlayRef.current.style.transformOrigin = "0 0";
        if (smooth) {
          overlayRef.current.style.transition = "transform 0.15s ease-out";
        } else {
          overlayRef.current.style.transition = "none";
        }
      }

      setTransform(constrainedTransform);
      onTransformUpdate?.(constrainedTransform.scale);

      return constrainedTransform;
    },
    [applyConstraints, overlayRef, onTransformUpdate]
  );

  // 初期配置を計算
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
  }, [getViewportSize, mapWidth, mapHeight, initialScale]);

  // 初期化
  useEffect(() => {
    const initialTransform = calculateInitialTransform();
    applyTransformToElements(initialTransform, false);
  }, [calculateInitialTransform, applyTransformToElements]);

  // 特定の世界座標を画面の特定位置に配置
  const zoomToPointAtScreenPosition = useCallback(
    (
      worldPoint: { x: number; y: number },
      screenPoint: { x: number; y: number },
      newScale: number,
      smooth = true
    ) => {
      const constrainedScale = Math.max(minScale, Math.min(maxScale, newScale));
      const newTranslateX = screenPoint.x - worldPoint.x * constrainedScale;
      const newTranslateY = screenPoint.y - worldPoint.y * constrainedScale;

      const newTransform = {
        scale: constrainedScale,
        translateX: newTranslateX,
        translateY: newTranslateY,
      };

      applyTransformToElements(newTransform, smooth);
    },
    [minScale, maxScale, applyTransformToElements]
  );

  // 画面座標から世界座標への変換
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
    [containerRef, transform, mapWidth, mapHeight]
  );

  // 画面中央基準ズームイン
  const zoomIn = useCallback(() => {
    if (!containerRef.current) return;

    const viewport = getViewportSize();
    const screenCenter = { x: viewport.width / 2, y: viewport.height / 2 };
    const worldCenter = screenToWorldCoordinate(
      containerRef.current.getBoundingClientRect().left + screenCenter.x,
      containerRef.current.getBoundingClientRect().top + screenCenter.y
    );

    const newScale = transform.scale * 1.3;
    zoomToPointAtScreenPosition(worldCenter, screenCenter, newScale);
  }, [
    containerRef,
    getViewportSize,
    screenToWorldCoordinate,
    transform.scale,
    zoomToPointAtScreenPosition,
  ]);

  // 画面中央基準ズームアウト
  const zoomOut = useCallback(() => {
    if (!containerRef.current) return;

    const viewport = getViewportSize();
    const screenCenter = { x: viewport.width / 2, y: viewport.height / 2 };
    const worldCenter = screenToWorldCoordinate(
      containerRef.current.getBoundingClientRect().left + screenCenter.x,
      containerRef.current.getBoundingClientRect().top + screenCenter.y
    );

    const newScale = transform.scale / 1.3;
    zoomToPointAtScreenPosition(worldCenter, screenCenter, newScale);
  }, [
    containerRef,
    getViewportSize,
    screenToWorldCoordinate,
    transform.scale,
    zoomToPointAtScreenPosition,
  ]);

  // 特定座標基準ズームイン
  const zoomInToCoordinate = useCallback(
    (coord: { x: number; y: number }) => {
      const viewport = getViewportSize();
      const screenCenter = { x: viewport.width / 2, y: viewport.height / 2 };
      const newScale = transform.scale * 1.3;
      zoomToPointAtScreenPosition(coord, screenCenter, newScale);
    },
    [getViewportSize, transform.scale, zoomToPointAtScreenPosition]
  );

  // 特定座標基準ズームアウト
  const zoomOutFromCoordinate = useCallback(
    (coord: { x: number; y: number }) => {
      const viewport = getViewportSize();
      const screenCenter = { x: viewport.width / 2, y: viewport.height / 2 };
      const newScale = transform.scale / 1.3;
      zoomToPointAtScreenPosition(coord, screenCenter, newScale);
    },
    [getViewportSize, transform.scale, zoomToPointAtScreenPosition]
  );

  // リセット
  const resetZoom = useCallback(() => {
    const initialTransform = calculateInitialTransform();
    applyTransformToElements(initialTransform, true);
  }, [calculateInitialTransform, applyTransformToElements]);

  // スムーズなパン操作（ドラッグ用）
  const pan = useCallback(
    (deltaX: number, deltaY: number) => {
      // 即座に適用することでより応答性の高いドラッグを実現
      const newTransform = {
        scale: transform.scale,
        translateX: transform.translateX + deltaX,
        translateY: transform.translateY + deltaY,
      };

      applyTransformToElements(newTransform, false);
    },
    [transform, applyTransformToElements]
  );

  // 特定位置にズーム
  const zoomToLocation = useCallback(
    (x: number, y: number, targetScale: number = 4, _duration: number = 1) => {
      const viewport = getViewportSize();
      const screenCenter = { x: viewport.width / 2, y: viewport.height / 2 };
      zoomToPointAtScreenPosition({ x, y }, screenCenter, targetScale, true);
    },
    [getViewportSize, zoomToPointAtScreenPosition]
  );

  // 従来のapplyTransform関数（互換性のため）
  const applyTransform = useCallback(
    (newTransform: ZoomPanState, animate = true) => {
      applyTransformToElements(newTransform, animate);
    },
    [applyTransformToElements]
  );

  return {
    svgRef,
    zoomPan: transform,
    zoomIn,
    zoomOut,
    resetZoom,
    applyTransform,
    zoomToLocation,
    zoomInToCoordinate,
    zoomOutFromCoordinate,
    screenToViewBox: screenToWorldCoordinate,
    pan,
  };
};
