import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import MobileMenuButton from "./MobileMenuButton";
import MobileMenuPanel from "./MobileMenuPanel";

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const location = useLocation();

  // Toggle menu state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close menu when resizing to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Only render on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Hamburger button */}
      <MobileMenuButton isOpen={isOpen} toggleMenu={toggleMenu} />

      {/* Menu panel */}
      <MobileMenuPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default MobileMenu;
