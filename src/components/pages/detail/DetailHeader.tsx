import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../hooks/useLanguage";
import { SearchResult } from "../../../types/common";

interface DetailHeaderProps {
  item: SearchResult;
  className?: string;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({
  item,
  className = "",
}) => {
  const { t } = useLanguage();

  // Determine the back link based on item type
  const getBackLink = () => {
    switch (item.type) {
      case "event":
        return "/events";
      case "exhibition":
        return "/exhibitions";
      case "foodStall":
        return "/exhibitions";
      default:
        return "/";
    }
  };

  // Get item type label
  const getTypeLabel = () => {
    switch (item.type) {
      case "event":
        return t("header.events");
      case "exhibition":
        return t("exhibitions.exhibitions");
      case "foodStall":
        return t("exhibitions.foodStalls");
      default:
        return "";
    }
  };

  return (
    <div
      className={`detail-header bg-primary-600 py-8 text-white mb-8 ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Link
            to={getBackLink()}
            className="inline-flex items-center text-white/90 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            {t("detail.backToList")}
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm text-white/70 mb-1">{getTypeLabel()}</div>
            <h1 className="text-3xl font-bold">{item.title}</h1>
          </div>

          {item.date && (
            <div className="mt-2 md:mt-0 text-white/90 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {item.date}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailHeader;
