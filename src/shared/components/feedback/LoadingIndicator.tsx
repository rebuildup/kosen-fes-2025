import React from "react";
import { useLanguage } from "../../../context/LanguageContext";

interface LoadingIndicatorProps {
  size?: "small" | "medium" | "large";
  message?: string;
  showSpinner?: boolean;
  className?: string;
}

/**
 * Loading indicator component with accessibility support
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = "medium",
  message,
  showSpinner = true,
  className = "",
}) => {
  const { t } = useLanguage();

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          spinner: "w-4 h-4",
          text: "text-sm",
        };
      case "large":
        return {
          spinner: "w-8 h-8",
          text: "text-lg",
        };
      default:
        return {
          spinner: "w-6 h-6",
          text: "text-base",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      {showSpinner && (
        <div
          className={`${sizeClasses.spinner} animate-spin text-blue-600 dark:text-blue-400`}
          aria-hidden="true"
        >
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      )}
      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>
        {message || t("common.loadingCards")}
      </span>
    </div>
  );
};

export default LoadingIndicator;
