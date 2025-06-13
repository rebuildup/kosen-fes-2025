import { useLanguage } from "../../context/LanguageContext";

interface CardListToggleProps {
  viewMode: "default" | "compact" | "grid" | "list";
  setViewMode: (mode: "default" | "compact" | "grid" | "list") => void;
}

const CardListToggle = ({ viewMode, setViewMode }: CardListToggleProps) => {
  const { t } = useLanguage();

  return (
    <div>
      <span>{t("common.view")}:</span>

      <div>
        <button
          onClick={() => setViewMode("default")}
          aria-label={t("common.viewDefault")}
          title={t("common.viewDefault")}
        >
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </span>
        </button>

        <button
          onClick={() => setViewMode("compact")}
          aria-label={t("common.viewCompact")}
          title={t("common.viewCompact")}
        >
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="18" height="4" rx="1" />
              <rect x="3" y="10" width="18" height="4" rx="1" />
              <rect x="3" y="17" width="18" height="4" rx="1" />
            </svg>
          </span>
        </button>

        <button
          onClick={() => setViewMode("list")}
          aria-label={t("common.viewList")}
          title={t("common.viewList")}
        >
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default CardListToggle;
