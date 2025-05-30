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
    <Link to={to} className="sidebar-link-item" onClick={onClick}>
      {icon && <span className="sidebar-link-icon">{icon}</span>}
      <span className="sidebar-link-label">{label}</span>
      {badge !== undefined && (
        <span className="sidebar-link-badge">{badge}</span>
      )}
    </Link>
  );
};

export default SidebarLink;
