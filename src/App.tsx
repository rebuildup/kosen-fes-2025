// src/App.tsx
import { useEffect, useRef } from "react"; // Remove useState if not using it
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Exhibits from "./pages/Exhibits";
import Timetable from "./pages/Timetable";
import Map from "./pages/Map";
import "./App.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animation when the app loads
    const ctx = gsap.context(() => {
      gsap.from(".app-container", {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      });
    }, appRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="app-container" ref={appRef}>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/exhibits" element={<Exhibits />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
