import React from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="app-layout min-h-screen bg-background-primary text-text-primary">
      {/* PC Header - Hidden on mobile */}
      <Header />

      <div className="layout-container flex min-h-screen">
        {/* PC Sidebar - Hidden on mobile */}
        {!isMobile && <Sidebar />}

        {/* Main Content */}
        <main
          className={`main-content flex-1 px-4 py-6 md:py-8 ${
            isMobile ? "" : "pt-16"
          }`}
        >
          {children}
        </main>
      </div>
      {isMobile && <MobileMenu />}

      {/* Mobile Footer - Only visible on mobile */}
      <Footer />
    </div>
  );
};

export default Layout;
