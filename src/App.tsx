// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  // Set up global page transition animations
  useEffect(() => {
    // Define reusable page transition
    const pageTransition = (element: string) => {
      return gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "all",
        }
      );
    };

    // Create a MutationObserver to detect route changes
    const observer = new MutationObserver(() => {
      // Find the main content element on page change
      const mainContent = document.querySelector(".mainContent > div");
      if (mainContent) {
        pageTransition(mainContent as any);
      }
    });

    // Start observing the document body for DOM changes
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <Router></Router>;
};

export default App;
