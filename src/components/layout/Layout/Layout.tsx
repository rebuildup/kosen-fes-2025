// src/components/layout/Layout/Layout.tsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import SettingsPanel from "../SettingsPanel/SettingsPanel";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const location = useLocation();

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div
      className={styles.layoutContainer}
      data-theme={theme}
      data-language={language}
    >
      <Header onSettingsClick={togglePanel} />

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>{children}</div>
      </main>

      {/* Settings panel overlay */}
      <div
        className={`${styles.settingsOverlay} ${
          isPanelOpen ? styles.active : ""
        }`}
        onClick={() => setIsPanelOpen(false)}
      />

      {/* Settings panel */}
      <SettingsPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />

      {/* Social share floating button - appears except on home page */}
      {location.pathname !== "/" && (
        <button className={styles.shareButton} aria-label="Share">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Layout;
