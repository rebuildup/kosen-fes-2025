import React from "react";

export interface IconProps {
  size?: number;
  color?: string;
  fill?: string;
  className?: string;
}

// Base Icon component with common props
export const Icon: React.FC<React.SVGProps<SVGSVGElement> & IconProps> = ({
  size = 24,
  color = "currentColor",
  fill = "none",
  className = "",
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      {...props}
    />
  );
};
