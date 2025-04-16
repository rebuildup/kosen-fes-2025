// src/components/Logo.tsx
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main circular border */}
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="url(#gradient)"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Festival icon - stylized 'F' */}
      <path
        d="M15 10H25M15 10V30M15 10C12 10 10 12 10 15V25C10 28 12 30 15 30M15 18H22M15 18C12 18 10 20 10 23V25C10 28 12 30 15 30"
        stroke="url(#gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Decorative elements */}
      <circle cx="28" cy="14" r="3" fill="url(#gradient)" />
      <circle cx="28" cy="26" r="3" fill="url(#gradient)" />

      {/* Small decorative dots around the perimeter */}
      <circle cx="20" cy="6" r="1.5" fill="url(#gradient)" />
      <circle cx="20" cy="34" r="1.5" fill="url(#gradient)" />
      <circle cx="6" cy="20" r="1.5" fill="url(#gradient)" />
      <circle cx="34" cy="20" r="1.5" fill="url(#gradient)" />

      {/* Gradient definitions */}
      <defs>
        <linearGradient
          id="gradient"
          x1="10"
          y1="10"
          x2="30"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1da1f2" />
          <stop offset="1" stopColor="#8a2be2" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
