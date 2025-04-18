import React from "react";
import { useLanguage } from "../../../hooks/useLanguage";

const TimetableHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="timetable-header bg-primary-600 py-8 text-white mb-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">{t("timetable.title")}</h1>
        <p className="text-lg opacity-90">{t("timetable.description")}</p>
      </div>
    </div>
  );
};

export default TimetableHeader;
