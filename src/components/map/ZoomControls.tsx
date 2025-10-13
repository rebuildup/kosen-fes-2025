import { useEffect, useMemo } from "react";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from "lucide-react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  fullscreenLabel?: string;
  scale: number;
  minScale: number;
  maxScale: number;
}

const ZoomControls = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleFullscreen,
  isFullscreen = false,
  fullscreenLabel,
  scale,
  minScale,
  maxScale,
}: ZoomControlsProps) => {
  const zoomInDisabled = useMemo(() => scale >= maxScale, [scale, maxScale]);
  const zoomOutDisabled = useMemo(() => scale <= minScale, [scale, minScale]);
  //const formattedScale = useMemo(() => `${Math.round(scale * 100)}%`, [scale]);

  const baseZoomButtonClass =
    "flex items-center justify-center bg-white text-slate-700 transition-colors duration-150 hover:bg-slate-50 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 touch-manipulation h-11 w-11 text-base font-semibold";
  const baseUtilityButtonClass =
    "flex items-center justify-center bg-slate-100 text-slate-700 transition-colors duration-150 hover:bg-slate-200 active:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-40 touch-manipulation h-11 w-11 text-sm";

  const zoomGroupClass =
    "flex flex-col overflow-hidden border border-slate-200 shadow-sm rounded-md bg-white";
  const utilityGroupClass =
    "flex flex-col overflow-hidden border border-slate-200 shadow-sm rounded-md bg-slate-100";

  // Keyboard shortcuts for zoom/reset
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "+") {
        e.preventDefault();
        onZoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        onZoomOut();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        onReset();
      }
    };

    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [onZoomIn, onZoomOut, onReset]);

  const handleFullscreenToggle = () => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    }
  };

  const resolvedFullscreenLabel =
    fullscreenLabel ?? (isFullscreen ? "全画面表示を終了" : "全画面表示");

  return (
    <div
      className="absolute bottom-4 right-4 z-20 flex w-auto flex-col items-end gap-2"
      style={{
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Zoom controls */}
      <div className={zoomGroupClass}>
        <button
          type="button"
          onClick={onZoomIn}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            if (!e.currentTarget.disabled) {
              onZoomIn();
            }
          }}
          disabled={zoomInDisabled}
          aria-label="ズームイン (Ctrl/Cmd + +)"
          className={`${baseZoomButtonClass} border-b border-slate-200`}
          title="ズームイン (Ctrl/Cmd + +)"
          style={{ touchAction: "manipulation" }}
        >
          <ZoomInIcon
            strokeWidth={2.5}
            className="h-5 w-5"
            style={{ vectorEffect: "non-scaling-stroke" }}
          />
        </button>

        <button
          type="button"
          onClick={onZoomOut}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            if (!e.currentTarget.disabled) {
              onZoomOut();
            }
          }}
          disabled={zoomOutDisabled}
          aria-label="ズームアウト (Ctrl/Cmd + -)"
          className={baseZoomButtonClass}
          title="ズームアウト (Ctrl/Cmd + -)"
          style={{ touchAction: "manipulation" }}
        >
          <ZoomOutIcon
            strokeWidth={2.5}
            className="h-5 w-5"
            style={{ vectorEffect: "non-scaling-stroke" }}
          />
        </button>
      </div>

      {/* Reset & scale */}
      <div className={utilityGroupClass}>
        <button
          type="button"
          onClick={onReset}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            onReset();
          }}
          aria-label="リセット (Ctrl/Cmd + 0)"
          className={`${baseUtilityButtonClass} border-b border-slate-100`}
          title="リセット (Ctrl/Cmd + 0)"
          style={{ touchAction: "manipulation" }}
        >
          <RotateCcw
            strokeWidth={2.5}
            className="h-5 w-5"
            style={{ vectorEffect: "non-scaling-stroke" }}
          />
        </button>

        {onToggleFullscreen && (
          <button
            type="button"
            onClick={handleFullscreenToggle}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              handleFullscreenToggle();
            }}
            aria-label={resolvedFullscreenLabel}
            className={baseUtilityButtonClass}
            title={resolvedFullscreenLabel}
            style={{ touchAction: "manipulation" }}
          >
            {isFullscreen ? (
              <Minimize2
                strokeWidth={2.5}
                className="h-5 w-5"
                style={{ vectorEffect: "non-scaling-stroke" }}
              />
            ) : (
              <Maximize2
                strokeWidth={2.5}
                className="h-5 w-5"
                style={{ vectorEffect: "non-scaling-stroke" }}
              />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ZoomControls;
