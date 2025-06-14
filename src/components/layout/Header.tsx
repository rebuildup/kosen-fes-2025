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

  return (
    <header>
      <div>
        <div>
          <Logo />
        </div>

        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                end
              >
                <div>
                  <span>
                    <HomeIcon size={18} />
                  </span>
                  <span>{t("navigation.home")}</span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/events"
              >
                <div>
                  <span>
                    <EventIcon size={18} />
                  </span>
                  <span>{t("navigation.events")}</span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/exhibits"
              >
                <div>
                  <span>
                    <ExhibitIcon size={18} />
                  </span>
                  <span>{t("navigation.exhibits")}</span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/schedule"
              >
                <div>
                  <span>
                    <ScheduleIcon size={18} />
                  </span>
                  <span>{t("navigation.schedule")}</span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/map"
              >
                <div>
                  <span>
                    <MapIcon size={18} />
                  </span>
                  <span>{t("navigation.map")}</span>
                </div>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
