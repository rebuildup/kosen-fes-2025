import React from "react";
import { useTheme } from "../../components/features/theme/ThemeContext";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  const { theme } = useTheme();

  return (
    <svg
      className={`logo ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simple logo design with theme support */}
      <rect
        x="4"
        y="4"
        width="32"
        height="32"
        rx="8"
        fill={theme === "light" ? "#3B82F6" : "#60A5FA"}
      />
      <path
        d="M12 20H28M20 12V28"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="20" r="4" fill="white" />
    </svg>
  );
};

export default Logo;
