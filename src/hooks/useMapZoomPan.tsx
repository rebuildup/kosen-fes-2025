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
  onTransformUpdate?: (scale: number) => void;
  overlayRef?: React.RefObject<SVGSVGElement>;
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
  onTransformUpdate,
  overlayRef,
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

      // Calculate SVG viewBox scaling factor
      const viewBoxWidth = CAMPUS_MAP_BOUNDS.width;
      const viewBoxHeight = CAMPUS_MAP_BOUNDS.height;
      const containerWidth = container.width;
      const containerHeight = container.height;

      // Calculate the aspect ratio scaling
      const scaleX = containerWidth / viewBoxWidth;
      const scaleY = containerHeight / viewBoxHeight;
      const uniformScale = Math.min(scaleX, scaleY); // SVG maintains aspect ratio

      // Calculate the offset due to aspect ratio centering
      const scaledViewBoxWidth = viewBoxWidth * uniformScale;
      const scaledViewBoxHeight = viewBoxHeight * uniformScale;
      const offsetX = (containerWidth - scaledViewBoxWidth) / 2;
      const offsetY = (containerHeight - scaledViewBoxHeight) / 2;

      // Convert SVG coordinates to screen coordinates
      const screenX = point.x * uniformScale * scale + offsetX;
      const screenY = point.y * uniformScale * scale + offsetY;

      return { x: screenX, y: screenY };
    },
    [containerRef]
  );

  // Calculate the position to center a point
  const calculateCenterPosition = useCallback(
    (point: Point, scale: number): Point => {
      if (!containerRef.current) return { x: 0, y: 0 };

      const container = containerRef.current.getBoundingClientRect();

      // Calculate SVG viewBox scaling factor
      const viewBoxWidth = CAMPUS_MAP_BOUNDS.width;
      const viewBoxHeight = CAMPUS_MAP_BOUNDS.height;
      const containerWidth = container.width;
      const containerHeight = container.height;

      // Calculate the aspect ratio scaling
      const scaleX = containerWidth / viewBoxWidth;
      const scaleY = containerHeight / viewBoxHeight;
      const uniformScale = Math.min(scaleX, scaleY); // SVG maintains aspect ratio

      // Calculate the offset due to aspect ratio centering
      const scaledViewBoxWidth = viewBoxWidth * uniformScale;
      const scaledViewBoxHeight = viewBoxHeight * uniformScale;
      const offsetX = (containerWidth - scaledViewBoxWidth) / 2;
      const offsetY = (containerHeight - scaledViewBoxHeight) / 2;

      // Convert target point to screen coordinates at the given scale
      const targetScreenX = point.x * uniformScale * scale + offsetX;
      const targetScreenY = point.y * uniformScale * scale + offsetY;

      // Calculate position to center the target point
      const centerX = container.width / 2 - targetScreenX;
      const centerY = container.height / 2 - targetScreenY;

      console.log("Center calculation:", {
        targetPoint: point,
        scale: scale,
        viewBox: { width: viewBoxWidth, height: viewBoxHeight },
        container: { width: containerWidth, height: containerHeight },
        uniformScale: uniformScale,
        offset: { x: offsetX, y: offsetY },
        targetScreen: { x: targetScreenX, y: targetScreenY },
        center: { x: centerX, y: centerY },
      });

      return { x: centerX, y: centerY };
    },
    [containerRef]
  );

  // Calculate map bounds to prevent over-panning
  const getMapBounds = useCallback(
    (scale: number): MapBounds => {
      if (!containerRef.current) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
      }

      const container = containerRef.current.getBoundingClientRect();

      // Calculate SVG viewBox scaling factor
      const viewBoxWidth = CAMPUS_MAP_BOUNDS.width;
      const viewBoxHeight = CAMPUS_MAP_BOUNDS.height;
      const containerWidth = container.width;
      const containerHeight = container.height;

      // Calculate the aspect ratio scaling
      const scaleX = containerWidth / viewBoxWidth;
      const scaleY = containerHeight / viewBoxHeight;
      const uniformScale = Math.min(scaleX, scaleY);

      // Calculate actual scaled dimensions
      const scaledWidth = viewBoxWidth * uniformScale * scale;
      const scaledHeight = viewBoxHeight * uniformScale * scale;

      // Calculate offsets for centering
      const offsetX = (containerWidth - viewBoxWidth * uniformScale) / 2;
      const offsetY = (containerHeight - viewBoxHeight * uniformScale) / 2;

      // Allow generous padding for smooth panning
      const paddingX = containerWidth * 0.1; // 10% padding
      const paddingY = containerHeight * 0.1; // 10% padding

      return {
        minX: containerWidth - scaledWidth - paddingX + offsetX,
        maxX: paddingX + offsetX,
        minY: containerHeight - scaledHeight - paddingY + offsetY,
        maxY: paddingY + offsetY,
      };
    },
    [containerRef]
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

      // Notify about scale changes immediately for smooth UI updates
      onTransformUpdate?.(finalState.scale);

      const transformConfig = {
        scale: finalState.scale,
        x: finalState.x,
        y: finalState.y,
        transformOrigin: "0px 0px",
      };

      if (animate) {
        gsap.to(svgRef.current, {
          ...transformConfig,
          duration: duration,
          ease: "power2.inOut",
          onUpdate: () => {
            // Update scale callback during animation for smooth pin scaling
            const currentScale = gsap.getProperty(
              svgRef.current!,
              "scaleX"
            ) as number;
            onTransformUpdate?.(currentScale);

            // Sync overlay element with main SVG
            if (overlayRef?.current) {
              gsap.set(overlayRef.current, {
                scale: currentScale,
                x: gsap.getProperty(svgRef.current!, "x"),
                y: gsap.getProperty(svgRef.current!, "y"),
                transformOrigin: "0px 0px",
              });
            }
          },
        });
      } else {
        gsap.set(svgRef.current, transformConfig);

        // Sync overlay element immediately
        if (overlayRef?.current) {
          gsap.set(overlayRef.current, transformConfig);
        }
      }
    },
    [constrainPosition, onTransformUpdate, overlayRef]
  );

  // Zoom to specific location
  const zoomToLocation = useCallback(
    (x: number, y: number, targetScale: number = 4, duration: number = 1) => {
      if (!containerRef.current || !svgRef.current) return;

      const container = containerRef.current.getBoundingClientRect();

      // Calculate SVG viewBox scaling factor
      const viewBoxWidth = CAMPUS_MAP_BOUNDS.width;
      const viewBoxHeight = CAMPUS_MAP_BOUNDS.height;
      const containerWidth = container.width;
      const containerHeight = container.height;

      // Calculate the aspect ratio scaling
      const scaleX = containerWidth / viewBoxWidth;
      const scaleY = containerHeight / viewBoxHeight;
      const uniformScale = Math.min(scaleX, scaleY); // SVG maintains aspect ratio

      // Calculate the offset due to aspect ratio centering
      const scaledViewBoxWidth = viewBoxWidth * uniformScale;
      const scaledViewBoxHeight = viewBoxHeight * uniformScale;
      const offsetX = (containerWidth - scaledViewBoxWidth) / 2;
      const offsetY = (containerHeight - scaledViewBoxHeight) / 2;

      // Target point in SVG coordinates: (x, y)
      // We want this point to be at the center of the viewport

      // Convert target SVG coordinates to final screen coordinates at target scale
      const targetScreenX = x * uniformScale * targetScale;
      const targetScreenY = y * uniformScale * targetScale;

      // Calculate the translation needed to center the target point
      // We want: targetScreenX + translateX + offsetX = containerWidth / 2
      // So: translateX = containerWidth / 2 - targetScreenX - offsetX
      const translateX = containerWidth / 2 - targetScreenX - offsetX;
      const translateY = containerHeight / 2 - targetScreenY - offsetY;

      console.log("ZoomToLocation detailed calculation:", {
        targetSVG: { x, y },
        targetScale: targetScale,
        container: { width: containerWidth, height: containerHeight },
        viewBox: { width: viewBoxWidth, height: viewBoxHeight },
        uniformScale: uniformScale,
        offset: { x: offsetX, y: offsetY },
        targetScreen: { x: targetScreenX, y: targetScreenY },
        finalTranslate: { x: translateX, y: translateY },
        centerTarget: { x: containerWidth / 2, y: containerHeight / 2 },
      });

      applyTransform(
        {
          scale: targetScale,
          x: translateX,
          y: translateY,
        },
        true,
        duration
      );
    },
    [containerRef, applyTransform]
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
