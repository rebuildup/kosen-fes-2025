import { useLanguage } from "../../context/LanguageContext";

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
  const { t } = useLanguage();

  const buttonBaseClass = `
    flex items-center justify-center w-10 h-10 rounded-lg 
    transition-all duration-200 shadow-md hover:shadow-lg 
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:scale-105 active:scale-95 touch-action-manipulation
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
  `;

  const buttonStyle = {
    backgroundColor: "var(--color-bg-secondary)",
    color: "var(--color-text-primary)",
    border: "1px solid var(--color-border-primary)",
  };

  const disabledButtonStyle = {
    backgroundColor: "var(--color-bg-tertiary)",
    color: "var(--color-text-tertiary)",
    border: "1px solid var(--color-border-secondary)",
  };

  const handleZoomIn = () => {
    if (scale < maxScale) {
      onZoomIn();
    }
  };

  const handleZoomOut = () => {
    if (scale > minScale) {
      onZoomOut();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Zoom In Button */}
      <button
        onClick={handleZoomIn}
        disabled={scale >= maxScale}
        className={buttonBaseClass}
        style={scale >= maxScale ? disabledButtonStyle : buttonStyle}
        aria-label={t("map.zoomIn")}
        title="画面中央を中心にズームイン"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
          <line x1="11" y1="8" x2="11" y2="14" />
        </svg>
      </button>

      {/* Zoom Out Button */}
      <button
        onClick={handleZoomOut}
        disabled={scale <= minScale}
        className={buttonBaseClass}
        style={scale <= minScale ? disabledButtonStyle : buttonStyle}
        aria-label={t("map.zoomOut")}
        title="画面中央を中心にズームアウト"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      {/* Reset Zoom Button */}
      <button
        onClick={onReset}
        className={buttonBaseClass}
        style={buttonStyle}
        aria-label={t("map.resetZoom")}
        title="ズームをリセット（全体表示）"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      </button>

      {/* Zoom Level Indicator */}
      <div
        className="flex items-center justify-center px-2 py-1 rounded-lg text-xs font-medium shadow-md"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          color: "var(--color-text-secondary)",
          border: "1px solid var(--color-border-primary)",
        }}
        aria-label={`現在のズーム倍率: ${Math.round(scale * 100)}%`}
      >
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

export default ZoomControls;
