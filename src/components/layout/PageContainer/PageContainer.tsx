// src/components/layout/PageContainer/PageContainer.tsx
import React, { ReactNode } from "react";
import styles from "./PageContainer.module.css";

interface PageContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={`${styles.pageContainer} ${className}`}>
      <h1 className={styles.pageTitle}>{title}</h1>
      {children}
    </div>
  );
};

export default PageContainer;
