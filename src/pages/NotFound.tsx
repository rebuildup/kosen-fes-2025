import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";

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
    <div className="min-h-screen">
      <section className="section" style={{ backgroundColor: "var(--color-bg-primary)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <div className="mb-8 text-6xl font-bold" style={{ color: "var(--color-accent)" }}>
              404
            </div>

            <h1 className="section-title">{t("errors.pageNotFound")}</h1>
            <p className="section-subtitle">{t("errors.pageNotFoundMessage")}</p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/" className="btn btn-primary">
                {t("navigation.home")}
              </Link>

              <Link to="/map" className="btn btn-secondary">
                {t("navigation.map")}
              </Link>

              <Link to="/search" className="btn btn-secondary">
                {t("navigation.search")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
