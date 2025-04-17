// src/components/layout/Logo/Logo.tsx
import React from "react";
import styles from "./Logo.module.css";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "medium", className = "" }) => {
  return (
    <div className={`${styles.logo} ${styles[size]} ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.logoSvg}
      >
        {/* Main circular border */}
        <circle cx="20" cy="20" r="18" className={styles.logoCircle} />

        {/* Festival icon - stylized 'F' */}
        <path
          d="M15 10H25M15 10V30M15 10C12 10 10 12 10 15V25C10 28 12 30 15 30M15 18H22M15 18C12 18 10 20 10 23V25C10 28 12 30 15 30"
          className={styles.logoPath}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Decorative elements */}
        <circle cx="28" cy="14" r="3" className={styles.logoDecoration} />
        <circle cx="28" cy="26" r="3" className={styles.logoDecoration} />

        {/* Small decorative dots around the perimeter */}
        <circle cx="20" cy="6" r="1.5" className={styles.logoDot} />
        <circle cx="20" cy="34" r="1.5" className={styles.logoDot} />
        <circle cx="6" cy="20" r="1.5" className={styles.logoDot} />
        <circle cx="34" cy="20" r="1.5" className={styles.logoDot} />
      </svg>
    </div>
  );
};

export default Logo;
