import { useCallback, useRef, useState } from "react";
import { gsap } from "gsap";
import { CAMPUS_MAP_BOUNDS } from "../data/buildings";
import {
  Point,
  MapViewState,
  worldToViewport,
  viewportToWorld,
  calculateZoomCenter,
  calculateTransformParams,
  constrainZoom,
  constrainToMapBounds,
} from "../utils/mapCoordinates";

interface ZoomPanState {
  scale: number;
  centerX: number; // SVG viewBox center X
  centerY: number; // SVG viewBox center Y
}

// New interface using the coordinate utilities
interface ModernZoomPanState {
  viewCenter: Point;
  zoom: number;
  viewportSize: { width: number; height: number };
}

interface UseMapZoomPanOptions {
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
  mapWidth: number;
  mapHeight: number;
  containerRef: React.RefObject<HTMLElement>;
  onTransformUpdate?: (scale: number, centerX: number, centerY: number) => void;
  overlayRef?: React.RefObject<SVGSVGElement>;
}

export const useMapZoomPan = ({
  minScale = 0.5,
  maxScale = 5,
  initialScale = 1,
  mapWidth: _mapWidth,
  mapHeight: _mapHeight,
  containerRef,
  onTransformUpdate,
  overlayRef,
}: UseMapZoomPanOptions) => {
  // Modern state using coordinate utilities
  const [modernState, setModernState] = useState<ModernZoomPanState>({
    viewCenter: {
      x: CAMPUS_MAP_BOUNDS.width / 2,
      y: CAMPUS_MAP_BOUNDS.height / 2,
    },
    zoom: initialScale,
    viewportSize: { width: 800, height: 600 }, // Default, will be updated
  });

  // Legacy state for backward compatibility
  const [state, setState] = useState<ZoomPanState>({
    scale: initialScale,
    centerX: CAMPUS_MAP_BOUNDS.width / 2,
    centerY: CAMPUS_MAP_BOUNDS.height / 2,
  });

  const svgRef = useRef<SVGSVGElement>(null);

  // Update viewport size when container changes
  const updateViewportSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newViewportSize = { width: rect.width, height: rect.height };
      
      setModernState(prev => ({
        ...prev,
        viewportSize: newViewportSize,
      }));
    }
  }, [containerRef]);

  // Sync modern state with legacy state for backward compatibility
  const syncStates = useCallback((newModernState: ModernZoomPanState) => {
    setModernState(newModernState);
    setState({
      scale: newModernState.zoom,
      centerX: newModernState.viewCenter.x,
      centerY: newModernState.viewCenter.y,
    });
  }, []);

  // Get current actual scale from GSAP (more reliable than React state during animations)
  const getCurrentScale = useCallback(() => {
    if (!svgRef.current) return modernState.zoom;
    const currentScale = gsap.getProperty(svgRef.current, "scaleX") as number;
    return currentScale || modernState.zoom;
  }, [modernState.zoom]);

  // Get current viewport size
  const getViewportSize = useCallback(() => {
    if (!containerRef.current) return modernState.viewportSize;
    const rect = containerRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, [containerRef, modernState.viewportSize]);

  // Calculate GSAP transform to keep a specific coordinate at screen center (using new utilities)
  const calculateTransformToKeepCoordinateAtCenter = useCallback(
    (targetState: ZoomPanState, fixedCoord: { x: number; y: number }) => {
      const viewportSize = getViewportSize();
      
      // Calculate new view center to keep the fixed coordinate at screen center
      const fixedViewportPoint = { x: viewportSize.width / 2, y: viewportSize.height / 2 };
      const newViewCenter = calculateZoomCenter(
        fixedCoord,
        fixedViewportPoint,
        targetState.scale,
        viewportSize
      );
      
      // Use the new coordinate utilities to calculate transform
      const transformParams = calculateTransformParams(
        newViewCenter,
        targetState.scale,
        viewportSize,
        CAMPUS_MAP_BOUNDS
      );
      
      console.log("Fixed coordinate transform calculation (using new utilities):", {
        fixedCoord,
        targetState,
        newViewCenter,
        transformParams,
      });
      
      return {
        scale: transformParams.scale,
        x: transformParams.translateX,
        y: transformParams.translateY,
      };
    },
    [getViewportSize]
  );

  // Calculate GSAP transform from given state (for normal centering) - using new utilities
  const calculateTransformForState = useCallback(
    (targetState: ZoomPanState) => {
      const viewportSize = getViewportSize();
      
      // Convert legacy state to modern state
      const viewCenter = { x: targetState.centerX, y: targetState.centerY };
      
      // Use the new coordinate utilities to calculate transform
      const transformParams = calculateTransformParams(
        viewCenter,
        targetState.scale,
        viewportSize,
        CAMPUS_MAP_BOUNDS
      );
      
      return {
        scale: transformParams.scale,
        x: transformParams.translateX,
        y: transformParams.translateY,
      };
    },
    [getViewportSize]
  );

  // Apply transform to SVG elements
  const applyTransform = useCallback(
    (newState: ZoomPanState, animate = true) => {
      if (!svgRef.current) return;

      // Constrain scale
      const constrainedState = {
        ...newState,
        scale: Math.max(minScale, Math.min(maxScale, newState.scale)),
      };

      // Calculate transform BEFORE updating state
      const transform = calculateTransformForState(constrainedState);
      const transformConfig = {
        scale: transform.scale,
        x: transform.x,
        y: transform.y,
        transformOrigin: "0px 0px",
      };

      // Update state
      setState(constrainedState);

      console.log(
        "Applying transform (using new utilities):",
        transformConfig,
        "for state:",
        constrainedState
      );

      if (animate) {
        // Kill existing animations
        gsap.killTweensOf(svgRef.current);
        if (overlayRef?.current) {
          gsap.killTweensOf(overlayRef.current);
        }

        // Animate to new transform
        gsap.to(svgRef.current, {
          ...transformConfig,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            console.log("Animation complete, final state:", constrainedState);
            onTransformUpdate?.(
              constrainedState.scale,
              constrainedState.centerX,
              constrainedState.centerY
            );
          },
        });

        // Sync overlay
        if (overlayRef?.current) {
          gsap.to(overlayRef.current, {
            ...transformConfig,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      } else {
        // Immediate transform
        gsap.set(svgRef.current, transformConfig);
        if (overlayRef?.current) {
          gsap.set(overlayRef.current, transformConfig);
        }
        onTransformUpdate?.(
          constrainedState.scale,
          constrainedState.centerX,
          constrainedState.centerY
        );
      }
    },
    [
      minScale,
      maxScale,
      calculateTransformForState,
      onTransformUpdate,
      overlayRef,
    ]
  );

  // Apply transform keeping a specific coordinate fixed at screen center
  const applyTransformKeepingCoordinateFixed = useCallback(
    (
      newState: ZoomPanState,
      fixedCoord: { x: number; y: number },
      animate = true
    ) => {
      if (!svgRef.current) return;

      // Constrain scale
      const constrainedState = {
        ...newState,
        scale: Math.max(minScale, Math.min(maxScale, newState.scale)),
      };

      // Calculate transform to keep coordinate fixed
      const transform = calculateTransformToKeepCoordinateAtCenter(
        constrainedState,
        fixedCoord
      );
      const transformConfig = {
        scale: transform.scale,
        x: transform.x,
        y: transform.y,
        transformOrigin: "0px 0px",
      };

      // Update state to reflect the fixed coordinate as new center
      const finalState = {
        ...constrainedState,
        centerX: fixedCoord.x,
        centerY: fixedCoord.y,
      };
      setState(finalState);
      
      // Update modern state as well
      setModernState(prev => ({
        ...prev,
        viewCenter: { x: fixedCoord.x, y: fixedCoord.y },
        zoom: constrainedState.scale,
      }));

      console.log(
        "Applying fixed-coordinate transform:",
        transformConfig,
        "fixed at:",
        fixedCoord,
        "final state:",
        finalState
      );

      if (animate) {
        // Kill existing animations
        gsap.killTweensOf(svgRef.current);
        if (overlayRef?.current) {
          gsap.killTweensOf(overlayRef.current);
        }

        // Animate to new transform
        gsap.to(svgRef.current, {
          ...transformConfig,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            console.log(
              "Fixed-coordinate animation complete, final state:",
              finalState
            );
            onTransformUpdate?.(
              finalState.scale,
              finalState.centerX,
              finalState.centerY
            );
          },
        });

        // Sync overlay
        if (overlayRef?.current) {
          gsap.to(overlayRef.current, {
            ...transformConfig,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      } else {
        // Immediate transform
        gsap.set(svgRef.current, transformConfig);
        if (overlayRef?.current) {
          gsap.set(overlayRef.current, transformConfig);
        }
        onTransformUpdate?.(
          finalState.scale,
          finalState.centerX,
          finalState.centerY
        );
      }
    },
    [
      minScale,
      maxScale,
      calculateTransformToKeepCoordinateAtCenter,
      onTransformUpdate,
      overlayRef,
    ]
  );

  // Zoom functions - maintain current center (using new utilities)
  const zoomIn = useCallback(() => {
    console.log("Zoom in called, current state:", state, "modern state:", modernState);
    const currentScale = getCurrentScale();
    const newScale = constrainZoom(currentScale * 1.3, minScale, maxScale);
    console.log("Current actual scale:", currentScale, "new scale:", newScale);

    // Keep the current center coordinate fixed during zoom
    applyTransformKeepingCoordinateFixed(
      { ...state, scale: newScale },
      { x: state.centerX, y: state.centerY }
    );
  }, [state, modernState, minScale, maxScale, getCurrentScale, applyTransformKeepingCoordinateFixed]);

  const zoomOut = useCallback(() => {
    console.log("Zoom out called, current state:", state, "modern state:", modernState);
    const currentScale = getCurrentScale();
    const newScale = constrainZoom(currentScale / 1.3, minScale, maxScale);
    console.log("Current actual scale:", currentScale, "new scale:", newScale);

    // Keep the current center coordinate fixed during zoom
    applyTransformKeepingCoordinateFixed(
      { ...state, scale: newScale },
      { x: state.centerX, y: state.centerY }
    );
  }, [state, modernState, minScale, maxScale, getCurrentScale, applyTransformKeepingCoordinateFixed]);

  // Reset to initial state
  const resetZoom = useCallback(() => {
    console.log("Reset zoom called");
    const newState = {
      scale: initialScale,
      centerX: CAMPUS_MAP_BOUNDS.width / 2,
      centerY: CAMPUS_MAP_BOUNDS.height / 2,
    };
    console.log("Reset state:", newState);
    applyTransform(newState);
  }, [initialScale, applyTransform]);

  // Zoom to specific location
  const zoomToLocation = useCallback(
    (x: number, y: number, targetScale: number = 4, duration: number = 1) => {
      const newState = {
        scale: targetScale,
        centerX: x,
        centerY: y,
      };

      if (!svgRef.current) return;

      // Constrain scale
      const constrainedState = {
        ...newState,
        scale: Math.max(minScale, Math.min(maxScale, newState.scale)),
      };

      // Calculate transform BEFORE updating state
      const transform = calculateTransformForState(constrainedState);
      const transformConfig = {
        scale: transform.scale,
        x: transform.x,
        y: transform.y,
        transformOrigin: "0px 0px",
      };

      // Update state
      setState(constrainedState);

      // Kill existing animations
      gsap.killTweensOf(svgRef.current);
      if (overlayRef?.current) {
        gsap.killTweensOf(overlayRef.current);
      }

      // Animate to location
      gsap.to(svgRef.current, {
        ...transformConfig,
        duration: duration,
        ease: "power2.out",
        onComplete: () => {
          onTransformUpdate?.(
            constrainedState.scale,
            constrainedState.centerX,
            constrainedState.centerY
          );
        },
      });

      if (overlayRef?.current) {
        gsap.to(overlayRef.current, {
          ...transformConfig,
          duration: duration,
          ease: "power2.out",
        });
      }
    },
    [
      minScale,
      maxScale,
      calculateTransformForState,
      onTransformUpdate,
      overlayRef,
    ]
  );

  // Coordinate-based zoom functions - use actual current scale
  const zoomInToCoordinate = useCallback(
    (coord: { x: number; y: number }) => {
      console.log(
        "zoomInToCoordinate called with coord:",
        coord,
        "current state:",
        state
      );
      const currentScale = getCurrentScale();
      const newScale = Math.min(maxScale, currentScale * 1.3);
      console.log(
        "Current actual scale:",
        currentScale,
        "new scale:",
        newScale
      );

      // Keep the specified coordinate fixed during zoom
      applyTransformKeepingCoordinateFixed(
        { ...state, scale: newScale },
        coord
      );
    },
    [state, maxScale, getCurrentScale, applyTransformKeepingCoordinateFixed]
  );

  const zoomOutFromCoordinate = useCallback(
    (coord: { x: number; y: number }) => {
      console.log(
        "zoomOutFromCoordinate called with coord:",
        coord,
        "current state:",
        state
      );
      const currentScale = getCurrentScale();
      const newScale = Math.max(minScale, currentScale / 1.3);
      console.log(
        "Current actual scale:",
        currentScale,
        "new scale:",
        newScale
      );

      // Keep the specified coordinate fixed during zoom
      applyTransformKeepingCoordinateFixed(
        { ...state, scale: newScale },
        coord
      );
    },
    [state, minScale, getCurrentScale, applyTransformKeepingCoordinateFixed]
  );

  // Coordinate conversion for click handling (using new utilities)
  const screenToViewBox = useCallback(
    (screenX: number, screenY: number) => {
      const viewportSize = getViewportSize();
      
      if (!containerRef.current) {
        return modernState.viewCenter;
      }

      const container = containerRef.current.getBoundingClientRect();
      
      // Convert screen coordinates to viewport coordinates relative to container
      const viewportPoint = {
        x: screenX - container.left,
        y: screenY - container.top,
      };
      
      // Use the new coordinate utilities to convert to world coordinates
      const worldPoint = viewportToWorld(
        viewportPoint,
        modernState.viewCenter,
        modernState.zoom,
        viewportSize
      );
      
      // Constrain to map bounds
      const constrainedPoint = constrainToMapBounds(worldPoint, CAMPUS_MAP_BOUNDS);
      
      console.log("Screen to world conversion:", {
        screen: { x: screenX, y: screenY },
        viewport: viewportPoint,
        world: worldPoint,
        constrained: constrainedPoint,
        state: modernState,
      });
      
      return constrainedPoint;
    },
    [modernState, containerRef, getViewportSize]
  );

  return {
    svgRef,
    zoomPan: state,
    zoomIn,
    zoomOut,
    resetZoom,
    applyTransform,
    zoomToLocation,
    zoomInToCoordinate,
    zoomOutFromCoordinate,
    screenToViewBox,
  };
};
