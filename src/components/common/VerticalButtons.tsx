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
  activeValue,
  className = "",
  onChange,
  options,
}: VerticalButtonsProps) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg px-3 py-2 font-medium transition-all duration-200 ${
            activeValue === option.value
              ? "text-white shadow-md"
              : "hover:shadow-sm"
          } `}
          style={{
            backgroundColor:
              activeValue === option.value
                ? "var(--color-accent)"
                : "var(--color-bg-secondary)",
            border: `1px solid ${
              activeValue === option.value
                ? "var(--color-accent)"
                : "var(--color-border-primary)"
            }`,
            color:
              activeValue === option.value
                ? "white"
                : "var(--color-text-primary)",
          }}
          aria-label={option.ariaLabel || option.label}
          title={option.ariaLabel || option.label}
        >
          {/* Animated underline for non-active buttons */}
          {activeValue !== option.value && (
            <div
              className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 ease-out group-hover:w-full"
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
