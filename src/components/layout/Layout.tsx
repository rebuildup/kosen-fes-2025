import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Menu from "./Menu";
import { useTheme } from "../../context/ThemeContext";

const Layout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuCloseButtonRef = useRef<HTMLButtonElement>(null);

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

      // Focus the close button when menu opens
      if (menuCloseButtonRef.current) {
        menuCloseButtonRef.current.focus();
      }
    } else {
      document.body.style.overflow = "";

      // Return focus to menu button when menu closes
      if (menuButtonRef.current) {
        menuButtonRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu when screen size changes from mobile to desktop
  useEffect(() => {
    if (!isMobile && menuOpen) {
      setMenuOpen(false);
    }
  }, [isMobile, menuOpen]);

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
      {isMobile && (
        <Footer setMenuOpen={setMenuOpen} menuButtonRef={menuButtonRef} />
      )}

      {/* Mobile Menu - only shown when opened on mobile */}
      {isMobile && menuOpen && (
        <Menu setMenuOpen={setMenuOpen} closeButtonRef={menuCloseButtonRef} />
      )}
    </div>
  );
};

export default Layout;
