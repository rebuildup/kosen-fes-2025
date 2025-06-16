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
    <div className="min-h-screen">
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="mb-8">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mx-auto mb-6"
                style={{ color: "var(--color-accent)" }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1 className="section-title">{errorDetails.title}</h1>
            <p className="section-subtitle">{errorDetails.message}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/" className="btn btn-primary">
                {t("errors.backToHome")}
              </Link>

              <button onClick={handleReload} className="btn btn-secondary">
                {t("errors.tryAgain")}
              </button>
            </div>

            {import.meta.env.DEV && isErrorWithStack(error) && (
              <div
                className="mt-12 p-6 rounded-lg text-left"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Debug Information
                </h3>
                <pre
                  className="text-sm overflow-auto max-h-64 p-4 rounded"
                  style={{
                    backgroundColor: "var(--color-bg-tertiary)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Error;
