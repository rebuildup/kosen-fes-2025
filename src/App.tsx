// src/App.tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Exhibits from "./pages/Exhibits";
import Timetable from "./pages/Timetable";
import Map from "./pages/Map";
import "./App.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animation when the app loads
    const ctx = gsap.context(() => {
      gsap.from(".app-container", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      });
    }, appRef);

    return () => ctx.revert();
  }, []);

  // Floating action button for creating new posts
  const FloatingActionButton = () => (
    <button className="floating-action-btn">
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
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  );

  return (
    <div className="app-container" ref={appRef}>
      <Header />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="feed-sidebar-left">
                  {/* Left Sidebar (desktop only) */}
                  <nav className="sidebar-nav">
                    <ul className="footer-nav">
                      <li className="footer-nav-item">
                        <a href="#" className="footer-nav-link">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                          <span>Home</span>
                        </a>
                      </li>
                      <li className="footer-nav-item">
                        <a href="#" className="footer-nav-link">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          <span>Explore</span>
                        </a>
                      </li>
                      <li className="footer-nav-item">
                        <a href="#" className="footer-nav-link">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                          <span>Notifications</span>
                        </a>
                      </li>
                      <li className="footer-nav-item">
                        <a href="#" className="footer-nav-link">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          <span>Messages</span>
                        </a>
                      </li>
                      <li className="footer-nav-item">
                        <a href="#" className="footer-nav-link">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                          <span>Bookmarks</span>
                        </a>
                      </li>
                      <li className="footer-nav-item">
                        <a href="#" className="footer-nav-link">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          <span>Profile</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>

                <div className="feed-main">
                  <Home />
                </div>

                <div className="feed-sidebar-right">
                  {/* Right Sidebar (desktop only) */}
                  <div className="search-bar">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="search-icon"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input type="text" placeholder="Search Festival" />
                  </div>

                  {/* Trending Widget */}
                  <div className="widget">
                    <div className="widget-header">What's happening</div>
                    <div className="widget-content">
                      <ul className="trending-list">
                        <li className="trending-item">
                          <div className="trending-category">
                            Trending in Festival
                          </div>
                          <div className="trending-title">Opening Ceremony</div>
                          <div className="trending-meta">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                            </svg>
                            <span>2,543 posts</span>
                          </div>
                        </li>
                        <li className="trending-item">
                          <div className="trending-category">Music</div>
                          <div className="trending-title">
                            Festival Band Lineup
                          </div>
                          <div className="trending-meta">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                            </svg>
                            <span>1,829 posts</span>
                          </div>
                        </li>
                        <li className="trending-item">
                          <div className="trending-category">Food</div>
                          <div className="trending-title">
                            International Food Court
                          </div>
                          <div className="trending-meta">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                            </svg>
                            <span>987 posts</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="widget-footer">Show more</div>
                  </div>

                  {/* Who to follow Widget */}
                  <div className="widget">
                    <div className="widget-header">Who to follow</div>
                    <div className="widget-content">
                      <ul className="follow-list">
                        <li className="follow-item">
                          <img
                            src="https://i.pravatar.cc/150?img=50"
                            alt="Festival Music"
                            className="follow-avatar"
                          />
                          <div className="follow-info">
                            <div className="follow-name">Festival Music</div>
                            <div className="follow-username">
                              @festival_music
                            </div>
                          </div>
                          <button className="follow-btn">Follow</button>
                        </li>
                        <li className="follow-item">
                          <img
                            src="https://i.pravatar.cc/150?img=35"
                            alt="Art Exhibits"
                            className="follow-avatar"
                          />
                          <div className="follow-info">
                            <div className="follow-name">Art Exhibits</div>
                            <div className="follow-username">@art_exhibits</div>
                          </div>
                          <button className="follow-btn">Follow</button>
                        </li>
                        <li className="follow-item">
                          <img
                            src="https://i.pravatar.cc/150?img=28"
                            alt="Cultural Workshops"
                            className="follow-avatar"
                          />
                          <div className="follow-info">
                            <div className="follow-name">
                              Cultural Workshops
                            </div>
                            <div className="follow-username">@workshops</div>
                          </div>
                          <button className="follow-btn">Follow</button>
                        </li>
                      </ul>
                    </div>
                    <div className="widget-footer">Show more</div>
                  </div>
                </div>
              </>
            }
          />
          <Route path="/events" element={<Events />} />
          <Route path="/exhibits" element={<Exhibits />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </main>

      <Footer />
      <FloatingActionButton />
    </div>
  );
}

export default App;
