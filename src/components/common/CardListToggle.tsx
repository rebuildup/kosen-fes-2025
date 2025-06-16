import { useLanguage } from "../../context/LanguageContext";
import TabButtons from "./TabButtons";

interface CardListToggleProps {
  viewMode: "default" | "compact" | "grid" | "list";
  setViewMode: (mode: "default" | "compact" | "grid" | "list") => void;
}

const CardListToggle = ({ viewMode, setViewMode }: CardListToggleProps) => {
  const { t } = useLanguage();

  const viewOptions = [
    {
      value: "default",
      label: "⊞",
    },
    {
      value: "compact",
      label: "☰",
    },
    {
      value: "list",
      label: "⋯",
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-sm font-medium whitespace-nowrap"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {t("common.view")}:
      </span>
      <TabButtons
        options={viewOptions}
        activeValue={viewMode}
        onChange={(value) => setViewMode(value as typeof viewMode)}
        className="text-sm"
      />
    </div>
  );
};

export default CardListToggle;
