import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useEffect } from "react";

const NotFound = () => {
  const { t } = useLanguage();

  // Set page title
  useEffect(() => {
    document.title = `${t("errors.pageNotFound")} | ${t("siteName")}`;

    // Restore original title when component unmounts
    return () => {
      document.title = t("siteName");
    };
  }, [t]);

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-code">404</div>

        <div className="not-found-icon">
          <span role="img" aria-label="Not Found">
            🔍
          </span>
        </div>

        <h1 className="not-found-title">{t("errors.pageNotFound")}</h1>
        <p className="not-found-message">{t("errors.pageNotFoundMessage")}</p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-action-button primary">
            {t("errors.backToHome")}
          </Link>

          <Link to="/map" className="not-found-action-button secondary">
            {t("map.title")}
          </Link>

          <Link to="/search" className="not-found-action-button secondary">
            {t("search.title")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
