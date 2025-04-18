import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import NotFoundIllustration from "../components/pages/notFound/NotFoundIllustration";

const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <div className="not-found-page min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <NotFoundIllustration />
        </div>

        {/* 404 Message */}
        <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-gray-200">
          404
        </h1>

        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          {t("errors.pageNotFound")}
        </h2>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {t("errors.pageNotFoundMessage", { path: location.pathname })}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/"
            className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors duration-200 w-full sm:w-auto"
          >
            {t("errors.returnHome")}
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 w-full sm:w-auto"
          >
            {t("errors.goBack")}
          </button>
        </div>

        {/* Suggested Links */}
        <div className="mt-12">
          <h3 className="text-sm font-medium mb-4 text-gray-600 dark:text-gray-400">
            {t("errors.youMayFind")}
          </h3>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/events"
              className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {t("header.events")}
            </Link>

            <Link
              to="/exhibitions"
              className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {t("header.exhibitions")}
            </Link>

            <Link
              to="/timetable"
              className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {t("header.timetable")}
            </Link>

            <Link
              to="/map"
              className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {t("header.map")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
