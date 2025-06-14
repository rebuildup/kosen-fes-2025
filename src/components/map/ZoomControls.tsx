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

  return (
    <div>
      <button
        onClick={onZoomIn}
        disabled={scale >= maxScale}
        aria-label={t("map.zoomIn")}
        title={t("map.zoomIn")}
      >
        <svg
          width="24"
          height="24"
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

      <button
        onClick={onZoomOut}
        disabled={scale <= minScale}
        aria-label={t("map.zoomOut")}
        title={t("map.zoomOut")}
      >
        <svg
          width="24"
          height="24"
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

      <button
        onClick={onReset}
        aria-label={t("map.resetZoom")}
        title={t("map.resetZoom")}
      >
        <svg
          width="24"
          height="24"
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

      <div>{Math.round(scale * 100)}%</div>
    </div>
  );
};

export default ZoomControls;
