/**
 * Performance monitoring and optimization utilities
 */

/**
 * Measure and log performance metrics
 */
export const measurePerformance = () => {
  // Measure First Contentful Paint (FCP)
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === "paint") {
          console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ["paint"] });
  }

  // Measure Core Web Vitals
  if ("PerformanceObserver" in window) {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        console.log(`FID: ${entry.processingStart - entry.startTime}ms`);
      });
    });
    fidObserver.observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log(`CLS: ${clsValue}`);
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });
  }
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  // Preload critical CSS
  const criticalCSS = document.createElement("link");
  criticalCSS.rel = "preload";
  criticalCSS.as = "style";
  criticalCSS.href = "./src/index.css";
  document.head.appendChild(criticalCSS);

  // Preload critical fonts
  const fontPreload = document.createElement("link");
  fontPreload.rel = "preload";
  fontPreload.as = "font";
  fontPreload.type = "font/woff2";
  fontPreload.href = "https://use.typekit.net/vhd7uad.css";
  fontPreload.crossOrigin = "anonymous";
  document.head.appendChild(fontPreload);
};

/**
 * Optimize scroll performance
 */
export const optimizeScrollPerformance = () => {
  // Use passive event listeners for better scroll performance
  let scrollTimeout: NodeJS.Timeout;

  const handleScroll = () => {
    // Throttle scroll events
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      // Handle scroll logic here
    }, 16); // ~60fps
  };

  document.addEventListener("scroll", handleScroll, { passive: true });
};

/**
 * Initialize performance optimizations
 */
export const initializePerformanceOptimization = () => {
  // Only run in production or when explicitly enabled
  if (
    process.env.NODE_ENV === "production" ||
    window.location.search.includes("debug=perf")
  ) {
    measurePerformance();
  }

  preloadCriticalResources();
  optimizeScrollPerformance();
};
