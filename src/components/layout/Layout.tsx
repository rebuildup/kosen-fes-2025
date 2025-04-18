import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Menu from "./Menu";
import { useTheme } from "../../context/ThemeContext";

const Layout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();

  // Update isMobile state based on screen width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className={`app ${theme}`}>
      {/* PC Header - only shown on desktop */}
      {!isMobile && <Header />}

      <div className="content-container">
        {/* PC Sidebar - only shown on desktop */}
        {!isMobile && <Sidebar />}

        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile Footer - only shown on mobile */}
      {isMobile && <Footer setMenuOpen={setMenuOpen} />}

      {/* Mobile Menu - only shown when opened on mobile */}
      {isMobile && menuOpen && <Menu setMenuOpen={setMenuOpen} />}
    </div>
  );
};

export default Layout;
