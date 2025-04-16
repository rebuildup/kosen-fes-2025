// src/components/layout/Header/Header.tsx
import React, { useState } from "react";
import Logo from "../Logo";
import { ThemeToggle } from "../../common/ThemeToggle";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Logo size={isMobile ? "small" : "medium"} />

        <div className={styles.headerActions}>
          <button className={styles.searchButton} aria-label="検索">
            <svg viewBox="0 0 24 24" className={styles.icon}>
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.5 6.5 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>

          <ThemeToggle />

          {isMobile && (
            <button
              className={`${styles.menuButton} ${
                isMenuOpen ? styles.active : ""
              }`}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
            >
              <span className={styles.menuBar}></span>
              <span className={styles.menuBar}></span>
              <span className={styles.menuBar}></span>
            </button>
          )}
        </div>
      </div>

      {isMobile && isMenuOpen && (
        <div className={styles.mobileMenu}>
          {/* Mobile menu content - will be detailed in the Navigation section */}
        </div>
      )}
    </header>
  );
};

export default Header;
