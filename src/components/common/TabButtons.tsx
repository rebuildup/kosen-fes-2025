import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

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

const TabButtons = ({ activeValue, className = "", onChange, options }: TabButtonsProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState({
    transform: "translateX(0px)",
    width: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Update indicator position when active value changes
  useEffect(() => {
    const activeIndex = options.findIndex((option) => option.value === activeValue);
    const activeButton = buttonsRef.current[activeIndex];

    if (activeButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const offsetLeft = buttonRect.left - containerRect.left;

      setIndicatorStyle({
        transform: `translateX(${offsetLeft}px)`,
        width: buttonRect.width,
      });
    }
  }, [activeValue, options]);

  return (
    <div
      ref={containerRef}
      className={`relative flex gap-0 overflow-hidden rounded-lg ${className}`}
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      {/* Sliding indicator */}
      <div
        className="absolute bottom-0 h-0.5 transition-all duration-300 ease-out"
        style={{
          backgroundColor: "var(--color-accent)",
          transform: indicatorStyle.transform,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {/* Tab buttons */}
      {options.map((option, index) => (
        <button
          type="button"
          key={option.value}
          ref={(el) => {
            if (el) buttonsRef.current[index] = el;
          }}
          onClick={() => onChange(option.value)}
          className={`group relative overflow-hidden px-4 py-3 text-sm font-medium transition-all duration-200 ${
            index === 0 ? "rounded-l-lg" : ""
          } ${index === options.length - 1 ? "rounded-r-lg" : ""} ${
            activeValue === option.value ? "text-white" : "hover:bg-white/5"
          } `}
          style={{
            backgroundColor: activeValue === option.value ? "var(--color-accent)" : "transparent",
            color: activeValue === option.value ? "white" : "var(--color-text-primary)",
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default TabButtons;
