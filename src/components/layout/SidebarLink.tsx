import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon?: ReactNode; // Changed from string to ReactNode to accept SVG components
  label: string;
  badge?: number | string;
  onClick?: () => void;
  compact?: boolean; // Add compact mode support
}

const SidebarLink = ({ badge, compact = false, icon, label, onClick, to }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`group relative flex w-full items-center justify-between rounded-lg p-3 text-sm transition-all duration-200 ${
        isActive
          ? "bg-[var(--instagram-gradient-subtle)] text-[var(--primary-color)] shadow-sm"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--primary-color)]"
      } `}
      onClick={onClick}
      title={compact ? label : undefined}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span
            className={`flex-shrink-0 transition-all duration-200 ${
              isActive
                ? "scale-110 text-[var(--primary-color)]"
                : "group-hover:scale-110 group-hover:text-[var(--primary-color)]"
            } `}
          >
            {icon}
          </span>
        )}
        <span className={`font-medium ${compact ? "lg:hidden xl:block" : ""}`}>{label}</span>
      </div>

      {badge !== undefined && (
        <span
          className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs leading-none font-bold text-white shadow-sm ${
            compact ? "lg:hidden xl:flex" : ""
          } `}
          style={{
            background: isActive ? "var(--instagram-gradient)" : "var(--primary-color)",
          }}
        >
          {badge}
        </span>
      )}

      {/* Active indicator line */}
      {isActive && (
        <div
          className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 transform rounded-r-full"
          style={{ background: "var(--instagram-gradient)" }}
        />
      )}
    </Link>
  );
};

export default SidebarLink;
