import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CAMPUS_MAP_BOUNDS } from "../data/buildings";

interface ZoomPanState {
  scale: number;
  x: number;
  y: number;
}

interface MapBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface UseMapZoomPanOptions {
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
  mapWidth: number;
  mapHeight: number;
  containerRef: React.RefObject<HTMLElement>;
}

interface Point {
  x: number;
  y: number;
}

export const useMapZoomPan = ({
  minScale = 0.5,
  maxScale = 5,
  initialScale = 1,
  mapWidth,
  mapHeight,
  containerRef,
}: UseMapZoomPanOptions) => {
  const [zoomPan, setZoomPan] = useState<ZoomPanState>({
    scale: initialScale,
    x: 0,
    y: 0,
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);
  const lastPointerPos = useRef({ x: 0, y: 0 });

  // Convert SVG coordinates to screen coordinates
  const svgToScreen = useCallback(
    (point: Point, scale: number): Point => {
      if (!containerRef.current) return point;

      const container = containerRef.current.getBoundingClientRect();
      const svgPoint = {
        x: (point.x / CAMPUS_MAP_BOUNDS.width) * container.width * scale,
        y: (point.y / CAMPUS_MAP_BOUNDS.height) * container.height * scale,
      };

      return svgPoint;
    },
    [containerRef]
  );

  // Calculate the position to center a point
  const calculateCenterPosition = useCallback(
    (point: Point, scale: number): Point => {
      if (!containerRef.current) return { x: 0, y: 0 };

      const container = containerRef.current.getBoundingClientRect();
      const screenPoint = svgToScreen(point, scale);

      return {
        x: container.width / 2 - screenPoint.x,
        y: container.height / 2 - screenPoint.y,
      };
    },
    [svgToScreen]
  );

  // Calculate map bounds to prevent over-panning
  const getMapBounds = useCallback(
    (scale: number): MapBounds => {
      if (!containerRef.current) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
      }

      const container = containerRef.current.getBoundingClientRect();
      const scaledWidth = mapWidth * scale;
      const scaledHeight = mapHeight * scale;

      // Add padding equal to half the container size
      const paddingX = container.width / 2;
      const paddingY = container.height / 2;

      return {
        minX: container.width - scaledWidth - paddingX,
        maxX: paddingX,
        minY: container.height - scaledHeight - paddingY,
        maxY: paddingY,
      };
    },
    [mapWidth, mapHeight, containerRef]
  );

  // Constrain position within bounds
  const constrainPosition = useCallback(
    (x: number, y: number, scale: number): Point => {
      const bounds = getMapBounds(scale);
      return {
        x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
        y: Math.max(bounds.minY, Math.min(bounds.maxY, y)),
      };
    },
    [getMapBounds]
  );

  // Apply transform with animation
  const applyTransform = useCallback(
    (newState: ZoomPanState, animate = true, duration = 0.3) => {
      if (!svgRef.current) return;

      const constrainedPos = constrainPosition(
        newState.x,
        newState.y,
        newState.scale
      );
      const finalState = { ...newState, ...constrainedPos };

      setZoomPan(finalState);

      if (animate) {
        gsap.to(svgRef.current, {
          scale: finalState.scale,
          x: finalState.x,
          y: finalState.y,
          duration: duration,
          ease: "power2.inOut",
          transformOrigin: "0 0",
        });
      } else {
        gsap.set(svgRef.current, {
          scale: finalState.scale,
          x: finalState.x,
          y: finalState.y,
          transformOrigin: "0 0",
        });
      }
    },
    [constrainPosition]
  );

  // Zoom to specific location
  const zoomToLocation = useCallback(
    (x: number, y: number, targetScale: number = 4, duration: number = 1) => {
      if (!containerRef.current || !svgRef.current) return;

      const targetPoint = { x, y };
      const centerPos = calculateCenterPosition(targetPoint, targetScale);

      applyTransform(
        {
          scale: targetScale,
          x: centerPos.x,
          y: centerPos.y,
        },
        true,
        duration
      );
    },
    [containerRef, calculateCenterPosition, applyTransform]
  );

  // Basic zoom functions
  const zoomIn = useCallback(() => {
    const newScale = Math.min(maxScale, zoomPan.scale * 1.5);
    applyTransform({ ...zoomPan, scale: newScale });
  }, [zoomPan, maxScale, applyTransform]);

  const zoomOut = useCallback(() => {
    const newScale = Math.max(minScale, zoomPan.scale / 1.5);
    applyTransform({ ...zoomPan, scale: newScale });
  }, [zoomPan, minScale, applyTransform]);

  const resetZoom = useCallback(() => {
    applyTransform({ scale: initialScale, x: 0, y: 0 });
  }, [initialScale, applyTransform]);

  // Mouse wheel handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(
        minScale,
        Math.min(maxScale, zoomPan.scale * zoomFactor)
      );

      const scaleDiff = newScale - zoomPan.scale;
      const newX = zoomPan.x - (mouseX * scaleDiff) / zoomPan.scale;
      const newY = zoomPan.y - (mouseY * scaleDiff) / zoomPan.scale;

      applyTransform({ scale: newScale, x: newX, y: newY });
    },
    [zoomPan, minScale, maxScale, applyTransform, containerRef]
  );

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - lastPointerPos.current.x;
      const deltaY = e.clientY - lastPointerPos.current.y;

      applyTransform(
        {
          ...zoomPan,
          x: zoomPan.x + deltaX,
          y: zoomPan.y + deltaY,
        },
        false
      );

      lastPointerPos.current = { x: e.clientX, y: e.clientY };
    },
    [zoomPan, applyTransform]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastPointerPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      if (!isDragging.current || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - lastPointerPos.current.x;
      const deltaY = touch.clientY - lastPointerPos.current.y;

      applyTransform(
        {
          ...zoomPan,
          x: zoomPan.x + deltaX,
          y: zoomPan.y + deltaY,
        },
        false
      );

      lastPointerPos.current = { x: touch.clientX, y: touch.clientY };
    },
    [zoomPan, applyTransform]
  );

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    containerRef,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  return {
    svgRef,
    zoomPan,
    zoomIn,
    zoomOut,
    resetZoom,
    applyTransform,
    zoomToLocation,
  };
};
