import { useRef, useEffect, MutableRefObject } from "react";
import { NavLink, Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import ThemeToggle from "../common/ThemeToggle";
import LanguageToggle from "../common/LanguageToggle";
import SearchBar from "../common/SearchBar";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../utils/animations";
import { HomeIcon } from "../icons/HomeIcon";
import { EventIcon } from "../icons/EventIcon";
import { ExhibitIcon } from "../icons/ExhibitIcon";
import { ScheduleIcon } from "../icons/ScheduleIcon";
import { MapIcon } from "../icons/MapIcon";
import { BookmarkIcon } from "../icons/BookmarkIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { XIcon } from "../icons/XIcon"; // Let's create this for the close button

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
    if (menuRef.current && backdropRef.current) {
      const tl = gsap.timeline();

      // Initial state
      tl.set(menuRef.current, { x: "100%" });
      tl.set(backdropRef.current, { autoAlpha: 0 });

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

      // Animate menu items if content ref exists
      if (menuContentRef.current) {
        const menuItems = menuContentRef.current.querySelectorAll(
          ".menu-nav-item, .menu-link-item, .menu-section-title, .menu-setting-item"
        );

        tl.fromTo(
          menuItems,
          { y: 20, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.05,
            duration: DURATION.FAST,
            ease: EASE.SMOOTH,
          },
          "-=0.2"
        );
      }
    }
  }, []);

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
  }, [setMenuOpen]);

  // Handle menu close with animation
  const closeWithAnimation = () => {
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
  };

  // Handle menu item click to close the menu
  const handleMenuItemClick = () => {
    closeWithAnimation();
  };

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        ref={backdropRef}
        onClick={() => closeWithAnimation()}
      ></div>

      <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl overflow-y-auto" ref={menuRef}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{t("navigation.menu")}</div>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => closeWithAnimation()}
            aria-label={t("actions.close")}
            ref={closeButtonRef}
          >
            <span className="text-gray-500 dark:text-gray-400">
              <XIcon size={18} />
            </span>
          </button>
        </div>

        <div className="p-4 space-y-6" ref={menuContentRef}>
          <div className="space-y-3">
            <SearchBar variant="default" onSearch={handleMenuItemClick} />
          </div>

          <div className="space-y-4">
            <h3 className="menu-section-title text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("navigation.main")}</h3>
            <nav className="space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `menu-nav-item flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "menu-nav-active bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
                onClick={handleMenuItemClick}
                end
              >
                <span className="mr-3 text-gray-500 dark:text-gray-400">
                  <HomeIcon size={18} />
                </span>
                <span className="font-medium">{t("navigation.home")}</span>
              </NavLink>

              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `menu-nav-item flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "menu-nav-active bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
                onClick={handleMenuItemClick}
              >
                <span className="mr-3 text-gray-500 dark:text-gray-400">
                  <EventIcon size={18} />
                </span>
                <span className="font-medium">{t("navigation.events")}</span>
              </NavLink>

              <NavLink
                to="/exhibits"
                className={({ isActive }) =>
                  `menu-nav-item flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "menu-nav-active bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
                onClick={handleMenuItemClick}
              >
                <span className="mr-3 text-gray-500 dark:text-gray-400">
                  <ExhibitIcon size={18} />
                </span>
                <span className="font-medium">
                  {t("navigation.exhibits")}
                </span>
              </NavLink>

              <NavLink
                to="/schedule"
                className={({ isActive }) =>
                  `menu-nav-item flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "menu-nav-active bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
                onClick={handleMenuItemClick}
              >
                <span className="mr-3 text-gray-500 dark:text-gray-400">
                  <ScheduleIcon size={18} />
                </span>
                <span className="font-medium">
                  {t("navigation.schedule")}
                </span>
              </NavLink>

              <NavLink
                to="/map"
                className={({ isActive }) =>
                  `menu-nav-item flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "menu-nav-active bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
                onClick={handleMenuItemClick}
              >
                <span className="mr-3 text-gray-500 dark:text-gray-400">
                  <MapIcon size={18} />
                </span>
                <span className="font-medium">{t("navigation.map")}</span>
              </NavLink>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="menu-section-title text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("navigation.quickLinks")}</h3>
            <div className="space-y-1">
              <Link
                to="/bookmarks"
                className="menu-link-item flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={handleMenuItemClick}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-gray-500 dark:text-gray-400">
                    <BookmarkIcon size={18} />
                  </span>
                  <span className="font-medium">{t("bookmarks.title")}</span>
                </div>
                {bookmarks.length > 0 && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium px-2 py-1 rounded-full">
                    {bookmarks.length}
                  </span>
                )}
              </Link>

              <Link
                to="/search"
                className="menu-link-item flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={handleMenuItemClick}
              >
                <span className="mr-3 text-gray-500 dark:text-gray-400">
                  <SearchIcon size={18} />
                </span>
                <span className="font-medium">{t("search.title")}</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="menu-section-title text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("settings.title")}</h3>
            <div className="space-y-3">
              <div className="menu-setting-item flex items-center justify-between px-3 py-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {t("settings.theme.title")}
                </span>
                <ThemeToggle />
              </div>

              <div className="menu-setting-item flex items-center justify-between px-3 py-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {t("settings.language.title")}
                </span>
                <LanguageToggle />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="menu-section-title text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("info.title")}</h3>
            <div className="px-3 py-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>{t("info.festivalDates")}: 2025/06/15 - 2025/06/16</p>
              <p>{t("info.location")}: Ube Kosen, Yamaguchi</p>
              <p>{t("info.organizer")}: Festival Committee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
