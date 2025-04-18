// src/components/pages/events/EventHeader.tsx
import React from "react";
import { useLanguage } from "../../../hooks/useLanguage";

const EventHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="events-header bg-primary-600 py-8 text-white mb-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">{t("events.title")}</h1>
        <p className="text-lg opacity-90">{t("events.description")}</p>
      </div>
    </div>
  );
};

export default EventHeader;
