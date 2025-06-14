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
 
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
      {badge !== undefined && (
        <span>
          {badge}
        </span>
      )}
    </Link>
  );
};

export default SidebarLink;
