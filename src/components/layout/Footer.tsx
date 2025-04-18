import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface FooterProps {
  setMenuOpen: (open: boolean) => void;
}

const Footer = ({ setMenuOpen }: FooterProps) => {
  const { t } = useLanguage();

  return (
    <footer className="mobile-footer">
      <nav>
        <ul>
          <li>
            <Link to="/">{t("navigation.home")}</Link>
          </li>
          <li>
            <Link to="/events">{t("navigation.events")}</Link>
          </li>
          <li>
            <Link to="/exhibits">{t("navigation.exhibits")}</Link>
          </li>
          <li>
            <Link to="/schedule">{t("navigation.schedule")}</Link>
          </li>
          <li>
            <Link to="/map">{t("navigation.map")}</Link>
          </li>
          <li>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label={t("actions.open")}
            >
              ☰
            </button>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
