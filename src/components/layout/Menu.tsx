import { useRef, useEffect, useCallback, MutableRefObject } from "react";
import { NavLink, Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import ThemeToggleIcon from "../common/ThemeToggleIcon";
import LanguageToggleIcon from "../common/LanguageToggleIcon";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../utils/animations";
import {
  HomeIcon,
  EventIcon,
  ExhibitIcon,
  ScheduleIcon,
  MapIcon,
  BookmarkIcon,
  SearchIcon,
  XIcon,
} from "../icons";

// Create the XIcon component first
// Path: src/components/icons/XIcon.tsx
// ```tsx
// import React from 'react';
// import { Icon, IconProps } from './index';
//
// export const XIcon: React.FC<IconProps> = (props) => (
//   <Icon {...props}>
//     <line x1="18" y1="6" x2="6" y2="18" />
//     <line x1="6" y1="6" x2="18" y2="18" />
//   </Icon>
// );
// ```

interface MenuProps {
  setMenuOpen: (open: boolean) => void;
  closeButtonRef?: MutableRefObject<HTMLButtonElement | null>;
}

const Menu = ({ setMenuOpen, closeButtonRef }: MenuProps) => {
  const { t } = useLanguage();
  const { bookmarks } = useBookmark();
  const menuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);

  // Handle menu opening animation
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    const initAnimation = () => {
      if (menuRef.current && backdropRef.current) {
        const tl = gsap.timeline();

        // Initial state - ensure menu starts off screen
        gsap.set(menuRef.current, { x: "100%" });
        gsap.set(backdropRef.current, { autoAlpha: 0 });

        // Animation
        tl.to(backdropRef.current, {
          autoAlpha: 1,
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        });

        tl.to(
          menuRef.current,
          {
            x: "0%",
            duration: DURATION.NORMAL,
            ease: EASE.SMOOTH,
          },
          "-=0.1"
        );
      }
    };

    // Delay animation to ensure DOM is ready
    requestAnimationFrame(initAnimation);
  }, []);

  // Handle menu close with animation
  const closeWithAnimation = useCallback(() => {
    if (menuRef.current && backdropRef.current) {
      const tl = gsap.timeline({
        onComplete: () => setMenuOpen(false),
      });

      tl.to(menuRef.current, {
        x: "100%",
        duration: DURATION.NORMAL,
        ease: EASE.SMOOTH,
      });

      tl.to(
        backdropRef.current,
        {
          autoAlpha: 0,
          duration: DURATION.FAST,
          ease: EASE.SMOOTH,
        },
        "-=0.2"
      );
    } else {
      setMenuOpen(false);
    }
  }, [setMenuOpen]);

  // Handle click outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeWithAnimation();
      }
    };

    // Add event listener for clicks outside menu
    document.addEventListener("mousedown", handleClickOutside);

    // Handle escape key press
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeWithAnimation();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    // Clean up event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [closeWithAnimation]);

  // Handle menu item click to close the menu
  const handleMenuItemClick = useCallback(() => {
    closeWithAnimation();
  }, [closeWithAnimation]);

  return createPortal(
    <div className="mobile-menu-overlay">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="mobile-menu-backdrop"
        onClick={() => closeWithAnimation()}
      ></div>

      {/* Menu Panel */}
      <div ref={menuRef} className="mobile-menu-panel">
        {/* Header */}
        <div className="mobile-menu-header">
          <div className="mobile-menu-title">{t("navigation.menu")}</div>
          <button
            onClick={() => closeWithAnimation()}
            aria-label={t("actions.close")}
            ref={closeButtonRef}
            className="mobile-menu-close-button"
          >
            <span className="mobile-menu-close-icon">
              <XIcon size={18} />
            </span>
          </button>
        </div>

        {/* Content */}
        <div ref={menuContentRef} className="mobile-menu-content">
          {/* Main Navigation */}
          <div className="mobile-menu-section">
            <h3 className="mobile-menu-section-title">
              {t("navigation.main")}
            </h3>
            <nav className="mobile-menu-nav">
              <NavLink
                to="/"
                onClick={handleMenuItemClick}
                end
                className={({ isActive }) =>
                  `mobile-menu-nav-item ${
                    isActive ? "mobile-menu-nav-item-active" : ""
                  }`
                }
              >
                <span className="mobile-menu-nav-icon">
                  <HomeIcon size={18} />
                </span>
                <span>{t("navigation.home")}</span>
              </NavLink>

              <NavLink
                to="/events"
                onClick={handleMenuItemClick}
                className={({ isActive }) =>
                  `mobile-menu-nav-item ${
                    isActive ? "mobile-menu-nav-item-active" : ""
                  }`
                }
              >
                <span className="mobile-menu-nav-icon">
                  <EventIcon size={18} />
                </span>
                <span>{t("navigation.events")}</span>
              </NavLink>

              <NavLink
                to="/exhibits"
                onClick={handleMenuItemClick}
                className={({ isActive }) =>
                  `mobile-menu-nav-item ${
                    isActive ? "mobile-menu-nav-item-active" : ""
                  }`
                }
              >
                <span className="mobile-menu-nav-icon">
                  <ExhibitIcon size={18} />
                </span>
                <span>{t("navigation.exhibits")}</span>
              </NavLink>

              <NavLink
                to="/schedule"
                onClick={handleMenuItemClick}
                className={({ isActive }) =>
                  `mobile-menu-nav-item ${
                    isActive ? "mobile-menu-nav-item-active" : ""
                  }`
                }
              >
                <span className="mobile-menu-nav-icon">
                  <ScheduleIcon size={18} />
                </span>
                <span>{t("navigation.schedule")}</span>
              </NavLink>

              <NavLink
                to="/map"
                onClick={handleMenuItemClick}
                className={({ isActive }) =>
                  `mobile-menu-nav-item ${
                    isActive ? "mobile-menu-nav-item-active" : ""
                  }`
                }
              >
                <span className="mobile-menu-nav-icon">
                  <MapIcon size={18} />
                </span>
                <span>{t("navigation.map")}</span>
              </NavLink>
            </nav>
          </div>

          {/* Quick Links */}
          <div className="mobile-menu-section">
            <h3 className="mobile-menu-section-title">
              {t("navigation.quickLinks")}
            </h3>
            <nav className="mobile-menu-nav">
              <Link
                to="/bookmarks"
                className="mobile-menu-nav-item"
                onClick={handleMenuItemClick}
              >
                <span className="mobile-menu-nav-icon">
                  <BookmarkIcon size={18} />
                </span>
                <span>{t("bookmarks.title")}</span>
                {bookmarks.length > 0 && (
                  <span className="mobile-menu-badge">{bookmarks.length}</span>
                )}
              </Link>

              <Link
                to="/search"
                className="mobile-menu-nav-item"
                onClick={handleMenuItemClick}
              >
                <span className="mobile-menu-nav-icon">
                  <SearchIcon size={18} />
                </span>
                <span>{t("search.title")}</span>
              </Link>
            </nav>
          </div>

          {/* Settings */}
          <div className="mobile-menu-section">
            <h3 className="mobile-menu-section-title">{t("settings.title")}</h3>
            <div className="mobile-menu-settings">
              <div className="mobile-menu-setting-item">
                <div className="flex items-center gap-3">
                  <span className="mobile-menu-setting-label">
                    {t("settings.theme.title")}
                  </span>
                </div>
                <ThemeToggleIcon />
              </div>

              <div className="mobile-menu-setting-item">
                <div className="flex items-center gap-3">
                  <span className="mobile-menu-setting-label">
                    {t("settings.language.title")}
                  </span>
                </div>
                <LanguageToggleIcon />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mobile-menu-section">
            <h3 className="mobile-menu-section-title">{t("info.title")}</h3>
            <div className="mobile-menu-info">
              <p className="mobile-menu-info-item text-xs pl-4">
                <strong>{t("info.festivalDates")}:</strong>
                <br />
                2025/11/08 - 2025/11/09
              </p>
              <p className="mobile-menu-info-item text-xs pl-4">
                <strong>{t("info.location")}:</strong>
                <br />
                {t("info.schoolName")}
              </p>
              <p className="mobile-menu-info-item text-xs pl-4">
                <strong>{t("info.organizer")}:</strong>
                <br />
                宇部高専祭実行委員会
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Menu;
