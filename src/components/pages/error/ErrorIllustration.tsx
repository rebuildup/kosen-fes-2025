import React from "react";
import { useTheme } from "../../../components/features/theme/ThemeContext";

interface ErrorIllustrationProps {
  className?: string;
}

const ErrorIllustration: React.FC<ErrorIllustrationProps> = ({
  className = "",
}) => {
  const { theme } = useTheme();

  return (
    <svg
      className={`error-illustration max-w-full h-auto ${className}`}
      width="240"
      height="180"
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="40"
        y="50"
        width="160"
        height="100"
        rx="8"
        fill={theme === "light" ? "#F3F4F6" : "#374151"}
        stroke={theme === "light" ? "#E5E7EB" : "#4B5563"}
        strokeWidth="2"
      />

      <path
        d="M120 20V50"
        stroke={theme === "light" ? "#9CA3AF" : "#6B7280"}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle
        cx="120"
        cy="100"
        r="30"
        fill={theme === "light" ? "#FFFFFF" : "#1F2937"}
        stroke={theme === "light" ? "#E5E7EB" : "#4B5563"}
        strokeWidth="2"
      />

      <path
        d="M108 88L132 112M132 88L108 112"
        stroke={theme === "light" ? "#EF4444" : "#F87171"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M70 130H170"
        stroke={theme === "light" ? "#E5E7EB" : "#4B5563"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />

      <circle
        cx="175"
        cy="70"
        r="5"
        fill={theme === "light" ? "#3B82F6" : "#60A5FA"}
      />

      <circle
        cx="65"
        cy="70"
        r="5"
        fill={theme === "light" ? "#3B82F6" : "#60A5FA"}
      />
    </svg>
  );
};

export default ErrorIllustration;
