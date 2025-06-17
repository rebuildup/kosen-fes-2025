import { useCallback, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

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

  // 簡素化された状態管理
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

  // 現在のスケールを取得（GSAP実際値を優先）
  const getCurrentScale = useCallback(() => {
    if (!svgRef.current) return transform.scale;
    const currentScale = gsap.getProperty(svgRef.current, "scaleX") as number;
    return currentScale || transform.scale;
  }, [transform.scale]);

  // 現在の平移値を取得（GSAP実際値を優先）
  const getCurrentTranslate = useCallback(() => {
    if (!svgRef.current)
      return { x: transform.translateX, y: transform.translateY };
    const currentX =
      (gsap.getProperty(svgRef.current, "x") as number) || transform.translateX;
    const currentY =
      (gsap.getProperty(svgRef.current, "y") as number) || transform.translateY;
    return { x: currentX, y: currentY };
  }, [transform.translateX, transform.translateY]);

  // マップを初期状態に配置する計算
  const calculateInitialTransform = useCallback(() => {
    const viewport = getViewportSize();

    // マップを画面中央に配置するためのオフセット計算
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
    setTransform(initialTransform);

    if (svgRef.current) {
      gsap.set(svgRef.current, {
        scale: initialTransform.scale,
        x: initialTransform.translateX,
        y: initialTransform.translateY,
        transformOrigin: "0px 0px",
      });

      if (overlayRef?.current) {
        gsap.set(overlayRef.current, {
          scale: initialTransform.scale,
          x: initialTransform.translateX,
          y: initialTransform.translateY,
          transformOrigin: "0px 0px",
        });
      }
    }
  }, [calculateInitialTransform, overlayRef]);

  // 変換を適用
  const applyTransform = useCallback(
    (newTransform: ZoomPanState, animate = true) => {
      if (!svgRef.current) return;

      // スケールを制限
      let constrainedTransform = {
        ...newTransform,
        scale: Math.max(minScale, Math.min(maxScale, newTransform.scale)),
      };

      // 境界制約を適用（緩和版）
      const viewport = getViewportSize();
      const scaledMapWidth = mapWidth * constrainedTransform.scale;
      const scaledMapHeight = mapHeight * constrainedTransform.scale;

      // オーバースクロール許容量（マップサイズの20%）
      const overscrollMarginX = scaledMapWidth * 0.2;
      const overscrollMarginY = scaledMapHeight * 0.2;

      // マップが画面より小さい場合は中央に配置
      if (scaledMapWidth <= viewport.width) {
        constrainedTransform.translateX = (viewport.width - scaledMapWidth) / 2;
      } else {
        // マップが画面より大きい場合は、オーバースクロールを許容
        const maxTranslateX = overscrollMarginX;
        const minTranslateX =
          viewport.width - scaledMapWidth - overscrollMarginX;
        constrainedTransform.translateX = Math.max(
          minTranslateX,
          Math.min(maxTranslateX, constrainedTransform.translateX)
        );
      }

      if (scaledMapHeight <= viewport.height) {
        constrainedTransform.translateY =
          (viewport.height - scaledMapHeight) / 2;
      } else {
        const maxTranslateY = overscrollMarginY;
        const minTranslateY =
          viewport.height - scaledMapHeight - overscrollMarginY;
        constrainedTransform.translateY = Math.max(
          minTranslateY,
          Math.min(maxTranslateY, constrainedTransform.translateY)
        );
      }

      setTransform(constrainedTransform);

      const transformConfig = {
        scale: constrainedTransform.scale,
        x: constrainedTransform.translateX,
        y: constrainedTransform.translateY,
        transformOrigin: "0px 0px",
      };

      if (animate) {
        gsap.killTweensOf(svgRef.current);
        if (overlayRef?.current) {
          gsap.killTweensOf(overlayRef.current);
        }

        gsap.to(svgRef.current, {
          ...transformConfig,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            onTransformUpdate?.(constrainedTransform.scale);
          },
        });

        if (overlayRef?.current) {
          gsap.to(overlayRef.current, {
            ...transformConfig,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      } else {
        gsap.set(svgRef.current, transformConfig);
        if (overlayRef?.current) {
          gsap.set(overlayRef.current, transformConfig);
        }

        onTransformUpdate?.(constrainedTransform.scale);
      }
    },
    [
      minScale,
      maxScale,
      onTransformUpdate,
      overlayRef,
      getViewportSize,
      mapWidth,
      mapHeight,
    ]
  );

  // 特定の世界座標を画面の特定位置に固定してズーム
  const zoomToPointAtScreenPosition = useCallback(
    (
      worldPoint: { x: number; y: number },
      screenPoint: { x: number; y: number },
      newScale: number,
      animate = true
    ) => {
      const constrainedScale = Math.max(minScale, Math.min(maxScale, newScale));

      // 世界座標を画面の指定位置に配置するための平移を計算
      const newTranslateX = screenPoint.x - worldPoint.x * constrainedScale;
      const newTranslateY = screenPoint.y - worldPoint.y * constrainedScale;

      const newTransform = {
        scale: constrainedScale,
        translateX: newTranslateX,
        translateY: newTranslateY,
      };

      applyTransform(newTransform, animate);
    },
    [minScale, maxScale, applyTransform]
  );

  // 画面座標から世界座標への変換
  const screenToWorldCoordinate = useCallback(
    (screenX: number, screenY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };

      const container = containerRef.current.getBoundingClientRect();
      const currentScale = getCurrentScale();
      const currentTranslate = getCurrentTranslate();

      // コンテナ内での相対座標
      const relativeX = screenX - container.left;
      const relativeY = screenY - container.top;

      // 世界座標に変換
      const worldX = (relativeX - currentTranslate.x) / currentScale;
      const worldY = (relativeY - currentTranslate.y) / currentScale;

      // 境界内に制限
      const constrainedX = Math.max(0, Math.min(mapWidth, worldX));
      const constrainedY = Math.max(0, Math.min(mapHeight, worldY));

      return { x: constrainedX, y: constrainedY };
    },
    [containerRef, getCurrentScale, getCurrentTranslate, mapWidth, mapHeight]
  );

  // 画面中央を基準にズームイン
  const zoomIn = useCallback(() => {
    if (!containerRef.current) return;

    const viewport = getViewportSize();
    const screenCenter = {
      x: viewport.width / 2,
      y: viewport.height / 2,
    };

    // 現在の画面中央の世界座標を取得
    const worldCenter = screenToWorldCoordinate(
      containerRef.current.getBoundingClientRect().left + screenCenter.x,
      containerRef.current.getBoundingClientRect().top + screenCenter.y
    );

    const currentScale = getCurrentScale();
    const newScale = currentScale * 1.3;

    // 世界座標の中央を画面中央に固定してズーム
    zoomToPointAtScreenPosition(worldCenter, screenCenter, newScale);
  }, [
    containerRef,
    getViewportSize,
    screenToWorldCoordinate,
    getCurrentScale,
    zoomToPointAtScreenPosition,
  ]);

  // 画面中央を基準にズームアウト
  const zoomOut = useCallback(() => {
    if (!containerRef.current) return;

    const viewport = getViewportSize();
    const screenCenter = {
      x: viewport.width / 2,
      y: viewport.height / 2,
    };

    // 現在の画面中央の世界座標を取得
    const worldCenter = screenToWorldCoordinate(
      containerRef.current.getBoundingClientRect().left + screenCenter.x,
      containerRef.current.getBoundingClientRect().top + screenCenter.y
    );

    const currentScale = getCurrentScale();
    const newScale = currentScale / 1.3;

    // 世界座標の中央を画面中央に固定してズーム
    zoomToPointAtScreenPosition(worldCenter, screenCenter, newScale);
  }, [
    containerRef,
    getViewportSize,
    screenToWorldCoordinate,
    getCurrentScale,
    zoomToPointAtScreenPosition,
  ]);

  // 特定座標を基準にズームイン
  const zoomInToCoordinate = useCallback(
    (coord: { x: number; y: number }) => {
      const viewport = getViewportSize();
      const screenCenter = {
        x: viewport.width / 2,
        y: viewport.height / 2,
      };

      const currentScale = getCurrentScale();
      const newScale = currentScale * 1.3;

      zoomToPointAtScreenPosition(coord, screenCenter, newScale);
    },
    [getViewportSize, getCurrentScale, zoomToPointAtScreenPosition]
  );

  // 特定座標を基準にズームアウト
  const zoomOutFromCoordinate = useCallback(
    (coord: { x: number; y: number }) => {
      const viewport = getViewportSize();
      const screenCenter = {
        x: viewport.width / 2,
        y: viewport.height / 2,
      };

      const currentScale = getCurrentScale();
      const newScale = currentScale / 1.3;

      zoomToPointAtScreenPosition(coord, screenCenter, newScale);
    },
    [getViewportSize, getCurrentScale, zoomToPointAtScreenPosition]
  );

  // リセット
  const resetZoom = useCallback(() => {
    const initialTransform = calculateInitialTransform();
    applyTransform(initialTransform);
  }, [calculateInitialTransform, applyTransform]);

  // パン（平移）操作 - ドラッグ用の高速パン
  const pan = useCallback(
    (deltaX: number, deltaY: number) => {
      const currentTranslate = getCurrentTranslate();
      const currentScale = getCurrentScale();

      // ドラッグ感度を向上させるため、deltaを増幅
      const sensitivity = 1.2; // ドラッグ感度を20%向上
      const amplifiedDeltaX = deltaX * sensitivity;
      const amplifiedDeltaY = deltaY * sensitivity;

      const newTransform = {
        scale: currentScale,
        translateX: currentTranslate.x + amplifiedDeltaX,
        translateY: currentTranslate.y + amplifiedDeltaY,
      };

      // ドラッグ中はアニメーションを無効にして即座に適用
      applyTransform(newTransform, false);
    },
    [getCurrentScale, getCurrentTranslate, applyTransform]
  );

  // 特定位置にズーム
  const zoomToLocation = useCallback(
    (x: number, y: number, targetScale: number = 4, _duration: number = 1) => {
      const viewport = getViewportSize();
      const screenCenter = {
        x: viewport.width / 2,
        y: viewport.height / 2,
      };

      zoomToPointAtScreenPosition({ x, y }, screenCenter, targetScale, true);
    },
    [getViewportSize, zoomToPointAtScreenPosition]
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
