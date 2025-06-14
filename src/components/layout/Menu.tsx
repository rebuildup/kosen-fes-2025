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
    <div>
      <div
        ref={backdropRef}
        onClick={() => closeWithAnimation()}
      ></div>

      <div ref={menuRef}>
        <div>
          <div>{t("navigation.menu")}</div>
          <button
            onClick={() => closeWithAnimation()}
            aria-label={t("actions.close")}
            ref={closeButtonRef}
          >
            <span>
              <XIcon size={18} />
            </span>
          </button>
        </div>

        <div ref={menuContentRef}>
          <div>
            <SearchBar variant="default" onSearch={handleMenuItemClick} />
          </div>

          <div>
            <h3>{t("navigation.main")}</h3>
            <nav>
              <NavLink
                to="/"
                onClick={handleMenuItemClick}
                end
              >
                <span>
                  <HomeIcon size={18} />
                </span>
                <span>{t("navigation.home")}</span>
              </NavLink>

              <NavLink
                to="/events"
                onClick={handleMenuItemClick}
              >
                <span>
                  <EventIcon size={18} />
                </span>
                <span>{t("navigation.events")}</span>
              </NavLink>

              <NavLink
                to="/exhibits"
                onClick={handleMenuItemClick}
              >
                <span>
                  <ExhibitIcon size={18} />
                </span>
                <span>
                  {t("navigation.exhibits")}
                </span>
              </NavLink>

              <NavLink
                to="/schedule"
                onClick={handleMenuItemClick}
              >
                <span>
                  <ScheduleIcon size={18} />
                </span>
                <span>
                  {t("navigation.schedule")}
                </span>
              </NavLink>

              <NavLink
                to="/map"
                onClick={handleMenuItemClick}
              >
                <span>
                  <MapIcon size={18} />
                </span>
                <span>{t("navigation.map")}</span>
              </NavLink>
            </nav>
          </div>

          <div>
            <h3 className="menu-section-title text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("navigation.quickLinks")}</h3>
            <div className="space-y-1">
              <Link
                to="/bookmarks"
                className="menu-link-item flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={handleMenuItemClick}
              >
                <div className="flex items-center">
                  <span>
                    <BookmarkIcon size={18} />
                  </span>
                  <span>{t("bookmarks.title")}</span>
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
                <span>
                  <SearchIcon size={18} />
                </span>
                <span>{t("search.title")}</span>
              </Link>
            </div>
          </div>

          <div>
            <h3>{t("settings.title")}</h3>
            <div>
              <div>
                <span>
                  {t("settings.theme.title")}
                </span>
                <ThemeToggle />
              </div>

              <div>
                <span>
                  {t("settings.language.title")}
                </span>
                <LanguageToggle />
              </div>
            </div>
          </div>

          <div>
            <h3>{t("info.title")}</h3>
            <div>
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
