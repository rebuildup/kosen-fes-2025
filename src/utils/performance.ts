/**
 * Performance monitoring and optimization utilities
 */

/**
 * Measure and log performance metrics
 */
export const measurePerformance = () => {
  // Measure First Contentful Paint (FCP)
  if ("PerformanceObserver" in globalThis) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.entryType === "paint") {
          console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
        }
      }
    });

    observer.observe({ entryTypes: ["paint"] });
  }

  // Measure Core Web Vitals
  if ("PerformanceObserver" in globalThis) {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries.at(-1);
      if (lastEntry) {
        console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
      }
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        console.log(
          `FID: ${(entry as PerformanceEventTiming).processingStart - entry.startTime}ms`,
        );
      }
    });
    fidObserver.observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        const layoutShiftEntry = entry as PerformanceEntry & {
          hadRecentInput: boolean;
          value: number;
        };
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }
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
  // Once preloaded, convert to stylesheet to apply styles without blocking render
  criticalCSS.onload = () => {
    criticalCSS.rel = "stylesheet";
  };
  document.head.append(criticalCSS);

  // Preload critical fonts
  // Note: Do NOT preload external font stylesheet as a font resource; that may trigger unused-preload warnings.
  // Use preconnect + stylesheet in the HTML (index.html) for external fonts instead.
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
  if (process.env.NODE_ENV === "production" || globalThis.location.search.includes("debug=perf")) {
    measurePerformance();
  }

  preloadCriticalResources();
  optimizeScrollPerformance();
};
