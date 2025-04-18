/**
 * Utility functions for image handling
 */

/**
 * Get a placeholder image URL
 * @param width Image width
 * @param height Image height
 * @returns Placeholder image URL
 */
export const getPlaceholderImage = (width = 400, height = 300): string => {
  return `/api/placeholder/${width}/${height}`;
};

/**
 * Get a color placeholder image
 * @param color HEX color code (without #)
 * @param width Image width
 * @param height Image height
 * @returns Color placeholder image URL
 */
export const getColorPlaceholder = (
  color = "3b82f6",
  width = 400,
  height = 300
): string => {
  return `/api/placeholder/${width}/${height}/${color}`;
};

/**
 * Format image URL with responsive sizing
 * @param url Base image URL
 * @param width Requested width
 * @param height Requested height
 * @returns Formatted image URL
 */
export const formatImageUrl = (
  url: string,
  width?: number,
  height?: number
): string => {
  // If no width or height provided, return original URL
  if (!width && !height) {
    return url;
  }

  // If URL is already a placeholder, return as is
  if (url.includes("/api/placeholder/")) {
    return url;
  }

  // For external URLs, return as is
  if (url.startsWith("http")) {
    return url;
  }

  // For internal images, add size parameters
  // This assumes your backend supports resizing via URL parameters
  const params = new URLSearchParams();
  if (width) params.append("w", width.toString());
  if (height) params.append("h", height.toString());

  return params.toString() ? `${url}?${params.toString()}` : url;
};

/**
 * Get image dimensions (if possible)
 * @param url Image URL
 * @returns Promise with image dimensions
 */
export const getImageDimensions = (
  url: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
};

/**
 * Check if an image URL is valid
 * @param url Image URL to check
 * @returns Promise resolving to boolean
 */
export const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
};
