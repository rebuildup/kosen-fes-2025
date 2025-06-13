import React from "react";

interface LoadingIndicatorProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

/**
 * Loading indicator component with accessibility support
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = "medium",
  message,
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div role="status" aria-live="polite">
      <div aria-hidden="true" />
      {message && <span>{message}</span>}
      <span>読み込み中...</span>
    </div>
  );
};

export default LoadingIndicator;
