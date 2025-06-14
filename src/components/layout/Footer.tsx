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
    <footer>
      <nav>
        <NavLink
          to="/"
          end
        >
          <div>
            <HomeIcon size={20} />
          </div>
          <div>{t("navigation.home")}</div>
        </NavLink>

        <NavLink
          to="/events"
        >
          <div>
            <EventIcon size={20} />
          </div>
          <div>{t("navigation.events")}</div>
        </NavLink>

        <NavLink
          to="/exhibits"
        >
          <div>
            <ExhibitIcon size={20} />
          </div>
          <div>{t("navigation.exhibits")}</div>
        </NavLink>

        <NavLink
          to="/schedule"
        >
          <div>
            <ScheduleIcon size={20} />
          </div>
          <div>{t("navigation.schedule")}</div>
        </NavLink>

        <NavLink
          to="/map"
        >
          <div>
            <MapIcon size={20} />
          </div>
          <div>{t("navigation.map")}</div>
        </NavLink>

        <button
          onClick={() => setMenuOpen(true)}
          aria-label={t("navigation.menu")}
          ref={menuButtonRef}
        >
          <div>
            <MenuIcon size={20} />
          </div>
          <div>{t("navigation.menu")}</div>
        </button>
      </nav>
    </footer>
  );
};

export default Footer;
