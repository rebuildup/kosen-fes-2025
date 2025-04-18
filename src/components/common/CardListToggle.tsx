import { useLanguage } from "../../context/LanguageContext";

interface CardListToggleProps {
  viewMode: "default" | "compact" | "grid" | "list";
  setViewMode: (mode: "default" | "compact" | "grid" | "list") => void;
  className?: string;
}

const CardListToggle = ({
  viewMode,
  setViewMode,
  className = "",
}: CardListToggleProps) => {
  const { t } = useLanguage();

  return (
    <div className={`view-mode-toggle ${className}`}>
      <span className="view-mode-label">{t("common.view")}:</span>

      <div className="view-mode-buttons">
        <button
          className={`view-mode-button ${
            viewMode === "default" ? "active" : ""
          }`}
          onClick={() => setViewMode("default")}
          aria-label={t("common.viewDefault")}
          title={t("common.viewDefault")}
        >
          <span className="view-mode-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </span>
        </button>

        <button
          className={`view-mode-button ${
            viewMode === "compact" ? "active" : ""
          }`}
          onClick={() => setViewMode("compact")}
          aria-label={t("common.viewCompact")}
          title={t("common.viewCompact")}
        >
          <span className="view-mode-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="5" height="5" rx="1" />
              <rect x="10" y="3" width="5" height="5" rx="1" />
              <rect x="17" y="3" width="5" height="5" rx="1" />
              <rect x="3" y="10" width="5" height="5" rx="1" />
              <rect x="10" y="10" width="5" height="5" rx="1" />
              <rect x="17" y="10" width="5" height="5" rx="1" />
              <rect x="3" y="17" width="5" height="5" rx="1" />
              <rect x="10" y="17" width="5" height="5" rx="1" />
              <rect x="17" y="17" width="5" height="5" rx="1" />
            </svg>
          </span>
        </button>

        <button
          className={`view-mode-button ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
          aria-label={t("common.viewList")}
          title={t("common.viewList")}
        >
          <span className="view-mode-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="18" height="4" rx="1" />
              <rect x="3" y="10" width="18" height="4" rx="1" />
              <rect x="3" y="17" width="18" height="4" rx="1" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default CardListToggle;
