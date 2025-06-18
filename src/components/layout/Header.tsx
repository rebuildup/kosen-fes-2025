import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Logo from "../common/Logo";
import { HomeIcon } from "../icons/HomeIcon";
import { EventIcon } from "../icons/EventIcon";
import { ExhibitIcon } from "../icons/ExhibitIcon";
import { ScheduleIcon } from "../icons/ScheduleIcon";
import { MapIcon } from "../icons/MapIcon";

const Header = () => {
  const { t } = useLanguage();
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
    { to: "/", icon: HomeIcon, label: t("navigation.home"), end: true },
    { to: "/events", icon: EventIcon, label: t("navigation.events") },
    { to: "/exhibits", icon: ExhibitIcon, label: t("navigation.exhibits") },
    { to: "/schedule", icon: ScheduleIcon, label: t("navigation.schedule") },
    { to: "/map", icon: MapIcon, label: t("navigation.map") },
  ];

  return (
    <header
      className={`header fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-color)] ${
        scrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                      isActive
                        ? "text-[var(--primary-color)]"
                        : "text-[var(--text-primary)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-secondary)]"
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
                        className={`
                          absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all duration-300
                          ${
                            isActive
                              ? "opacity-100 scale-x-100"
                              : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                          }
                        `}
                        style={{
                          background: "var(--instagram-gradient)",
                        }}
                      />

                      {/* Subtle background gradient for active state */}
                      {isActive && (
                        <div
                          className="absolute inset-0 -z-10 opacity-10 rounded-lg"
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
              className="inline-flex items-center justify-center p-2 rounded-lg text-[var(--text-primary)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-secondary)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)]"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 relative ${
                      isActive
                        ? "text-[var(--primary-color)] bg-[var(--instagram-gradient-subtle)] shadow-sm"
                        : "text-[var(--text-primary)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-secondary)]"
                    }`
                  }
                >
                  <IconComponent
                    size={20}
                    className="transition-transform duration-200 group-hover:scale-110"
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
