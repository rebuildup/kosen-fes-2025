// src/components/layout/Header/Header.tsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logoLink}>
            <div className={styles.logo}>
              <svg viewBox="0 0 40 40" className={styles.logoSvg}>
                <circle cx="20" cy="20" r="18" className={styles.logoCircle} />
                <path
                  d="M14 10L14 30M14 10H26M14 20H24M14 30H26"
                  className={styles.logoPath}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>宇部高専祭</span>
              <span className={styles.logoYear}>2025</span>
            </div>
          </Link>
        </div>

        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                end
              >
                ホーム
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
              >
                イベント
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/exhibits"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
              >
                展示／露店
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/timetable"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
              >
                タイムテーブル
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
              >
                マップ
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="検索..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>
              <svg viewBox="0 0 24 24" className={styles.searchIcon}>
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </form>

          <button className={styles.menuButton} onClick={toggleMenu}>
            <span className={styles.menuIcon}></span>
            <span className={styles.menuIcon}></span>
            <span className={styles.menuIcon}></span>
          </button>
        </div>
      </div>

      {/* モバイルメニュー */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}>
        <div className={styles.mobileMenuContainer}>
          <form
            className={styles.mobileSearchForm}
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              placeholder="検索..."
              className={styles.mobileSearchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.mobileSearchButton}>
              <svg viewBox="0 0 24 24" className={styles.mobileSearchIcon}>
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </form>

          <nav className={styles.mobileNav}>
            <ul className={styles.mobileNavList}>
              <li className={styles.mobileNavItem}>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.mobileNavLink} ${styles.active}`
                      : styles.mobileNavLink
                  }
                  onClick={toggleMenu}
                  end
                >
                  ホーム
                </NavLink>
              </li>
              <li className={styles.mobileNavItem}>
                <NavLink
                  to="/events"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.mobileNavLink} ${styles.active}`
                      : styles.mobileNavLink
                  }
                  onClick={toggleMenu}
                >
                  イベント
                </NavLink>
              </li>
              <li className={styles.mobileNavItem}>
                <NavLink
                  to="/exhibits"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.mobileNavLink} ${styles.active}`
                      : styles.mobileNavLink
                  }
                  onClick={toggleMenu}
                >
                  展示／露店
                </NavLink>
              </li>
              <li className={styles.mobileNavItem}>
                <NavLink
                  to="/timetable"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.mobileNavLink} ${styles.active}`
                      : styles.mobileNavLink
                  }
                  onClick={toggleMenu}
                >
                  タイムテーブル
                </NavLink>
              </li>
              <li className={styles.mobileNavItem}>
                <NavLink
                  to="/map"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.mobileNavLink} ${styles.active}`
                      : styles.mobileNavLink
                  }
                  onClick={toggleMenu}
                >
                  マップ
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* オーバーレイ */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={toggleMenu}></div>
      )}
    </header>
  );
};

export default Header;
