// src/components/layout/Logo/Logo.tsx
import React from "react";
import styles from "./Logo.module.css";

export interface LogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "medium" }) => {
  return (
    <div className={`${styles.logo} ${styles[size]} ${className}`}>
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
  );
};

export default Logo;
