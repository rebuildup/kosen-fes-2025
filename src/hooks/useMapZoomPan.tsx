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
  minScale = 0.2,
  maxScale = 15,
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

  // 最後のマウス位置を追跡
  const lastPosition = useRef<Point>({ x: 0, y: 0 });

  // ビューポートサイズを取得 - より安定したサイズ計算
  const getViewportSize = useCallback(() => {
    if (!containerRef.current) return { width: 800, height: 600 };
    const rect = containerRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, []);

  // より柔軟な制約を適用 - パン制約を大幅に緩和
  const applyConstraints = useCallback(
    (newTransform: ZoomPanState) => {
      // スケールのみを制限（パン制約を大幅に緩和）
      const constrainedScale = Math.max(
        minScale,
        Math.min(maxScale, newTransform.scale)
      );

      // パン制約を大幅に緩和 - マップの外へも移動可能に
      const viewport = getViewportSize();
      const scaledMapWidth = mapWidth * constrainedScale;
      const scaledMapHeight = mapHeight * constrainedScale;

      // より広い移動範囲を許可
      const maxOverscroll = Math.max(viewport.width, viewport.height) * 0.5;

      let constrainedTranslateX = newTransform.translateX;
      let constrainedTranslateY = newTransform.translateY;

      // X軸制約（大幅に緩和）
      const maxTranslateX = maxOverscroll;
      const minTranslateX = -scaledMapWidth - maxOverscroll + viewport.width;
      constrainedTranslateX = Math.max(
        minTranslateX,
        Math.min(maxTranslateX, constrainedTranslateX)
      );

      // Y軸制約（大幅に緩和）
      const maxTranslateY = maxOverscroll;
      const minTranslateY = -scaledMapHeight - maxOverscroll + viewport.height;
      constrainedTranslateY = Math.max(
        minTranslateY,
        Math.min(maxTranslateY, constrainedTranslateY)
      );

      return {
        scale: constrainedScale,
        translateX: constrainedTranslateX,
        translateY: constrainedTranslateY,
      };
    },
    [minScale, maxScale, mapWidth, mapHeight, getViewportSize]
  );

  // 変換を要素に適用 - 空の依存配列で安定化
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
    [applyConstraints, onTransformUpdate]
  );

  // 初期配置を計算 - 基本プロパティのみに依存
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
  }, [mapWidth, mapHeight, initialScale, getViewportSize]);

  // 初期化 - 基本プロパティのみを依存に含める
  useEffect(() => {
    const initializeMap = () => {
      const initialTransform = calculateInitialTransform();
      applyTransformToElements(initialTransform, false);
    };

    // コンテナが準備できてから初期化
    if (containerRef.current) {
      initializeMap();
    } else {
      // コンテナがまだ準備できていない場合は少し待つ
      const timer = setTimeout(initializeMap, 100);
      return () => clearTimeout(timer);
    }
  }, [mapWidth, mapHeight, initialScale]); // 関数ではなく基本的な値のみを依存

  // 画面座標から世界座標への変換 - 最新のtransformを直接参照
  const screenToWorldCoordinate = useCallback(
    (screenX: number, screenY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };

      const container = containerRef.current.getBoundingClientRect();
      const relativeX = screenX - container.left;
      const relativeY = screenY - container.top;

      // 最新のtransform値を直接使用して依存配列から除外
      const currentTransform = transform;
      const worldX =
        (relativeX - currentTransform.translateX) / currentTransform.scale;
      const worldY =
        (relativeY - currentTransform.translateY) / currentTransform.scale;

      const constrainedX = Math.max(0, Math.min(mapWidth, worldX));
      const constrainedY = Math.max(0, Math.min(mapHeight, worldY));

      return { x: constrainedX, y: constrainedY };
    },
    [mapWidth, mapHeight]
  );

  // マウスカーソル位置を固定点としたズーム - 空の依存配列で安定化
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
    [] // 空の依存配列で関数を安定化
  );

  // 画面中央基準ズームイン - 空の依存配列で安定化
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

  // 画面中央基準ズームアウト - 空の依存配列で安定化
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

  // 特定座標基準ズームイン - 空の依存配列で安定化
  const zoomInToCoordinate = useCallback((coord: Point) => {
    const newScale = transform.scale * 1.5;
    zoomAtPoint(coord, newScale);
  }, []);

  // 特定座標基準ズームアウト - 空の依存配列で安定化
  const zoomOutFromCoordinate = useCallback((coord: Point) => {
    const newScale = transform.scale / 1.5;
    zoomAtPoint(coord, newScale);
  }, []);

  // リセット - 空の依存配列で安定化
  const resetZoom = useCallback(() => {
    const initialTransform = calculateInitialTransform();
    applyTransformToElements(initialTransform, true);
  }, []);

  // パン操作 - 現在のtransformを直接参照して正確にパン
  const pan = useCallback(
    (deltaX: number, deltaY: number) => {
      setTransform((current) => {
        const newTransform = {
          scale: current.scale,
          translateX: current.translateX + deltaX,
          translateY: current.translateY + deltaY,
        };

        const constrainedTransform = applyConstraints(newTransform);

        // 直接DOM要素に適用
        const transformString = `translate(${constrainedTransform.translateX}px, ${constrainedTransform.translateY}px) scale(${constrainedTransform.scale})`;

        if (svgRef.current) {
          svgRef.current.style.transform = transformString;
          svgRef.current.style.transformOrigin = "0 0";
          svgRef.current.style.transition = "none";
        }

        if (overlayRef?.current) {
          overlayRef.current.style.transform = transformString;
          overlayRef.current.style.transformOrigin = "0 0";
          overlayRef.current.style.transition = "none";
        }

        onTransformUpdate?.(constrainedTransform.scale);
        return constrainedTransform;
      });
    },
    [applyConstraints, onTransformUpdate]
  );

  // 特定位置にズーム - 空の依存配列で安定化
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
