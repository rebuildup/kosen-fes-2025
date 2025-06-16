import React from "react";

interface LoadingIndicatorProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

/**
 * Loading indicator component with accessibility support
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message,
}) => {
  return (
    <div role="status" aria-live="polite">
      <div aria-hidden="true" />
      {message && <span>{message}</span>}
      <span>読み込み中...</span>
    </div>
  );
};

export default LoadingIndicator;
