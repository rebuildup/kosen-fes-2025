import { useRef, useState, useCallback, useEffect } from "react";

interface Point {
  x: number;
  y: number;
}

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

interface UseSimpleMapZoomPanOptions {
  width: number;
  height: number;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
  onTransformChange?: (transform: Transform) => void;
}

export const useSimpleMapZoomPan = ({
  width,
  height,
  minScale = 0.1,
  maxScale = 10,
  initialScale = 1,
  onTransformChange,
}: UseSimpleMapZoomPanOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [transform, setTransform] = useState<Transform>({
    scale: initialScale,
    translateX: 0,
    translateY: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<Point>({ x: 0, y: 0 });

  // Transform適用関数
  const applyTransform = useCallback(
    (newTransform: Transform) => {
      if (!contentRef.current) return;

      const constrainedTransform = {
        ...newTransform,
        scale: Math.max(minScale, Math.min(maxScale, newTransform.scale)),
      };

      const transformString = `translate(${constrainedTransform.translateX}px, ${constrainedTransform.translateY}px) scale(${constrainedTransform.scale})`;
      contentRef.current.style.transform = transformString;
      contentRef.current.style.transformOrigin = "0 0";

      // 高品質レンダリングの設定
      contentRef.current.style.imageRendering = "crisp-edges";
      contentRef.current.style.backfaceVisibility = "hidden";
      contentRef.current.style.perspective = "1000px";

      setTransform(constrainedTransform);
      onTransformChange?.(constrainedTransform);
    },
    [minScale, maxScale, onTransformChange]
  );

  // ズームイン
  const zoomIn = useCallback(() => {
    applyTransform({
      ...transform,
      scale: Math.min(maxScale, transform.scale * 1.2),
    });
  }, [transform, maxScale, applyTransform]);

  // ズームアウト
  const zoomOut = useCallback(() => {
    applyTransform({
      ...transform,
      scale: Math.max(minScale, transform.scale / 1.2),
    });
  }, [transform, minScale, applyTransform]);

  // リセット
  const resetTransform = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const scaleX = containerRect.width / width;
    const scaleY = containerRect.height / height;
    const fitScale = Math.min(scaleX, scaleY) * 0.9;

    const scaledWidth = width * fitScale;
    const scaledHeight = height * fitScale;
    const centerX = (containerRect.width - scaledWidth) / 2;
    const centerY = (containerRect.height - scaledHeight) / 2;

    applyTransform({
      scale: fitScale,
      translateX: centerX,
      translateY: centerY,
    });
  }, [width, height, applyTransform]);

  // 特定座標へのズーム
  const zoomToPoint = useCallback(
    (point: Point, targetScale: number) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      applyTransform({
        scale: Math.max(minScale, Math.min(maxScale, targetScale)),
        translateX: centerX - point.x * targetScale,
        translateY: centerY - point.y * targetScale,
      });
    },
    [minScale, maxScale, applyTransform]
  );

  // 画面座標からSVG座標への変換
  const screenToSVG = useCallback(
    (screenX: number, screenY: number): Point => {
      if (!containerRef.current) return { x: 0, y: 0 };

      const containerRect = containerRef.current.getBoundingClientRect();
      const x =
        (screenX - containerRect.left - transform.translateX) / transform.scale;
      const y =
        (screenY - containerRect.top - transform.translateY) / transform.scale;

      return {
        x: Math.max(0, Math.min(width, x)),
        y: Math.max(0, Math.min(height, y)),
      };
    },
    [transform, width, height]
  );

  // マウスイベントハンドラー
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // 左クリックのみ

    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      applyTransform({
        ...transform,
        translateX: transform.translateX + deltaX,
        translateY: transform.translateY + deltaY,
      });

      setLastMousePos({ x: e.clientX, y: e.clientY });
    },
    [isDragging, lastMousePos, transform, applyTransform]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ホイールイベントハンドラー
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!containerRef.current) return;

      e.preventDefault();

      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;

      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(
        minScale,
        Math.min(maxScale, transform.scale * scaleFactor)
      );

      if (newScale === transform.scale) return;

      const scaleRatio = newScale / transform.scale;

      applyTransform({
        scale: newScale,
        translateX: mouseX - (mouseX - transform.translateX) * scaleRatio,
        translateY: mouseY - (mouseY - transform.translateY) * scaleRatio,
      });
    },
    [transform, minScale, maxScale, applyTransform]
  );

  // イベントリスナーの設定
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // マウスイベント
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // ホイールイベント
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleMouseMove, handleMouseUp, handleWheel]);

  // 初期化
  useEffect(() => {
    const timer = setTimeout(() => {
      resetTransform();
    }, 100);
    return () => clearTimeout(timer);
  }, [resetTransform]);

  return {
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
  };
};
