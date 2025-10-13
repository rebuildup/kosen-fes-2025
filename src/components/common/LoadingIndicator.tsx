import { Loader2 } from "lucide-react";

const LoadingIndicator = () => {
  return (
    <div className="loading-indicator" role="status" aria-label="loading">
      <Loader2 className="w-6 h-6 animate-spin text-current" />
    </div>
  );
};

export default LoadingIndicator;
