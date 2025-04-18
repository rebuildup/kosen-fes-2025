import React from "react";

interface CardSkeletonProps {
  className?: string;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`card-skeleton animate-pulse rounded-lg bg-background-card shadow-md ${className}`}
    >
      {/* Image placeholder */}
      <div className="h-48 w-full rounded-t-lg bg-gray-300 dark:bg-gray-700" />

      {/* Content placeholders */}
      <div className="p-4">
        {/* Title placeholder */}
        <div className="mb-3 h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />

        {/* Description placeholder */}
        <div className="mb-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mb-4 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />

        {/* Tags placeholder */}
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
