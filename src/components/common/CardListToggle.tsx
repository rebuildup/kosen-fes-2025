import { Grip, LayoutGrid, Menu } from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import type { TabOption } from "./TabButtons";
import TabButtons from "./TabButtons";

interface CardListToggleProps {
  viewMode: "default" | "compact" | "grid" | "list";
  setViewMode: (mode: "default" | "compact" | "grid" | "list") => void;
  className?: string;
}

const CardListToggle = ({ className = "", setViewMode, viewMode }: CardListToggleProps) => {
  const { t } = useLanguage();

  const viewOptions: TabOption[] = [
    {
      label: <LayoutGrid size={16} />,
      value: "default",
    },
    {
      label: <Grip size={16} />,
      value: "compact",
    },
    {
      label: <Menu size={16} />,
      value: "list",
    },
  ];

  return (
    <div className={`flex flex-shrink-0 items-center gap-2 ${className}`}>
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
