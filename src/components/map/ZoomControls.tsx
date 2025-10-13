import { useEffect } from "react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
  minScale: number;
  maxScale: number;
}

const ZoomControls = ({
  onZoomIn,
  onZoomOut,
  onReset,
  scale,
  minScale,
  maxScale,
}: ZoomControlsProps) => {
  // キーボードショートカット
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

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white/95 rounded-lg p-2 shadow-lg border">
      {/* ズームイン */}
      <button
        onClick={onZoomIn}
        onTouchStart={(e) => {
          // ReactのtouchStartはpassiveなのでpreventDefault()を削除
          e.stopPropagation();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          if (!e.currentTarget.disabled) {
            onZoomIn();
          }
        }}
        disabled={scale >= maxScale}
        className="flex items-center justify-center w-8 h-8 rounded text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
        title="ズームイン (Ctrl/Cmd + +)"
        style={{ touchAction: "manipulation" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
          <line x1="11" y1="8" x2="11" y2="14" />
        </svg>
      </button>

      {/* ズームアウト */}
      <button
        onClick={onZoomOut}
        onTouchStart={(e) => {
          // ReactのtouchStartはpassiveなのでpreventDefault()を削除
          e.stopPropagation();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          if (!e.currentTarget.disabled) {
            onZoomOut();
          }
        }}
        disabled={scale <= minScale}
        className="flex items-center justify-center w-8 h-8 rounded text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
        title="ズームアウト (Ctrl/Cmd + -)"
        style={{ touchAction: "manipulation" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      {/* リセット */}
      <button
        onClick={onReset}
        onTouchStart={(e) => {
          // ReactのtouchStartはpassiveなのでpreventDefault()を削除
          e.stopPropagation();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          onReset();
        }}
        className="flex items-center justify-center w-8 h-8 rounded text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
        title="リセット (Ctrl/Cmd + 0)"
        style={{ touchAction: "manipulation" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      </button>

      {/* ズーム倍率表示 */}
      <div className="flex items-center justify-center w-8 h-6 text-xs font-medium text-gray-600 bg-gray-50 rounded mt-1">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

export default ZoomControls;
