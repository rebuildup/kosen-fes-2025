// src/components/features/FestivalBanner/FestivalBanner.tsx
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import styles from "./FestivalBanner.module.css";

const FestivalBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    const ctx = gsap.context(() => {
      // アニメーション設定
      gsap.from(".bannerTitle", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".bannerSubtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      });

      gsap.from(".bannerButton", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.6,
        ease: "power3.out",
      });

      gsap.from(".decoration", {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        delay: 0.4,
        ease: "elastic.out(1, 0.5)",
      });
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.bannerContainer} ref={bannerRef}>
      <div className={styles.bannerOverlay}></div>

      <div className={styles.bannerContent}>
        <h1 className={`${styles.bannerTitle} bannerTitle`}>宇部高専祭 2025</h1>
        <p className={`${styles.bannerSubtitle} bannerSubtitle`}>
          2025年5月15日・16日開催 - 文化と技術の祭典
        </p>
        <Link to="/events" className={`${styles.bannerButton} bannerButton`}>
          イベントを見る
        </Link>
      </div>

      <div className={styles.decorations}>
        <svg
          className={`${styles.decoration} ${styles.d1} decoration`}
          viewBox="0 0 100 100"
          width="120"
          height="120"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M30,50 Q50,20 70,50 Q50,80 30,50"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>

        <svg
          className={`${styles.decoration} ${styles.d2} decoration`}
          viewBox="0 0 100 100"
          width="160"
          height="160"
        >
          <rect
            x="25"
            y="25"
            width="50"
            height="50"
            fill="none"
            stroke="white"
            strokeWidth="2"
            rx="10"
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>

        <svg
          className={`${styles.decoration} ${styles.d3} decoration`}
          viewBox="0 0 100 100"
          width="100"
          height="100"
        >
          <polygon
            points="50,10 90,50 50,90 10,50"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

export default FestivalBanner;
