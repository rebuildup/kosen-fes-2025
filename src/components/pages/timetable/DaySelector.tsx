import React from "react";
import { useLanguage } from "../../../hooks/useLanguage";

interface Day {
  date: string;
  label: string;
}

interface DaySelectorProps {
  days: Day[];
  activeDay: number;
  onChange: (dayIndex: number) => void;
  className?: string;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  days,
  activeDay,
  onChange,
  className = "",
}) => {
  const { t, language } = useLanguage();

  // Format date based on current language
  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className={`day-selector ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {days.map((day, index) => (
          <button
            key={day.date}
            onClick={() => onChange(index)}
            className={`day-selector-item p-4 rounded-lg border transition-all duration-200
                      ${
                        activeDay === index
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700"
                      }`}
            aria-pressed={activeDay === index}
          >
            <div className="text-lg font-semibold mb-1">{day.label}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(day.date)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DaySelector;
