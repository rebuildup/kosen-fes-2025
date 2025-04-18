import React from "react";
import { useLanguage } from "../../hooks/useLanguage";

interface MobileMenuButtonProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isOpen,
  toggleMenu,
}) => {
  const { t } = useLanguage();

  return (
    <button
      className="mobile-menu-button fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
      onClick={toggleMenu}
      aria-expanded={isOpen}
      aria-label={
        isOpen ? t("accessibility.closeMenu") : t("accessibility.openMenu")
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-800 dark:text-gray-200 transition-transform duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0)" }}
      >
        {isOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );
};

export default MobileMenuButton;
