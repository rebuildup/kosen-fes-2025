// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Layout from "./components/layout/Layout/Layout";

// Import page components
import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import Exhibits from "./pages/Exhibits/Exhibits";
import Timetable from "./pages/Timetable/Timetable";
import Map from "./pages/Map/Map";
import Search from "./pages/Search/Search";
import Detail from "./pages/Detail/Detail";
import Bookmarks from "./pages/Bookmarks/Bookmarks";

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

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/exhibits" element={<Exhibits />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/map" element={<Map />} />
          <Route path="/search" element={<Search />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/detail/:type/:id" element={<Detail />} />
<<<<<<< HEAD
=======
          {/* Redirect any unknown paths to Home */}
>>>>>>> 27b41800522a1f0d13c1fecd832ae7c860c1fb45
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
