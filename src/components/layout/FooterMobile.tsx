import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface FooterMobileProps {
  setMenuOpen: (open: boolean) => void;
}

const FooterMobile = ({ setMenuOpen }: FooterMobileProps) => {
  const { t } = useLanguage();

  return (
    <footer className="mobile-footer">
      <nav className="mobile-footer-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `mobile-footer-item ${isActive ? "mobile-footer-item-active" : ""}`
          }
        >
          <div className="mobile-footer-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <div className="mobile-footer-label">{t("navigation.home")}</div>
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) =>
            `mobile-footer-item ${isActive ? "mobile-footer-item-active" : ""}`
          }
        >
          <div className="mobile-footer-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
            </svg>
          </div>
          <div className="mobile-footer-label">{t("navigation.events")}</div>
        </NavLink>

        <NavLink
          to="/exhibits"
          className={({ isActive }) =>
            `mobile-footer-item ${isActive ? "mobile-footer-item-active" : ""}`
          }
        >
          <div className="mobile-footer-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <div className="mobile-footer-label">{t("navigation.exhibits")}</div>
        </NavLink>

        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            `mobile-footer-item ${isActive ? "mobile-footer-item-active" : ""}`
          }
        >
          <div className="mobile-footer-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </div>
          <div className="mobile-footer-label">{t("navigation.schedule")}</div>
        </NavLink>

        <button
          onClick={() => setMenuOpen(true)}
          aria-label={t("navigation.menu")}
          className="mobile-footer-item"
        >
          <div className="mobile-footer-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </div>
          <div className="mobile-footer-label">{t("navigation.menu")}</div>
        </button>
      </nav>
    </footer>
  );
};

export default FooterMobile;
