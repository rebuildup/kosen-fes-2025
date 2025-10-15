import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps & { children?: React.ReactNode }> = ({
  children,
  className = "",
  color = "currentColor",
  size = 24,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...rest}
  >
    {children}
  </svg>
);

// Re-export lucide icons with the project's previous names so existing imports keep working.

export { ENIcon, JPIcon } from "./LanguageIcon";
export {
  Speaker as EventIcon,
  Image as ExhibitIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  MapPin as LocationIcon,
  Map as MapIcon,
  Menu as MenuIcon,
  Moon as MoonIcon,
  Users as PeopleIcon,
  Calendar as ScheduleIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Ribbon as SponsorIcon,
  Sun as SunIcon,
  Clock as TimeIcon,
  Trash2 as TrashIcon,
  UtensilsCrossed as StallIcon,
  X as XIcon,
} from "lucide-react";
export { AlertTriangle as AlertIcon } from "lucide-react";
export { Bookmark as BookmarkIcon } from "lucide-react";
