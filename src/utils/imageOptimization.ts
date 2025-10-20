/**
 * Image optimization utilities for better performance
 */

/**
 * Lazy load images with intersection observer
 */
export const setupLazyImages = () => {
  const images = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;

            if (src) {
              img.src = src;
              img.removeAttribute("data-src");
              observer.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: "50px 0px", // Start loading 50px before image comes into view
      },
    );

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach((img: Element) => {
      const imageElement = img as HTMLImageElement;
      const src = imageElement.dataset.src;
      if (src) {
        imageElement.src = src;
        imageElement.removeAttribute("data-src");
      }
    });
  }
};

/**
 * Check if WebP is supported
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  });
};

/**
 * Convert image path to WebP if supported
 */
export const getOptimizedImagePath = async (
  originalPath: string,
): Promise<string> => {
  const webpSupported = await supportsWebP();

  if (webpSupported && !originalPath.includes(".webp")) {
    // Convert to WebP path
    const extension = originalPath.split(".").pop();
    return originalPath.replace(`.${extension}`, ".webp");
  }

  return originalPath;
};

/**
 * Preload critical images
 */
export const preloadCriticalImages = (imageUrls: string[]) => {
  imageUrls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Optimize image loading for cards
 */
export const optimizeCardImages = () => {
  const cardImages = document.querySelectorAll(".card-image");

  cardImages.forEach((img: Element) => {
    const imageElement = img as HTMLImageElement;

    // Add loading attribute for native lazy loading
    if (!imageElement.hasAttribute("loading")) {
      imageElement.setAttribute("loading", "lazy");
    }

    // Add decoding attribute for better performance
    if (!imageElement.hasAttribute("decoding")) {
      imageElement.setAttribute("decoding", "async");
    }
  });
};

/**
 * Initialize all image optimizations
 */
export const initializeImageOptimization = () => {
  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupLazyImages();
      optimizeCardImages();
    });
  } else {
    setupLazyImages();
    optimizeCardImages();
  }
};
