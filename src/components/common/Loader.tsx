// src/components/common/Loader.tsx
import React from "react";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = "medium", className = "" }) => {
  const sizeClass = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-3",
    large: "h-12 w-12 border-4",
  }[size];

  return (
    <div className={`loader ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeClass} border-b-2 border-primary-500`}
      ></div>
    </div>
  );
};

export default Loader;
