import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import HeaderNav from "./HeaderNav";
import Logo from "../common/Logo";

const Header: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Hide header on mobile as per requirements
  if (isMobile) {
    return null;
  }

  return (
    <header className="header fixed top-0 left-0 right-0 h-16 bg-background-secondary shadow-md z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Logo className="h-8 w-auto mr-2" />
            <span className="text-lg font-bold hidden sm:block whitespace-nowrap">
              {t("home.title")}
            </span>
          </Link>
        </div>

        {/* Main Navigation */}
        <HeaderNav />
      </div>
    </header>
  );
};

export default Header;
