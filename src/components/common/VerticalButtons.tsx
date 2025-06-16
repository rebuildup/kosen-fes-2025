interface VerticalButtonOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

interface VerticalButtonsProps {
  options: VerticalButtonOption[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
}

const VerticalButtons = ({
  options,
  activeValue,
  onChange,
  className = "",
}: VerticalButtonsProps) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            group relative px-3 py-2 rounded-lg font-medium 
            transition-all duration-200 flex items-center justify-center gap-2
            overflow-hidden
            ${
              activeValue === option.value
                ? "text-white shadow-md"
                : "hover:shadow-sm"
            }
          `}
          style={{
            backgroundColor:
              activeValue === option.value
                ? "var(--color-accent)"
                : "var(--color-bg-secondary)",
            color:
              activeValue === option.value
                ? "white"
                : "var(--color-text-primary)",
            border: `1px solid ${
              activeValue === option.value
                ? "var(--color-accent)"
                : "var(--color-border-primary)"
            }`,
          }}
          aria-label={option.ariaLabel || option.label}
          title={option.ariaLabel || option.label}
        >
          {/* Animated underline for non-active buttons */}
          {activeValue !== option.value && (
            <div
              className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 ease-out"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
          )}

          {/* Button content */}
          {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
          {option.label && <span className="text-sm">{option.label}</span>}
        </button>
      ))}
    </div>
  );
};

export default VerticalButtons;
