import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface SidebarLinkProps {
  to: string;
  icon?: ReactNode; // Changed from string to ReactNode to accept SVG components
  label: string;
  badge?: number | string;
  onClick?: () => void;
  compact?: boolean; // Add compact mode support
}

const SidebarLink = ({
  to,
  icon,
  label,
  badge,
  onClick,
  compact = false,
}: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className="flex items-center justify-between w-full p-3 text-sm rounded-lg transition-all duration-200 group hover:bg-opacity-80"
      style={{
        color: "var(--color-text-secondary)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-bg-secondary)";
        e.currentTarget.style.color = "var(--color-accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "var(--color-text-secondary)";
      }}
      onClick={onClick}
      title={compact ? label : undefined}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex-shrink-0 group-hover:text-[var(--color-accent)] transition-colors">
            {icon}
          </span>
        )}
        <span className={`font-medium ${compact ? "lg:hidden xl:block" : ""}`}>
          {label}
        </span>
      </div>
      {badge !== undefined && (
        <span
          className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full ${
            compact ? "lg:hidden xl:flex" : ""
          }`}
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};

export default SidebarLink;
