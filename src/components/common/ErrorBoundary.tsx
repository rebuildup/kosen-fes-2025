import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { Link } from "react-router-dom";

import { withLanguage } from "../../context/LanguageContext";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  t: (key: string) => string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null,
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { error, hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ error: null, hasError: false });
  };

  public render() {
    const { error, hasError } = this.state;
    const { children, fallback, t } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h2>{t("errors.componentError")}</h2>
            <p>{t("errors.componentErrorMessage")}</p>
            {error && (
              <div className="error-details">
                <p className="error-message">{error.message}</p>
                {import.meta.env.DEV && error.stack && (
                  <pre className="error-stack">{error.stack}</pre>
                )}
              </div>
            )}
            <div className="error-actions">
              <button
                onClick={this.handleReset}
                className="error-action-button primary"
              >
                {t("errors.tryAgain")}
              </button>
              <Link to="/" className="error-action-button secondary">
                {t("errors.backToHome")}
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// HOC to wrap ErrorBoundary with language context
const ErrorBoundaryWithLanguage = withLanguage(ErrorBoundary);
ErrorBoundaryWithLanguage.displayName = "ErrorBoundaryWithLanguage";

export default ErrorBoundaryWithLanguage;
