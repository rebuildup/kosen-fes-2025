import React from "react";

export interface IconProps {
  size?: number;
  color?: string;
  fill?: string;
  className?: string;
}

// Base Icon component with common props
export const Icon: React.FC<React.SVGProps<SVGSVGElement> & IconProps> = ({
  size = 24,
  color = "currentColor",
  fill = "none",
  className,
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
      className={className}
      {...props}
    />
  );
};

export { AlertIcon } from "./AlertIcon";
export { BookmarkIcon } from "./BookmarkIcon";
export { EventIcon } from "./EventIcon";
export { ExhibitIcon } from "./ExhibitIcon";
export { HomeIcon } from "./HomeIcon";
export { LocationIcon } from "./LocationIcon";
export { MapIcon } from "./MapIcon";
export { MenuIcon } from "./MenuIcon";
export { MoonIcon } from "./MoonIcon";
export { PeopleIcon } from "./PeopleIcon";
export { ScheduleIcon } from "./ScheduleIcon";
export { SearchIcon } from "./SearchIcon";
export { SponsorIcon } from "./SponsorIcon";
export { SunIcon } from "./SunIcon";
export { TimeIcon } from "./TimeIcon";
export { XIcon } from "./XIcon";
export { SettingsIcon } from "./SettingsIcon";
export { InfoIcon } from "./InfoIcon";
export { JPIcon, ENIcon } from "./LanguageIcon";
export { TrashIcon } from "./TrashIcon";
