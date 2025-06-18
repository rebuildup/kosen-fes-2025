import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`
        flex items-center justify-between w-full p-3 text-sm rounded-lg 
        transition-all duration-200 group relative
        ${
          isActive
            ? "bg-[var(--instagram-gradient-subtle)] text-[var(--primary-color)] shadow-sm"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-color)]"
        }
      `}
      onClick={onClick}
      title={compact ? label : undefined}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span
            className={`
              flex-shrink-0 transition-all duration-200
              ${
                isActive
                  ? "text-[var(--primary-color)] scale-110"
                  : "group-hover:text-[var(--primary-color)] group-hover:scale-110"
              }
            `}
          >
            {icon}
          </span>
        )}
        <span className={`font-medium ${compact ? "lg:hidden xl:block" : ""}`}>
          {label}
        </span>
      </div>

      {badge !== undefined && (
        <span
          className={`
            inline-flex items-center justify-center px-2 py-1 text-xs font-bold 
            leading-none text-white rounded-full shadow-sm
            ${compact ? "lg:hidden xl:flex" : ""}
          `}
          style={{
            background: isActive
              ? "var(--instagram-gradient)"
              : "var(--primary-color)",
          }}
        >
          {badge}
        </span>
      )}

      {/* Active indicator line */}
      {isActive && (
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-full"
          style={{ background: "var(--instagram-gradient)" }}
        />
      )}
    </Link>
  );
};

export default SidebarLink;
