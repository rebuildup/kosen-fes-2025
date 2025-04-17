// src/components/layout/Layout/Layout.tsx
import React from "react";
import Header from "../Header/Header";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
