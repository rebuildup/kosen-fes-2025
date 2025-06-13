import { useState, useCallback } from "react";
import { getPlaceholderImage } from "../utils/itemHelpers";

interface UseImageLoaderOptions {
  itemType?: string;
  onLoad?: () => void;
  onError?: () => void;
}

interface UseImageLoaderReturn {
  isLoaded: boolean;
  hasError: boolean;
  currentImageUrl: string;
  handleImageLoad: () => void;
  handleImageError: () => void;
  resetImageState: () => void;
}

/**
 * Custom hook for handling image loading states and fallbacks
 */
export const useImageLoader = (
  imageUrl: string,
  options: UseImageLoaderOptions = {}
): UseImageLoaderReturn => {
  const { itemType = "default", onLoad, onError } = options;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
    onError?.();
  }, [onError]);

  const resetImageState = useCallback(() => {
    setIsLoaded(false);
    setHasError(false);
  }, []);

  const currentImageUrl = hasError 
    ? getPlaceholderImage(itemType) 
    : imageUrl;

  return {
    isLoaded,
    hasError,
    currentImageUrl,
    handleImageLoad,
    handleImageError,
    resetImageState,
  };
};