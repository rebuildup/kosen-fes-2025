import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { MutableRefObject } from "react";
import { HomeIcon } from "../icons/HomeIcon";
import { EventIcon } from "../icons/EventIcon";
import { ExhibitIcon } from "../icons/ExhibitIcon";
import { ScheduleIcon } from "../icons/ScheduleIcon";
import { MapIcon } from "../icons/MapIcon";
import { MenuIcon } from "../icons/MenuIcon";

interface FooterProps {
  setMenuOpen: (open: boolean) => void;
  menuButtonRef?: MutableRefObject<HTMLButtonElement | null>;
}

const Footer = ({ setMenuOpen, menuButtonRef }: FooterProps) => {
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
            <HomeIcon size={20} />
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
            <EventIcon size={20} />
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
            <ExhibitIcon size={20} />
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
            <ScheduleIcon size={20} />
          </div>
          <div className="mobile-footer-label">{t("navigation.schedule")}</div>
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            `mobile-footer-item ${isActive ? "mobile-footer-item-active" : ""}`
          }
        >
          <div className="mobile-footer-icon">
            <MapIcon size={20} />
          </div>
          <div className="mobile-footer-label">{t("navigation.map")}</div>
        </NavLink>

        <button
          onClick={() => setMenuOpen(true)}
          aria-label={t("navigation.menu")}
          ref={menuButtonRef}
          className="mobile-footer-item"
        >
          <div className="mobile-footer-icon">
            <MenuIcon size={20} />
          </div>
          <div className="mobile-footer-label">{t("navigation.menu")}</div>
        </button>
      </nav>
    </footer>
  );
};

export default Footer;
