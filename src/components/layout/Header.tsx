import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../common/Logo";

const Header = () => {
  const { t } = useLanguage();
  const {} = useTheme();

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

  return (
    <header className={`pc-header ${scrolled ? "header-scrolled" : ""}`}>
      <div className="header-container">
        <div className="header-logo">
          <Logo />
        </div>

        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
                end
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-text">{t("navigation.home")}</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                <span className="nav-icon">🎭</span>
                <span className="nav-text">{t("navigation.events")}</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/exhibits"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                <span className="nav-icon">🖼️</span>
                <span className="nav-text">{t("navigation.exhibits")}</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/schedule"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                <span className="nav-icon">📅</span>
                <span className="nav-text">{t("navigation.schedule")}</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                <span className="nav-icon">🗺️</span>
                <span className="nav-text">{t("navigation.map")}</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
