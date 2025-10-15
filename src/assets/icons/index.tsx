import React from "react";

export interface IconProps {
  size?: number | string;
  color?: string;
  fill?: string;
  className?: string;
}

export const Icon: React.FC<React.SVGProps<SVGSVGElement> & IconProps> = ({
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  className = "",
  color = "currentColor",
  fill = "none",
  size = 24,
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

export {
  AlertIcon,
  BookmarkIcon,
  ENIcon,
  EventIcon,
  ExhibitIcon,
  HomeIcon,
  InfoIcon,
  JPIcon,
  LocationIcon,
  MapIcon,
  MenuIcon,
  MoonIcon,
  PeopleIcon,
  ScheduleIcon,
  SearchIcon,
  SettingsIcon,
  SponsorIcon,
  SunIcon,
  TimeIcon,
  TrashIcon,
  XIcon,
} from "../../components/icons";
