import { useCallback, useRef, useState } from "react";
import { gsap } from "gsap";
import { CAMPUS_MAP_BOUNDS } from "../data/buildings";

interface ZoomPanState {
  scale: number;
  centerX: number; // SVG viewBox center X
  centerY: number; // SVG viewBox center Y
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
  // Simple state: just scale and center coordinates
  const [state, setState] = useState<ZoomPanState>({
    scale: initialScale,
    centerX: CAMPUS_MAP_BOUNDS.width / 2,
    centerY: CAMPUS_MAP_BOUNDS.height / 2,
  });

  const svgRef = useRef<SVGSVGElement>(null);

  // Get current actual scale from GSAP (more reliable than React state during animations)
  const getCurrentScale = useCallback(() => {
    if (!svgRef.current) return state.scale;
    const currentScale = gsap.getProperty(svgRef.current, "scaleX") as number;
    return currentScale || state.scale;
  }, [state.scale]);

  // Calculate GSAP transform to keep a specific coordinate at screen center
  const calculateTransformToKeepCoordinateAtCenter = useCallback(
    (targetState: ZoomPanState, fixedCoord: { x: number; y: number }) => {
      if (!containerRef.current) {
        return { scale: targetState.scale, x: 0, y: 0 };
      }

      const container = containerRef.current.getBoundingClientRect();

      // Calculate uniform scale for aspect ratio
      const scaleX = container.width / CAMPUS_MAP_BOUNDS.width;
      const scaleY = container.height / CAMPUS_MAP_BOUNDS.height;
      const uniformScale = Math.min(scaleX, scaleY);

      // Calculate center offsets for the base map
      const offsetX =
        (container.width - CAMPUS_MAP_BOUNDS.width * uniformScale) / 2;
      const offsetY =
        (container.height - CAMPUS_MAP_BOUNDS.height * uniformScale) / 2;

      // Screen center where we want the fixed coordinate to appear
      const targetScreenX = container.width / 2;
      const targetScreenY = container.height / 2;

      // Calculate where the fixed coordinate will appear with the new scale
      const coordScreenX = fixedCoord.x * uniformScale * targetState.scale;
      const coordScreenY = fixedCoord.y * uniformScale * targetState.scale;

      // Calculate translation needed to center the fixed coordinate
      const translateX = targetScreenX - coordScreenX - offsetX;
      const translateY = targetScreenY - coordScreenY - offsetY;

      console.log("Fixed coordinate transform calculation:", {
        fixedCoord,
        targetState,
        container: { width: container.width, height: container.height },
        uniformScale,
        offsets: { offsetX, offsetY },
        coordScreen: { coordScreenX, coordScreenY },
        translation: { translateX, translateY },
      });

      return {
        scale: targetState.scale,
        x: translateX,
        y: translateY,
      };
    },
    [containerRef]
  );

  // Calculate GSAP transform from given state (for normal centering)
  const calculateTransformForState = useCallback(
    (targetState: ZoomPanState) => {
      if (!containerRef.current) {
        return { scale: targetState.scale, x: 0, y: 0 };
      }

      const container = containerRef.current.getBoundingClientRect();

      // Calculate uniform scale for aspect ratio
      const scaleX = container.width / CAMPUS_MAP_BOUNDS.width;
      const scaleY = container.height / CAMPUS_MAP_BOUNDS.height;
      const uniformScale = Math.min(scaleX, scaleY);

      // Calculate center offsets
      const offsetX =
        (container.width - CAMPUS_MAP_BOUNDS.width * uniformScale) / 2;
      const offsetY =
        (container.height - CAMPUS_MAP_BOUNDS.height * uniformScale) / 2;

      // Calculate where center should appear on screen
      const targetScreenX = container.width / 2;
      const targetScreenY = container.height / 2;

      // Calculate where center currently appears
      const currentScreenX =
        targetState.centerX * uniformScale * targetState.scale;
      const currentScreenY =
        targetState.centerY * uniformScale * targetState.scale;

      // Calculate required translation
      const translateX = targetScreenX - currentScreenX - offsetX;
      const translateY = targetScreenY - currentScreenY - offsetY;

      return {
        scale: targetState.scale,
        x: translateX,
        y: translateY,
      };
    },
    [containerRef]
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
        "Applying transform:",
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

  // Zoom functions - maintain current center
  const zoomIn = useCallback(() => {
    console.log("Zoom in called, current state:", state);
    const currentScale = getCurrentScale();
    const newScale = Math.min(maxScale, currentScale * 1.3);
    console.log("Current actual scale:", currentScale, "new scale:", newScale);

    // Keep the current center coordinate fixed during zoom
    applyTransformKeepingCoordinateFixed(
      { ...state, scale: newScale },
      { x: state.centerX, y: state.centerY }
    );
  }, [state, maxScale, getCurrentScale, applyTransformKeepingCoordinateFixed]);

  const zoomOut = useCallback(() => {
    console.log("Zoom out called, current state:", state);
    const currentScale = getCurrentScale();
    const newScale = Math.max(minScale, currentScale / 1.3);
    console.log("Current actual scale:", currentScale, "new scale:", newScale);

    // Keep the current center coordinate fixed during zoom
    applyTransformKeepingCoordinateFixed(
      { ...state, scale: newScale },
      { x: state.centerX, y: state.centerY }
    );
  }, [state, minScale, getCurrentScale, applyTransformKeepingCoordinateFixed]);

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

  // Simple coordinate conversion for click handling
  const screenToViewBox = useCallback(
    (screenX: number, screenY: number) => {
      if (!containerRef.current) {
        return { x: state.centerX, y: state.centerY };
      }

      const container = containerRef.current.getBoundingClientRect();
      const relativeX = (screenX - container.left) / container.width;
      const relativeY = (screenY - container.top) / container.height;

      // Calculate visible area
      const visibleWidth = CAMPUS_MAP_BOUNDS.width / state.scale;
      const visibleHeight = CAMPUS_MAP_BOUNDS.height / state.scale;

      // Calculate viewBox coordinates
      const viewX = state.centerX - visibleWidth / 2 + relativeX * visibleWidth;
      const viewY =
        state.centerY - visibleHeight / 2 + relativeY * visibleHeight;

      return {
        x: Math.max(0, Math.min(CAMPUS_MAP_BOUNDS.width, viewX)),
        y: Math.max(0, Math.min(CAMPUS_MAP_BOUNDS.height, viewY)),
      };
    },
    [state, containerRef]
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
