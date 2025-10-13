import React from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { Loader2 } from "lucide-react";

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
          aria-hidden="true"
          className={`${sizeClasses.spinner} text-blue-600 dark:text-blue-400`}
        >
          <Loader2 className="w-full h-full animate-spin" />
        </div>
      )}
      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>
        {message || t("common.loadingCards")}
      </span>
    </div>
  );
};

export default LoadingIndicator;
