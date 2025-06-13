import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface SidebarLinkProps {
  to: string;
  icon?: ReactNode; // Changed from string to ReactNode to accept SVG components
  label: string;
  badge?: number | string;
  onClick?: () => void;
}

const SidebarLink = ({ to, icon, label, badge, onClick }: SidebarLinkProps) => {
  return (
    <Link 
      to={to} 
      className="flex items-center p-2 mb-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors duration-200 no-underline" 
      onClick={onClick}
    >
      {icon && <span className="mr-2 flex items-center justify-center text-lg">{icon}</span>}
      <span className="flex-1 text-sm">{label}</span>
      {badge !== undefined && (
        <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full min-w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
};

export default SidebarLink;
