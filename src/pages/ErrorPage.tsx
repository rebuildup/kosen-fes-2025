import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import ErrorIllustration from "../components/pages/error/ErrorIllustration";

interface ErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetErrorBoundary }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorInfo, setErrorInfo] = useState<{
    message: string;
    stack?: string;
  } | null>(null);

  // Get error information from state or props
  useEffect(() => {
    const stateError = location.state?.error;

    if (stateError) {
      setErrorInfo(stateError);
    } else if (error) {
      setErrorInfo({
        message: error.message,
        stack: error.stack,
      });
    } else {
      setErrorInfo({
        message: t("errors.somethingWentWrong"),
      });
    }
  }, [error, location.state, t]);

  // Handle retry
  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="error-page min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <ErrorIllustration />
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          {t("errors.errorTitle")}
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {errorInfo?.message || t("errors.somethingWentWrong")}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors duration-200 w-full sm:w-auto"
          >
            {t("errors.tryAgain")}
          </button>

          <Link
            to="/"
            className="px-6 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 w-full sm:w-auto"
          >
            {t("errors.returnHome")}
          </Link>
        </div>

        {/* Error Details (only shown in development) */}
        {process.env.NODE_ENV === "development" && errorInfo?.stack && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left overflow-auto">
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {t("errors.errorDetails")}
            </h3>
            <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
              {errorInfo.stack}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
