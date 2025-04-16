// src/components/common/icons/Icon.tsx
import React from "react";

type IconName =
  | "home"
  | "calendar"
  | "map"
  | "clock"
  | "location"
  | "bookmark"
  | "search"
  | "user"
  | "heart"
  | "arrow-right";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = "currentColor",
  className = "",
}) => {
  // Path definitions for all icons
  const icons: Record<IconName, string> = {
    home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    calendar:
      "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z",
    // Add other icon paths
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      className={className}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={icons[name]} fill={color} />
    </svg>
  );
};

export default Icon;
