// src/components/common/Card/Card.tsx
import React, { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  elevated?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  hoverable = false,
  elevated = false,
}) => {
  return (
    <div
      className={`
        ${styles.card}
        ${hoverable ? styles.hoverable : ""}
        ${elevated ? styles.elevated : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
