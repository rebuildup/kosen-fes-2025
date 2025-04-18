import React from "react";
import { useTheme } from "../../../components/features/theme/ThemeContext";

interface NotFoundIllustrationProps {
  className?: string;
}

const NotFoundIllustration: React.FC<NotFoundIllustrationProps> = ({
  className = "",
}) => {
  const { theme } = useTheme();

  return (
    <svg
      className={`not-found-illustration max-w-full h-auto ${className}`}
      width="240"
      height="180"
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect
        x="40"
        y="40"
        width="160"
        height="100"
        rx="8"
        fill={theme === "light" ? "#F3F4F6" : "#374151"}
        stroke={theme === "light" ? "#E5E7EB" : "#4B5563"}
        strokeWidth="2"
      />

      {/* Compass */}
      <circle
        cx="120"
        cy="90"
        r="40"
        fill={theme === "light" ? "#FFFFFF" : "#1F2937"}
        stroke={theme === "light" ? "#D1D5DB" : "#4B5563"}
        strokeWidth="2"
      />

      {/* Compass needle */}
      <path
        d="M120 60V90"
        stroke={theme === "light" ? "#EF4444" : "#F87171"}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M120 90L140 110"
        stroke={theme === "light" ? "#3B82F6" : "#60A5FA"}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Compass cardinal points */}
      <text
        x="120"
        y="55"
        textAnchor="middle"
        fill={theme === "light" ? "#6B7280" : "#9CA3AF"}
        fontSize="12"
        fontWeight="bold"
      >
        N
      </text>

      <text
        x="153"
        y="93"
        textAnchor="middle"
        fill={theme === "light" ? "#6B7280" : "#9CA3AF"}
        fontSize="12"
        fontWeight="bold"
      >
        E
      </text>

      <text
        x="120"
        y="130"
        textAnchor="middle"
        fill={theme === "light" ? "#6B7280" : "#9CA3AF"}
        fontSize="12"
        fontWeight="bold"
      >
        S
      </text>

      <text
        x="85"
        y="93"
        textAnchor="middle"
        fill={theme === "light" ? "#6B7280" : "#9CA3AF"}
        fontSize="12"
        fontWeight="bold"
      >
        W
      </text>

      {/* 404 Text */}
      <text
        x="120"
        y="93"
        textAnchor="middle"
        fill={theme === "light" ? "#1F2937" : "#F9FAFB"}
        fontSize="14"
        fontWeight="bold"
      >
        404
      </text>

      {/* Dotted path */}
      <path
        d="M50 150C70 140 100 160 120 140C140 120 160 140 190 130"
        stroke={theme === "light" ? "#9CA3AF" : "#6B7280"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 4"
      />

      {/* Start point */}
      <circle
        cx="50"
        cy="150"
        r="5"
        fill={theme === "light" ? "#10B981" : "#34D399"}
      />

      {/* End point with question mark */}
      <circle
        cx="190"
        cy="130"
        r="8"
        fill={theme === "light" ? "#EF4444" : "#F87171"}
      />

      <text
        x="190"
        y="134"
        textAnchor="middle"
        fill={theme === "light" ? "#FFFFFF" : "#F9FAFB"}
        fontSize="12"
        fontWeight="bold"
      >
        ?
      </text>
    </svg>
  );
};

export default NotFoundIllustration;
