import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { RefObject } from "react";

interface FooterProps {
  setMenuOpen: (open: boolean) => void;
  menuButtonRef?: RefObject<HTMLButtonElement | null>;
}

const Footer = ({ setMenuOpen, menuButtonRef }: FooterProps) => {
  const { t } = useLanguage();

  return (
    <footer className="mobile-footer">
      <nav className="footer-nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `footer-nav-item ${isActive ? "footer-nav-active" : ""}`
          }
          end
        >
          <div className="footer-nav-icon">🏠</div>
          <div className="footer-nav-label">{t("navigation.home")}</div>
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) =>
            `footer-nav-item ${isActive ? "footer-nav-active" : ""}`
          }
        >
          <div className="footer-nav-icon">🎭</div>
          <div className="footer-nav-label">{t("navigation.events")}</div>
        </NavLink>

        <NavLink
          to="/exhibits"
          className={({ isActive }) =>
            `footer-nav-item ${isActive ? "footer-nav-active" : ""}`
          }
        >
          <div className="footer-nav-icon">🖼️</div>
          <div className="footer-nav-label">{t("navigation.exhibits")}</div>
        </NavLink>

        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            `footer-nav-item ${isActive ? "footer-nav-active" : ""}`
          }
        >
          <div className="footer-nav-icon">📅</div>
          <div className="footer-nav-label">{t("navigation.schedule")}</div>
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            `footer-nav-item ${isActive ? "footer-nav-active" : ""}`
          }
        >
          <div className="footer-nav-icon">🗺️</div>
          <div className="footer-nav-label">{t("navigation.map")}</div>
        </NavLink>

        <button
          className="footer-menu-button"
          onClick={() => setMenuOpen(true)}
          aria-label={t("navigation.menu")}
          ref={menuButtonRef}
        >
          <div className="footer-nav-icon">☰</div>
          <div className="footer-nav-label">{t("navigation.menu")}</div>
        </button>
      </nav>
    </footer>
  );
};

export default Footer;
