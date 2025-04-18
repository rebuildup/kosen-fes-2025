import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface HomeHeroProps {
  className?: string;
}

const HomeHero = ({ className = "" }: HomeHeroProps) => {
  const { t } = useLanguage();

  return (
    <section className={`home-hero ${className}`}>
      <div className="home-hero-content">
        <h1 className="home-hero-title">{t("siteName")}</h1>
        <p className="home-hero-subtitle">{t("home.subtitle")}</p>
        <div className="home-hero-dates">
          <span className="home-hero-dates-icon">📅</span>
          <span>2025/06/15 - 2025/06/16</span>
        </div>
        <Link to="/schedule" className="home-hero-cta">
          {t("schedule.title")}
          <span className="home-hero-cta-icon">→</span>
        </Link>
      </div>
      <div className="home-hero-decoration">
        <div className="festival-symbol">祭</div>
      </div>
    </section>
  );
};

export default HomeHero;
