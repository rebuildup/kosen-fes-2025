import React from "react";

interface LoadingIndicatorProps {
  size?: "small" | "medium" | "large";
  message?: string;
  className?: string;
}

/**
 * Loading indicator component with accessibility support
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = "medium",
  message,
  className = "",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div 
      className={`loading-indicator flex flex-col items-center justify-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div 
        className={`spinner ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      {message && (
        <span className="text-sm text-secondary sr-only">
          {message}
        </span>
      )}
      <span className="sr-only">読み込み中...</span>
    </div>
  );
};

export default LoadingIndicator;