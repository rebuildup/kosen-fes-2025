/**
 * Utility functions for error handling
 */

/**
 * Log error to console or error tracking service
 * @param error Error object
 * @param info Additional information about where the error occurred
 */
export const logError = (error: Error, info?: { componentStack?: string }) => {
  // In a real app, you might send this to an error tracking service like Sentry
  console.error("Error caught by error boundary:", error);

  if (info?.componentStack) {
    console.error("Component stack:", info.componentStack);
  }
};

/**
 * Format error message for display
 * @param error Error object
 * @returns User-friendly error message
 */
export const formatErrorMessage = (error: Error): string => {
  // Map specific error types to user-friendly messages
  if (error.name === "NetworkError") {
    return "Network error. Please check your internet connection and try again.";
  }

  if (error.name === "TimeoutError") {
    return "Request timed out. Please try again later.";
  }

  if (error.message.includes("404")) {
    return "The requested resource could not be found.";
  }

  // Default generic message
  return error.message || "An unexpected error occurred. Please try again.";
};

/**
 * Check if an error is fatal or can be retried
 * @param error Error object
 * @returns Boolean indicating if the error is recoverable
 */
export const isRecoverableError = (error: Error): boolean => {
  // Some errors like network issues or timeouts can be retried
  if (
    error.name === "NetworkError" ||
    error.name === "TimeoutError" ||
    error.message.includes("timeout") ||
    error.message.includes("network")
  ) {
    return true;
  }

  // Programmatic errors are usually not recoverable
  return false;
};
