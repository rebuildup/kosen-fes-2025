import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Menu from "./Menu";
import { useTheme } from "../../context/ThemeContext";
import PageTransition from "./PageTransition";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../utils/animations";

const Layout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuCloseButtonRef = useRef<HTMLButtonElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      // CHANGE: Update to only consider truly mobile screens as "mobile"
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Theme transition effect
  useEffect(() => {
    if (layoutRef.current) {
      gsap.to(layoutRef.current, {
        backgroundColor: "var(--color-bg)",
        color: "var(--color-main)",
        duration: DURATION.NORMAL,
        ease: EASE.SMOOTH,
      });
    }
  }, [theme]);

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

  // Menu open/close animation
  const toggleMenu = (open: boolean) => {
    setMenuOpen(open);

    if (open) {
      // Menu opening animation handled in Menu component
    } else {
      // Menu closing animation can be triggered here if needed
      const menuOverlay = document.querySelector(".mobile-menu-backdrop");
      const mobileMenu = document.querySelector(".mobile-menu-panel");

      if (menuOverlay && mobileMenu) {
        const tl = gsap.timeline({
          onComplete: () => {
            setMenuOpen(false);
          },
        });

        tl.to(mobileMenu, {
          x: "100%",
          duration: DURATION.NORMAL,
          ease: EASE.SMOOTH,
        }).to(
          menuOverlay,
          {
            autoAlpha: 0,
            duration: DURATION.FAST,
            ease: EASE.SMOOTH,
          },
          "-=0.2"
        );
      }
    }
  };

  // Close menu when screen size changes from mobile to desktop
  useEffect(() => {
    if (!isMobile && menuOpen) {
      setMenuOpen(false);
    }
  }, [isMobile, menuOpen]);

  return (
    <div
      ref={layoutRef}
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-main)" }}
    >
      {/* Header - only shown on desktop */}
      {!isMobile && <Header />}

      {/* Full width container */}
      <div className="w-full">
        {isMobile ? (
          /* Mobile Layout - Full width main content with bottom padding for footer */
          <main className="px-4 sm:px-6 pb-20">
            <div
              className="min-h-screen"
              style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-main)",
              }}
            >
              <PageTransition>
                <Outlet />
              </PageTransition>
            </div>
          </main>
        ) : (
          /* Desktop Layout - Aligned with header content width */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-6">
              {/* Desktop Sidebar - Fixed width */}
              <div className="flex-shrink-0">
                <Sidebar />
              </div>

              {/* Main Content - Controlled width within header bounds */}
              <main className="flex-1 min-w-0 pt-16">
                <div
                  className="min-h-screen max-w-full main-content"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-main)",
                  }}
                >
                  <PageTransition>
                    <Outlet />
                  </PageTransition>
                </div>
              </main>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Footer - only shown on mobile */}
      {isMobile && (
        <Footer setMenuOpen={toggleMenu} menuButtonRef={menuButtonRef} />
      )}

      {/* Mobile Menu - only shown when opened on mobile */}
      {isMobile && menuOpen && (
        <Menu setMenuOpen={toggleMenu} closeButtonRef={menuCloseButtonRef} />
      )}
    </div>
  );
};

export default Layout;
