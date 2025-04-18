import React from "react";
import { useLanguage } from "../../../hooks/useLanguage";

// Exhibition types
type ExhibitionType = "all" | "exhibition" | "foodStall";

interface TypeFilterProps {
  activeType: ExhibitionType;
  onChange: (type: ExhibitionType) => void;
  className?: string;
}

const TypeFilter: React.FC<TypeFilterProps> = ({
  activeType,
  onChange,
  className = "",
}) => {
  const { t } = useLanguage();

  // Filter options
  const options = [
    { value: "all", label: t("exhibitions.all") },
    { value: "exhibition", label: t("exhibitions.exhibitions") },
    { value: "foodStall", label: t("exhibitions.foodStalls") },
  ];

  return (
    <div className={`type-filter ${className}`}>
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("exhibitions.filterByType")}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value as ExhibitionType)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors
                      ${
                        activeType === option.value
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      }`}
            aria-pressed={activeType === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
