import React from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import FooterNav from "./FooterNav";

const Footer: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Only render on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <footer className="mobile-footer fixed bottom-0 left-0 right-0 h-16 bg-background-secondary border-t border-gray-200 dark:border-gray-800 shadow-md z-50">
      <div className="h-full px-2">
        <FooterNav />
      </div>
    </footer>
  );
};

export default Footer;
