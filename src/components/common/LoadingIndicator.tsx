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
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="pointer-events-auto rounded-md bg-white/0 p-2 dark:bg-black/0">
        <Loader2 className="h-6 w-6 animate-spin text-current" />
      </div>
    </div>
  );
};

export default LoadingIndicator;
