import { Component, ErrorInfo, ReactNode } from "react";
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
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    const { hasError, error } = this.state;
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
export default withLanguage(ErrorBoundary);
