import React from "react";
import { useLanguage } from "./LanguageContext";

// Higher Order Component that injects language functions into components
export function withLanguage<P extends object>(
  Component: React.ComponentType<P & { t: (key: string) => string }>
): React.FC<P> {
  return (props: P) => {
    const { t } = useLanguage();
    return <Component {...props} t={t} />;
  };
}
