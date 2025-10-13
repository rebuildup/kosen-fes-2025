import { useState, useEffect, useRef, ReactNode } from "react";

export interface TabOption {
  value: string;
  label: string | ReactNode;
}

interface TabButtonsProps {
  options: TabOption[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
}

const TabButtons = ({
  options,
  activeValue,
  onChange,
  className = "",
}: TabButtonsProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    transform: "translateX(0px)",
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Update indicator position when active value changes
  useEffect(() => {
    const activeIndex = options.findIndex(
      (option) => option.value === activeValue
    );
    const activeButton = buttonsRef.current[activeIndex];

    if (activeButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const offsetLeft = buttonRect.left - containerRect.left;

      setIndicatorStyle({
        width: buttonRect.width,
        transform: `translateX(${offsetLeft}px)`,
      });
    }
  }, [activeValue, options]);

  return (
    <div
      ref={containerRef}
      className={`relative flex gap-0 rounded-lg overflow-hidden ${className}`}
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      {/* Sliding indicator */}
      <div
        className="absolute bottom-0 h-0.5 transition-all duration-300 ease-out"
        style={{
          backgroundColor: "var(--color-accent)",
          width: `${indicatorStyle.width}px`,
          transform: indicatorStyle.transform,
        }}
      />

      {/* Tab buttons */}
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={(el) => (buttonsRef.current[index] = el)}
          onClick={() => onChange(option.value)}
          className={`
            px-4 py-3 font-medium transition-all duration-200 
            relative overflow-hidden group text-sm
            ${index === 0 ? "rounded-l-lg" : ""} ${
            index === options.length - 1 ? "rounded-r-lg" : ""
          }
            ${activeValue === option.value ? "text-white" : "hover:bg-white/5"}
          `}
          style={{
            backgroundColor:
              activeValue === option.value
                ? "var(--color-accent)"
                : "transparent",
            color:
              activeValue === option.value
                ? "white"
                : "var(--color-text-primary)",
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default TabButtons;
