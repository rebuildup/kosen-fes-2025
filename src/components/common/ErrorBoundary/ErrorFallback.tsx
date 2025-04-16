// src/components/common/ErrorBoundary/ErrorFallback.tsx
import React from "react";

interface ErrorFallbackProps {
  error: Error | null;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <p>We apologize for the inconvenience. Please try again later.</p>
      {error && (
        <details className="error-details">
          <summary>Error details</summary>
          <p>{error.message}</p>
        </details>
      )}
    </div>
  );
};

export default ErrorFallback;
