// src/components/layout/Layout/Layout.tsx
import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import BottomNavigation from "../BottomNavigation";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className={styles.layoutContainer}>
      <Header />

      <div className={styles.mainSection}>
        {!isMobile && <Sidebar />}

        <main className={styles.mainContent}>{children}</main>
      </div>

      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default Layout;
