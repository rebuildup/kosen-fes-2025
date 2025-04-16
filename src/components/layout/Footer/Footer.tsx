// src/components/layout/Footer/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerTop}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>宇部高専祭 2025</h3>
            <p className={styles.footerDescription}>
              文化と技術の祭典「宇部高専祭」は、学生の創造性と地域との交流を目的とした年に一度の総合文化祭です。
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <svg viewBox="0 0 24 24" className={styles.socialIcon}>
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <svg viewBox="0 0 24 24" className={styles.socialIcon}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="YouTube">
                <svg viewBox="0 0 24 24" className={styles.socialIcon}>
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>ページ</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/" className={styles.footerLink}>
                  ホーム
                </Link>
              </li>
              <li>
                <Link to="/events" className={styles.footerLink}>
                  イベント
                </Link>
              </li>
              <li>
                <Link to="/exhibits" className={styles.footerLink}>
                  展示／露店
                </Link>
              </li>
              <li>
                <Link to="/timetable" className={styles.footerLink}>
                  タイムテーブル
                </Link>
              </li>
              <li>
                <Link to="/map" className={styles.footerLink}>
                  マップ
                </Link>
              </li>
              <li>
                <Link to="/search" className={styles.footerLink}>
                  検索
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>開催情報</h3>
            <ul className={styles.footerInfo}>
              <li className={styles.infoItem}>
                <svg viewBox="0 0 24 24" className={styles.infoIcon}>
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                </svg>
                <span>2025年5月15日・16日</span>
              </li>
              <li className={styles.infoItem}>
                <svg viewBox="0 0 24 24" className={styles.infoIcon}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>宇部工業高等専門学校</span>
              </li>
              <li className={styles.infoItem}>
                <svg viewBox="0 0 24 24" className={styles.infoIcon}>
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
                <span>10:00〜20:00</span>
              </li>
              <li className={styles.infoItem}>
                <svg viewBox="0 0 24 24" className={styles.infoIcon}>
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                </svg>
                <span>contact@kosen-fes.jp</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} 宇部工業高等専門学校 高専祭実行委員会
          </p>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>
              プライバシーポリシー
            </a>
            <a href="#" className={styles.bottomLink}>
              お問い合わせ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
