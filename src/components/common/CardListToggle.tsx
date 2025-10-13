import { useLanguage } from "../../context/LanguageContext";
import TabButtons, { TabOption } from "./TabButtons";
import { Grip, LayoutGrid, Menu } from "lucide-react";

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

  const viewOptions: TabOption[] = [
    {
      value: "default",
      label: <LayoutGrid size={16} />,
    },
    {
      value: "compact",
      label: <Grip size={16} />,
    },
    {
      value: "list",
      label: <Menu size={16} />,
    },
  ];

  return (
    <div className={`flex items-center gap-2 flex-shrink-0 ${className}`}>
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
