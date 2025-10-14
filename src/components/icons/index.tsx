import React from "react";
import {
  AlertTriangle,
  Bookmark,
  Calendar,
  Image,
  Home,
  MapPin,
  Map,
  Menu,
  Moon,
  Users,
  Search,
  Speaker,
  Ribbon,
  Sun,
  Clock,
  X,
  Settings,
  Info,
  Trash2,
} from "lucide-react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps & { children?: React.ReactNode }> = ({
  size = 24,
  color = "currentColor",
  className = "",
  children,
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
export { AlertTriangle as AlertIcon };
export { Bookmark as BookmarkIcon };
export { Speaker as EventIcon };
export { Image as ExhibitIcon };
export { Home as HomeIcon };
export { MapPin as LocationIcon };
export { Map as MapIcon };
export { Menu as MenuIcon };
export { Moon as MoonIcon };
export { Users as PeopleIcon };
export { Calendar as ScheduleIcon };
export { Search as SearchIcon };
export { Ribbon as SponsorIcon };
export { Sun as SunIcon };
export { Clock as TimeIcon };
export { X as XIcon };
export { Settings as SettingsIcon };
export { Info as InfoIcon };
export { Trash2 as TrashIcon };

export { JPIcon, ENIcon } from "./LanguageIcon";
