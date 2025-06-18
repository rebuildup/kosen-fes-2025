import { Link } from "react-router-dom";

interface PillButtonProps {
  to?: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  external?: boolean;
}

const PillButton = ({
  to,
  href,
  onClick,
  children,
  variant = "secondary",
  size = "md",
  className = "",
  disabled = false,
  external = false,
}: PillButtonProps) => {
  // Size classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Base button classes with hover effects
  const baseClasses = `
    inline-flex items-center gap-2 rounded-full font-semibold 
    transition-all duration-300 focus:outline-none focus:ring-2 
    focus:ring-offset-2 disabled:opacity-50 
    disabled:cursor-not-allowed transform hover:scale-105
    group shadow-md hover:shadow-lg ${sizeClasses[size]} ${className}
  `;

  // Variant styles with gradient effects
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return `
          text-white border-0 shadow-lg
          bg-gradient-to-r from-[var(--accent-purple)] via-[var(--accent-pink)] to-[var(--accent-orange)]
          hover:from-[var(--accent-pink)] hover:via-[var(--accent-red)] hover:to-[var(--accent-yellow)]
          focus:ring-[var(--primary-color)]
        `;
      case "secondary":
        return `
          bg-[var(--bg-secondary)] text-[var(--text-primary)] 
          border border-[var(--border-color)]
          hover:bg-[var(--primary-color)] hover:text-white hover:border-[var(--primary-color)]
          focus:ring-[var(--primary-color)]
        `;
      case "accent":
        return `
          bg-[var(--success-color)] text-white border-0
          hover:bg-[var(--accent-yellow)] hover:text-[var(--text-primary)]
          focus:ring-[var(--success-color)]
        `;
      default:
        return "";
    }
  };

  // Enhanced arrow icon with animation
  const ArrowIcon = () => (
    <span className="transition-transform duration-200 group-hover:translate-x-1">
      →
    </span>
  );

  // Button content with animated arrow
  const buttonContent = (
    <>
      <span className="relative">{children}</span>
      {(to || href) && <ArrowIcon />}
    </>
  );

  // Common props for all button types
  const commonProps = {
    className: `${baseClasses} ${getVariantClasses()}`,
    disabled,
  };

  // If it's a Link component
  if (to && !disabled) {
    return (
      <Link to={to} {...commonProps}>
        {buttonContent}
      </Link>
    );
  }

  // If it's an external link
  if (href && !disabled) {
    return (
      <a
        href={href}
        {...commonProps}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {buttonContent}
      </a>
    );
  }

  // Regular button
  return (
    <button onClick={onClick} {...commonProps}>
      {buttonContent}
    </button>
  );
};

export default PillButton;
