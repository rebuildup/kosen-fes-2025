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
    <div>
      <div>
        <div>404</div>

        <div>
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9 9L15 15M15 9L9 15" />
          </svg>
        </div>

        <h1>{t("errors.pageNotFound")}</h1>
        <p>{t("errors.pageNotFoundMessage")}</p>

        <div>
          <Link to="/">{t("navigation.home")}</Link>

          <Link to="/map">{t("navigation.map")}</Link>

          <Link to="/search">{t("navigation.search")}</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
