import React, { useState, useEffect } from "react";
import { getPlaceholderImage } from "../../utils/imageLoader";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: "square" | "4:3" | "16:9" | "auto";
  blur?: boolean;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc,
  aspectRatio = "4:3",
  blur = false,
  className = "",
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Set aspect ratio class
  const aspectRatioClass = {
    square: "aspect-w-1 aspect-h-1",
    "4:3": "aspect-w-4 aspect-h-3",
    "16:9": "aspect-w-16 aspect-h-9",
    auto: "",
  }[aspectRatio];

  // Handle image loading
  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);

    // If no src provided, use fallback
    if (!src) {
      setImgSrc(fallbackSrc || getPlaceholderImage());
      setIsLoading(false);
      return;
    }

    // Otherwise, set the provided src
    setImgSrc(src);
  }, [src, fallbackSrc]);

  // Handle error
  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc || getPlaceholderImage());
      setHasError(true);
    }
    setIsLoading(false);
  };

  // Handle load
  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      className={`image-wrapper relative overflow-hidden ${aspectRatioClass} ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary-500 dark:border-gray-700 dark:border-t-primary-400"></div>
        </div>
      )}

      <img
        src={imgSrc}
        alt={alt || ""}
        onError={handleError}
        onLoad={handleLoad}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${blur ? "filter blur-sm" : ""}`}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
