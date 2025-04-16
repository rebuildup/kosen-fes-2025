// src/components/layout/Logo/Logo.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

const Logo: React.FC<LogoProps> = ({ size = "medium" }) => {
  return (
    <Link to="/" className={`${styles.logo} ${styles[size]}`}>
      <div className={styles.logoIcon}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Festival icon / symbol */}
          <circle cx="20" cy="20" r="18" className={styles.logoCircle} />
          <path
            d="M14 10L14 30M14 10H26M14 20H24M14 30H26"
            className={styles.logoPath}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className={styles.logoText}>
        <span className={styles.primaryText}>宇部高専祭</span>
        <span className={styles.yearText}>2025</span>
      </div>
    </Link>
  );
};

export default Logo;
