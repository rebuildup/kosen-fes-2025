import { Loader2 } from "lucide-react";

/**
 * Minimal loading indicator used as a Suspense fallback for route changes.
 * Positioned centered in the viewport to avoid flashing in the top-left.
 */
const LoadingIndicator = () => {
  return (
    <div
      role="status"
      aria-label="loading"
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div className="pointer-events-auto p-2 rounded-md bg-white/0 dark:bg-black/0">
        <Loader2 className="w-6 h-6 animate-spin text-current" />
      </div>
    </div>
  );
};

export default LoadingIndicator;
