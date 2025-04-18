import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState } from "react";

interface ErrorWithMessage {
  message: string;
  stack?: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function isErrorWithStack(error: unknown): error is Error {
  return (
    typeof error === "object" &&
    error !== null &&
    "stack" in error &&
    typeof (error as Record<string, unknown>).stack === "string"
  );
}

const Error = () => {
  const error = useRouteError();
  const { t } = useLanguage();
  const [errorDetails, setErrorDetails] = useState<{
    title: string;
    message: string;
    status?: number;
  }>({
    title: t("errors.genericError"),
    message: t("errors.genericErrorMessage"),
  });

  useEffect(() => {
    // Extract error information
    if (isRouteErrorResponse(error)) {
      // Handle route errors from React Router
      switch (error.status) {
        case 404:
          setErrorDetails({
            title: `${error.status} - ${t("errors.pageNotFound")}`,
            message: t("errors.pageNotFoundMessage"),
            status: error.status,
          });
          break;
        case 500:
          setErrorDetails({
            title: `${error.status} - ${t("errors.serverError")}`,
            message: t("errors.serverErrorMessage"),
            status: error.status,
          });
          break;
        default:
          setErrorDetails({
            title: `${error.status} - ${t("errors.genericError")}`,
            message: error.statusText || t("errors.genericErrorMessage"),
            status: error.status,
          });
      }
    } else if (isErrorWithMessage(error)) {
      // Handle JavaScript errors with message property
      setErrorDetails({
        title: t("errors.applicationError"),
        message: error.message || t("errors.genericErrorMessage"),
      });
    }
  }, [error, t]);

  // Function to reload the page
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          {errorDetails.status === 404 ? (
            <span role="img" aria-label="Not Found">
              🔍
            </span>
          ) : (
            <span role="img" aria-label="Error">
              ⚠️
            </span>
          )}
        </div>

        <h1 className="error-title">{errorDetails.title}</h1>
        <p className="error-message">{errorDetails.message}</p>

        <div className="error-actions">
          <Link to="/" className="error-action-button primary">
            {t("errors.backToHome")}
          </Link>

          <button
            onClick={handleReload}
            className="error-action-button secondary"
          >
            {t("errors.tryAgain")}
          </button>
        </div>

        {import.meta.env.DEV && isErrorWithStack(error) && (
          <div className="error-debug">
            <h3 className="error-debug-title">Debug Information</h3>
            <pre className="error-stack">{error.stack}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Error;
