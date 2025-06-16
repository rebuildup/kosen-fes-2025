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

  // Base button classes with hover color transitions
  const baseClasses = `
    inline-flex items-center gap-2 rounded-full font-semibold 
    transition-all duration-200 focus:outline-none focus:ring-2 
    focus:ring-offset-2 disabled:opacity-50 
    disabled:cursor-not-allowed
    group ${sizeClasses[size]} ${className}
  `;

  // Variant styles with hover effects
  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "var(--color-accent)",
          color: "white",
          border: "1px solid var(--color-accent)",
        };
      case "secondary":
        return {
          backgroundColor: "var(--color-bg-secondary)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border-primary)",
        };
      case "accent":
        return {
          backgroundColor: "var(--color-fourth)",
          color: "white",
          border: "1px solid var(--color-fourth)",
        };
      default:
        return {};
    }
  };

  // Get hover styles for each variant
  const getHoverStyles = () => {
    switch (variant) {
      case "primary":
        return "hover:opacity-90";
      case "secondary":
        return "hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)]";
      case "accent":
        return "hover:opacity-90";
      default:
        return "";
    }
  };

  // Arrow icon without animation
  const ArrowIcon = () => <span>→</span>;

  // Button content with arrow if it contains navigation text
  const buttonContent = (
    <>
      {children}
      {(to || href) && <ArrowIcon />}
    </>
  );

  // If it's a Link component
  if (to && !disabled) {
    return (
      <Link
        to={to}
        className={`${baseClasses} ${getHoverStyles()}`}
        style={getVariantStyle()}
      >
        {buttonContent}
      </Link>
    );
  }

  // If it's an external link
  if (href && !disabled) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${getHoverStyles()}`}
        style={getVariantStyle()}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {buttonContent}
      </a>
    );
  }

  // Regular button
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${getHoverStyles()}`}
      style={getVariantStyle()}
      disabled={disabled}
    >
      {buttonContent}
    </button>
  );
};

export default PillButton;
