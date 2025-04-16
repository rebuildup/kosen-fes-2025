// src/components/Header.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import "./Header.css";
import Logo from "./Logo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Animate navigation items
    gsap.from(".nav-item", {
      opacity: 0,
      y: -20,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-container">
          <Logo />
          <span className="site-title">Festival 2025</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`menu-icon ${isMenuOpen ? "open" : ""}`}></span>
        </button>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/events"
                className={location.pathname === "/events" ? "active" : ""}
              >
                Events
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/exhibits"
                className={location.pathname === "/exhibits" ? "active" : ""}
              >
                Exhibits
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/timetable"
                className={location.pathname === "/timetable" ? "active" : ""}
              >
                Timetable
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/map"
                className={location.pathname === "/map" ? "active" : ""}
              >
                Map
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
