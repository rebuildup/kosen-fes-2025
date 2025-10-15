import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../common/Logo";
import {
  EventIcon,
  ExhibitIcon,
  HomeIcon,
  MapIcon,
  ScheduleIcon,
} from "../icons";

const Header = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll behavior for header styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Navigation items configuration
  const navigationItems = [
    { end: true, icon: HomeIcon, label: t("navigation.home"), to: "/" },
    { icon: EventIcon, label: t("navigation.events"), to: "/events" },
    { icon: ExhibitIcon, label: t("navigation.exhibits"), to: "/exhibits" },
    { icon: ScheduleIcon, label: t("navigation.schedule"), to: "/schedule" },
    { icon: MapIcon, label: t("navigation.map"), to: "/map" },
  ];

  return (
    <header
      className={`header fixed top-0 right-0 left-0 z-50 border-b border-[var(--border-color)] transition-all duration-700 ease-out ${
        scrolled ? "glass-bold" : "glass-subtle"
      }`}
      style={{
        backdropFilter: scrolled
          ? "blur(18px) saturate(170%)"
          : "blur(6px) saturate(130%)",
        // フォールバック背景色とインラインガラス効果
        backgroundColor:
          theme === "dark"
            ? scrolled
              ? "rgba(0, 0, 0, 0.25)"
              : "rgba(0, 0, 0, 0.08)"
            : scrolled
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(255, 255, 255, 0.04)",
        borderBottom: `1px solid ${
          theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
        }`,
        WebkitBackdropFilter: scrolled
          ? "blur(18px) saturate(170%)"
          : "blur(6px) saturate(130%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 md:flex">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2 overflow-hidden rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-[var(--primary-color)]"
                        : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary-color)]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <IconComponent
                        size={18}
                        className="transition-transform duration-200 group-hover:scale-110"
                      />
                      <span>{item.label}</span>

                      {/* Animated underline */}
                      <div
                        className={`absolute right-2 bottom-0 left-2 h-0.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? "scale-x-100 opacity-100"
                            : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                        } `}
                        style={{
                          background: "var(--instagram-gradient)",
                        }}
                      />

                      {/* Subtle background gradient for active state */}
                      {isActive && (
                        <div
                          className="absolute inset-0 -z-10 rounded-lg opacity-10"
                          style={{ background: "var(--instagram-gradient)" }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-secondary)] hover:text-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none focus:ring-inset"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">メニューを開く</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden" id="mobile-menu">
          <div className="glass-effect space-y-1 border-t border-[var(--border-color)] px-2 pt-2 pb-3 sm:px-3">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--instagram-gradient-subtle)] text-[var(--primary-color)] shadow-sm"
                        : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary-color)]"
                    }`
                  }
                >
                  <IconComponent
                    size={20}
                    className="transition-transform duration-100 group-hover:scale-105"
                  />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
