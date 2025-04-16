// src/components/layout/Header/Header.tsx
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import styles from "./Header.module.css";
import bottomNavStyles from "./BottomNav.module.css";
import Logo from "../Logo";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Animate navigation items
    gsap.from(".nav-item", {
      opacity: 0,
      y: -10,
      stagger: 0.05,
      duration: 0.4,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

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
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logoContainer}>
            <Link to="/" className={styles.logoLink}>
              <Logo />
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

        {isMenuOpen && (
          <>
            <div className={styles.overlay} onClick={toggleMenu}></div>
            <div
              className={`${styles.mobileMenu} ${
                isMenuOpen ? styles.open : ""
              }`}
            >
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
                    <svg
                      viewBox="0 0 24 24"
                      className={styles.mobileSearchIcon}
                    >
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
                    <li className={styles.mobileNavItem}>
                      <NavLink
                        to="/bookmarks"
                        className={({ isActive }) =>
                          isActive
                            ? `${styles.mobileNavLink} ${styles.active}`
                            : styles.mobileNavLink
                        }
                        onClick={toggleMenu}
                      >
                        ブックマーク
                      </NavLink>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Bottom navigation for mobile */}
      <div className={bottomNavStyles.bottomNav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? `${bottomNavStyles.navItem} ${bottomNavStyles.active}`
              : bottomNavStyles.navItem
          }
          end
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={bottomNavStyles.navIcon}
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className={bottomNavStyles.navLabel}>ホーム</span>
        </NavLink>
        <NavLink
          to="/events"
          className={({ isActive }) =>
            isActive
              ? `${bottomNavStyles.navItem} ${bottomNavStyles.active}`
              : bottomNavStyles.navItem
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={bottomNavStyles.navIcon}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className={bottomNavStyles.navLabel}>イベント</span>
        </NavLink>
        <NavLink
          to="/exhibits"
          className={({ isActive }) =>
            isActive
              ? `${bottomNavStyles.navItem} ${bottomNavStyles.active}`
              : bottomNavStyles.navItem
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={bottomNavStyles.navIcon}
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span className={bottomNavStyles.navLabel}>展示</span>
        </NavLink>
        <NavLink
          to="/timetable"
          className={({ isActive }) =>
            isActive
              ? `${bottomNavStyles.navItem} ${bottomNavStyles.active}`
              : bottomNavStyles.navItem
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={bottomNavStyles.navIcon}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className={bottomNavStyles.navLabel}>時間</span>
        </NavLink>
        <NavLink
          to="/map"
          className={({ isActive }) =>
            isActive
              ? `${bottomNavStyles.navItem} ${bottomNavStyles.active}`
              : bottomNavStyles.navItem
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={bottomNavStyles.navIcon}
          >
            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
          </svg>
          <span className={bottomNavStyles.navLabel}>マップ</span>
        </NavLink>
      </div>
    </>
  );
};

export default Header;
