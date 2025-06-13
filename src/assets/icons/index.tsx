import React from "react";

export interface IconProps {
  size?: number | string;
  color?: string;
  fill?: string;
  className?: string;
}

/**
 * Base Icon component with common props and enhanced accessibility
 */
export const Icon: React.FC<React.SVGProps<SVGSVGElement> & IconProps> = ({
  size = 24,
  color = "currentColor",
  fill = "none",
  className = "",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel ? "img" : "presentation"}
      {...props}
    />
  );
};

// Re-export all icon components for easy access
export { AlertIcon } from "../../components/icons/AlertIcon";
export { BookmarkIcon } from "../../components/icons/BookmarkIcon";
export { EventIcon } from "../../components/icons/EventIcon";
export { ExhibitIcon } from "../../components/icons/ExhibitIcon";
export { HomeIcon } from "../../components/icons/HomeIcon";
export { LocationIcon } from "../../components/icons/LocationIcon";
export { MapIcon } from "../../components/icons/MapIcon";
export { MenuIcon } from "../../components/icons/MenuIcon";
export { MoonIcon } from "../../components/icons/MoonIcon";
export { PeopleIcon } from "../../components/icons/PeopleIcon";
export { ScheduleIcon } from "../../components/icons/ScheduleIcon";
export { SearchIcon } from "../../components/icons/SearchIcon";
export { SponsorIcon } from "../../components/icons/SponsorIcon";
export { SunIcon } from "../../components/icons/SunIcon";
export { TimeIcon } from "../../components/icons/TimeIcon";
export { XIcon } from "../../components/icons/XIcon";