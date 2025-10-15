import { ArrowRight } from "lucide-react";
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
  children,
  className = "",
  disabled = false,
  external = false,
  href,
  onClick,
  size = "md",
  to,
  variant = "secondary",
}: PillButtonProps) => {
  // Size classes
  const sizeClasses = {
    lg: "px-6 py-3 text-base",
    md: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
  };

  // Base button classes with hover effects
  const baseClasses = `
    inline-flex items-center gap-3 rounded-full font-semibold 
    transition-all duration-300 focus:outline-none focus:ring-2 
    focus:ring-offset-2 disabled:opacity-50 
    disabled:cursor-not-allowed transform
    group glass-button glass-interactive
    ${sizeClasses[size]} ${className}
  `;

  // Variant styles with glass effects
  const getVariantClasses = () => {
    switch (variant) {
      case "primary": {
        return `
          text-white border-0 shadow-lg glass-bold
          bg-gradient-to-r from-[var(--accent-purple)] via-[var(--accent-pink)] to-[var(--accent-orange)]
          hover:from-[var(--accent-pink)] hover:via-[var(--accent-red)] hover:to-[var(--accent-yellow)]
          focus:ring-[var(--primary-color)]
        `;
      }
      case "secondary": {
        return `
          text-[var(--text-primary)] border border-[var(--border-color)]/30
          hover:text-[var(--primary-color)] hover:border-[var(--primary-color)]/50
          focus:ring-[var(--primary-color)]
        `;
      }
      case "accent": {
        return `
          text-[var(--success-color)] border border-[var(--success-color)]/40
          hover:bg-[var(--success-color)]/80 hover:text-white hover:border-[var(--success-color)]
          focus:ring-[var(--success-color)]
        `;
      }
      default: {
        return "";
      }
    }
  };

  // Enhanced arrow icon with animation
  const ArrowIcon = () => (
    <span className="ml-1/2 flex-shrink-0 transition-all duration-200 group-hover:translate-x-1/12">
      <ArrowRight size={16} />
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
