import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

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

export const useMapZoomPan = ({
  minScale = 0.5,
  maxScale = 4,
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
  const lastTouchDistance = useRef(0);
  const lastTouchCenter = useRef({ x: 0, y: 0 });

  // Calculate map bounds to prevent over-panning
  const getMapBounds = useCallback(
    (scale: number): MapBounds => {
      if (!containerRef.current) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
      }

      const container = containerRef.current.getBoundingClientRect();
      const scaledWidth = mapWidth * scale;
      const scaledHeight = mapHeight * scale;

      // If map is smaller than container, center it
      if (scaledWidth <= container.width) {
        const centerX = (container.width - scaledWidth) / 2;
        return {
          minX: centerX,
          maxX: centerX,
          minY: scaledHeight <= container.height ? (container.height - scaledHeight) / 2 : container.height - scaledHeight,
          maxY: scaledHeight <= container.height ? (container.height - scaledHeight) / 2 : 0,
        };
      }

      if (scaledHeight <= container.height) {
        const centerY = (container.height - scaledHeight) / 2;
        return {
          minX: container.width - scaledWidth,
          maxX: 0,
          minY: centerY,
          maxY: centerY,
        };
      }

      return {
        minX: container.width - scaledWidth,
        maxX: 0,
        minY: container.height - scaledHeight,
        maxY: 0,
      };
    },
    [mapWidth, mapHeight, containerRef]
  );

  // Constrain position within bounds
  const constrainPosition = useCallback(
    (x: number, y: number, scale: number): { x: number; y: number } => {
      const bounds = getMapBounds(scale);
      return {
        x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
        y: Math.max(bounds.minY, Math.min(bounds.maxY, y)),
      };
    },
    [getMapBounds]
  );

  // Apply transform to SVG with smooth animation
  const applyTransform = useCallback(
    (newState: ZoomPanState, animate = true) => {
      if (!svgRef.current) return;

      const constrainedPos = constrainPosition(newState.x, newState.y, newState.scale);
      const finalState = { ...newState, ...constrainedPos };

      setZoomPan(finalState);

      if (animate) {
        gsap.to(svgRef.current, {
          scale: finalState.scale,
          x: finalState.x,
          y: finalState.y,
          duration: 0.3,
          ease: "power2.out",
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

  // Zoom functions
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

  // Get touch distance for pinch-to-zoom
  const getTouchDistance = (touches: TouchList): number => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Get center point of touches
  const getTouchCenter = (touches: TouchList): { x: number; y: number } => {
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  // Mouse wheel zoom handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate zoom factor
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(minScale, Math.min(maxScale, zoomPan.scale * zoomFactor));

      // Calculate new position to zoom towards mouse
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

      applyTransform({
        ...zoomPan,
        x: zoomPan.x + deltaX,
        y: zoomPan.y + deltaY,
      }, false);

      lastPointerPos.current = { x: e.clientX, y: e.clientY };
    },
    [zoomPan, applyTransform]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      // Single touch - start drag
      isDragging.current = true;
      const touch = e.touches[0];
      lastPointerPos.current = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2) {
      // Two touches - start pinch zoom
      isDragging.current = false;
      lastTouchDistance.current = getTouchDistance(e.touches);
      lastTouchCenter.current = getTouchCenter(e.touches);
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 1 && isDragging.current) {
        // Single touch drag
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastPointerPos.current.x;
        const deltaY = touch.clientY - lastPointerPos.current.y;

        applyTransform({
          ...zoomPan,
          x: zoomPan.x + deltaX,
          y: zoomPan.y + deltaY,
        }, false);

        lastPointerPos.current = { x: touch.clientX, y: touch.clientY };
      } else if (e.touches.length === 2) {
        // Pinch zoom
        const distance = getTouchDistance(e.touches);
        const center = getTouchCenter(e.touches);

        if (lastTouchDistance.current > 0) {
          const scale = distance / lastTouchDistance.current;
          const newScale = Math.max(minScale, Math.min(maxScale, zoomPan.scale * scale));

          // Calculate new position to zoom towards touch center
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = center.x - rect.left;
          const centerY = center.y - rect.top;

          const scaleDiff = newScale - zoomPan.scale;
          const newX = zoomPan.x - (centerX * scaleDiff) / zoomPan.scale;
          const newY = zoomPan.y - (centerY * scaleDiff) / zoomPan.scale;

          applyTransform({ scale: newScale, x: newX, y: newY }, false);
        }

        lastTouchDistance.current = distance;
        lastTouchCenter.current = center;
      }
    },
    [zoomPan, minScale, maxScale, applyTransform, containerRef]
  );

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    lastTouchDistance.current = 0;
  }, []);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse events
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Touch events
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
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
  };
};