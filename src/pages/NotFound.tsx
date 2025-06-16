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
    <div className="min-h-screen">
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div
              className="text-6xl font-bold mb-8"
              style={{ color: "var(--color-accent)" }}
            >
              404
            </div>

            <div className="mb-8">
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mx-auto"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 9L15 15M15 9L9 15" />
              </svg>
            </div>

            <h1 className="section-title">{t("errors.pageNotFound")}</h1>
            <p className="section-subtitle">
              {t("errors.pageNotFoundMessage")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
