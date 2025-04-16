// src/pages/Home.tsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import "./Home.css";

const Home = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bannerTl = gsap.timeline();

    bannerTl
      .from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
      .from(
        ".hero-subtitle",
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.5"
      )
      .from(
        ".hero-cta",
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.7"
      );

    // Animate sections
    gsap.from(".home-section", {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 0.8,
      scrollTrigger: {
        trigger: sectionsRef.current,
        start: "top 80%",
      },
    });

    return () => {
      bannerTl.kill();
    };
  }, []);

  return (
    <div className="home-container">
      <div className="hero-banner" ref={bannerRef}>
        <div className="hero-content">
          <h1 className="hero-title">Cultural Festival 2025</h1>
          <p className="hero-subtitle">
            Experience art, music, and culture like never before
          </p>
          <Link to="/events" className="button hero-cta">
            Explore Events
          </Link>
        </div>
        <div className="hero-decorations">
          {/* SVG decorations */}
          <svg
            className="decoration d1"
            viewBox="0 0 100 100"
            width="100"
            height="100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#646cff"
              strokeWidth="2"
            />
            <path
              d="M30,50 Q50,30 70,50 Q50,70 30,50"
              fill="none"
              stroke="#535bf2"
              strokeWidth="2"
            />
          </svg>
          <svg
            className="decoration d2"
            viewBox="0 0 100 100"
            width="80"
            height="80"
          >
            <rect
              x="20"
              y="20"
              width="60"
              height="60"
              fill="none"
              stroke="#646cff"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="#535bf2"
              strokeWidth="2"
            />
          </svg>
          <svg
            className="decoration d3"
            viewBox="0 0 100 100"
            width="120"
            height="120"
          >
            <polygon
              points="50,10 90,50 50,90 10,50"
              fill="none"
              stroke="#646cff"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="none"
              stroke="#535bf2"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div className="home-sections" ref={sectionsRef}>
        <section className="home-section">
          <h2 className="section-title">Featured Events</h2>
          <div className="event-cards">
            <div className="card event-card">
              <div className="event-time">May 15, 10:00 AM</div>
              <h3>Opening Ceremony</h3>
              <p>
                Join us for the grand opening with special performances and
                keynote speakers.
              </p>
              <Link to="/events" className="button">
                Details
              </Link>
            </div>
            <div className="card event-card">
              <div className="event-time">May 16, 2:00 PM</div>
              <h3>Music Concert</h3>
              <p>
                Experience amazing live music from talented local and
                international artists.
              </p>
              <Link to="/events" className="button">
                Details
              </Link>
            </div>
            <div className="card event-card">
              <div className="event-time">May 17, 11:00 AM</div>
              <h3>Art Workshop</h3>
              <p>
                Learn creative techniques from professional artists in this
                interactive workshop.
              </p>
              <Link to="/events" className="button">
                Details
              </Link>
            </div>
          </div>
        </section>

        <section className="home-section">
          <h2 className="section-title">Festival Highlights</h2>
          <div className="highlights">
            <div className="highlight-item">
              <div className="highlight-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="none"
                  stroke="#646cff"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" strokeLinecap="round" />
                </svg>
              </div>
              <h3>3 Full Days</h3>
              <p>Three days packed with events, exhibits, and performances.</p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="none"
                  stroke="#646cff"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6" />
                  <path d="M23 11h-6" />
                </svg>
              </div>
              <h3>50+ Exhibitors</h3>
              <p>
                Discover amazing art and cultural exhibits from around the
                world.
              </p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="none"
                  stroke="#646cff"
                  strokeWidth="2"
                >
                  <path d="M12 2v4M12 18v4M5 12H1M23 12h-4M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" />
                </svg>
              </div>
              <h3>20+ Performances</h3>
              <p>
                Enjoy music, dance, and theatrical performances throughout the
                festival.
              </p>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="none"
                  stroke="#646cff"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3>Central Location</h3>
              <p>Easily accessible venue with modern facilities.</p>
            </div>
          </div>
        </section>

        <section className="home-section">
          <h2 className="section-title">Don't Miss It!</h2>
          <div className="cta-block">
            <p>
              Join us for an unforgettable celebration of culture and
              creativity.
            </p>
            <Link to="/timetable" className="button large-btn">
              View Full Schedule
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
