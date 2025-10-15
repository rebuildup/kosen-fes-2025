import { useEffect, useState } from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";

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

function handleReload() {
  globalThis.location.reload();
}

const ErrorPage = () => {
  const error = useRouteError();
  const { t } = useLanguage();
  const [errorDetails, setErrorDetails] = useState<{
    title: string;
    message: string;
    status?: number;
  }>({
    message: t("errors.genericErrorMessage"),
    title: t("errors.genericError"),
  });

  useEffect(() => {
    // Extract error information
    if (isRouteErrorResponse(error)) {
      // Handle route errors from React Router
      switch (error.status) {
        case 404: {
          setErrorDetails({
            message: t("errors.pageNotFoundMessage"),
            status: error.status,
            title: `${error.status} - ${t("errors.pageNotFound")}`,
          });
          break;
        }
        case 500: {
          setErrorDetails({
            message: t("errors.serverErrorMessage"),
            status: error.status,
            title: `${error.status} - ${t("errors.serverError")}`,
          });
          break;
        }
        default: {
          setErrorDetails({
            message: error.statusText || t("errors.genericErrorMessage"),
            status: error.status,
            title: `${error.status} - ${t("errors.genericError")}`,
          });
        }
      }
    } else if (isErrorWithMessage(error)) {
      // Handle JavaScript errors with message property
      setErrorDetails({
        message: error.message || t("errors.genericErrorMessage"),
        title: t("errors.applicationError"),
      });
    }
  }, [error, t]);

  // Function to reload the page

  return (
    <div className="min-h-screen">
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
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

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/" className="btn btn-primary">
                {t("errors.backToHome")}
              </Link>

              <button onClick={handleReload} className="btn btn-secondary">
                {t("errors.tryAgain")}
              </button>
            </div>

            {import.meta.env.DEV && isErrorWithStack(error) && (
              <div
                className="mt-12 rounded-lg p-6 text-left"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <h3
                  className="mb-4 text-lg font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Debug Information
                </h3>
                <pre
                  className="max-h-64 overflow-auto rounded p-4 text-sm"
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

export default ErrorPage;
