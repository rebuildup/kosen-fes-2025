// src/pages/Home/Home.tsx
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../contexts/LanguageContext";
import EventCard from "../../components/features/EventCard/EventCard";
import { useFeaturedEvents } from "../../hooks/useEvents";
import styles from "./Home.module.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const { events, loading } = useFeaturedEvents();
  const homeRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useEffect(() => {
    if (!homeRef.current) return;

    const timeline = gsap.timeline();

    // Animate hero section
    timeline
      .from(`.${styles.bannerTitle}`, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
      .from(
        `.${styles.bannerSubtitle}`,
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.5"
      )
      .from(
        `.${styles.bannerDates}`,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.3"
      )
      .from(
        `.${styles.bannerButton}`,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.3"
      );

    // Animate content sections when scrolled into view
    gsap.from(`.${styles.section}`, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: `.${styles.scrollContent}`,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
    });

    // Decorative elements animation
    gsap.to(`.${styles.decoration}`, {
      y: "random(-20, 20)",
      x: "random(-10, 10)",
      rotation: "random(-10, 10)",
      duration: "random(15, 25)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.5,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Manage banner parallax effect
  useEffect(() => {
    if (!bannerRef.current || !contentRef.current) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (bannerRef.current) {
        bannerRef.current.style.transform = `translateY(${
          scrollPosition * 0.4
        }px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.homePage} ref={homeRef}>
      <div className={styles.banner} ref={bannerRef}>
        <div className={styles.bannerOverlay}></div>
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>{t("home.festivalTitle")}</h1>
          <p className={styles.bannerSubtitle}>{t("home.subtitle")}</p>
          <p className={styles.bannerDates}>{t("home.festivalDates")}</p>
          <Link to="/events" className={styles.bannerButton}>
            {t("home.exploreEvents")}
          </Link>
        </div>

        {/* Decorative elements */}
        <div className={styles.decorations}>
          <div className={`${styles.decoration} ${styles.d1}`}>
            <svg viewBox="0 0 100 100" width="120" height="120">
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
          </div>
          <div className={`${styles.decoration} ${styles.d2}`}>
            <svg viewBox="0 0 100 100" width="160" height="160">
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
          </div>
          <div className={`${styles.decoration} ${styles.d3}`}>
            <svg viewBox="0 0 100 100" width="100" height="100">
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
      </div>

      <div className={styles.scrollContent} ref={contentRef}>
        {/* Featured Posts (SNS style) */}
        <section className={`${styles.section} ${styles.postSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("home.latestNews")}</h2>
            <Link to="/events" className={styles.viewAllLink}>
              {t("home.viewAll")}
            </Link>
          </div>

          <div className={styles.posts}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <p>{t("ui.loading")}</p>
              </div>
            ) : (
              events.slice(0, 2).map((event, index) => (
                <div key={`post-${event.id}`} className={styles.post}>
                  <div className={styles.postHeader}>
                    <img
                      src="https://source.unsplash.com/random/100x100/?avatar"
                      alt="Avatar"
                      className={styles.avatar}
                    />
                    <div className={styles.postInfo}>
                      <span className={styles.postAuthor}>
                        {language === "en" ? "Festival Staff" : "スタッフ"}
                      </span>
                      <span className={styles.postTime}>
                        {language === "en" ? "2 hours ago" : "2時間前"}
                      </span>
                    </div>
                    <button
                      className={styles.postMore}
                      aria-label="More options"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                  <div className={styles.postImage}>
                    <img src={event.image} alt={event.title} />
                  </div>
                  <div className={styles.postContent}>
                    <h3 className={styles.postTitle}>{event.title}</h3>
                    <p className={styles.postDescription}>
                      {event.description}
                    </p>
                  </div>
                  <div className={styles.postActions}>
                    <button className={styles.postAction}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span>{128 + index * 43}</span>
                    </button>
                    <button className={styles.postAction}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      <span>{42 + index * 16}</span>
                    </button>
                    <button className={styles.postAction}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                      <span>{23 + index * 9}</span>
                    </button>
                    <button className={styles.postAction}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Featured Events */}
        <section className={`${styles.section} ${styles.eventsSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("home.featuredEvents")}</h2>
            <Link to="/events" className={styles.viewAllLink}>
              {t("home.viewAll")}
            </Link>
          </div>

          <div className={styles.eventsGrid}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <p>{t("ui.loading")}</p>
              </div>
            ) : (
              events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  image={event.image}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  category={event.category}
                  type={event.type}
                />
              ))
            )}
          </div>
        </section>

        {/* Festival Highlights */}
        <section className={`${styles.section} ${styles.highlightsSection}`}>
          <h2 className={styles.sectionTitle}>{t("home.highlights")}</h2>
          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <div className={styles.highlightIcon}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <h3 className={styles.highlightTitle}>
                {t("home.exhibitsTitle")}
              </h3>
              <p className={styles.highlightText}>{t("home.exhibitsDesc")}</p>
            </div>

            <div className={styles.highlight}>
              <div className={styles.highlightIcon}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
              </div>
              <h3 className={styles.highlightTitle}>
                {t("home.performancesTitle")}
              </h3>
              <p className={styles.highlightText}>
                {t("home.performancesDesc")}
              </p>
            </div>

            <div className={styles.highlight}>
              <div className={styles.highlightIcon}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              <h3 className={styles.highlightTitle}>{t("home.foodTitle")}</h3>
              <p className={styles.highlightText}>{t("home.foodDesc")}</p>
            </div>
          </div>
        </section>

        {/* Contact section (merged from footer) */}
        <section className={`${styles.section} ${styles.contactSection}`}>
          <h2 className={styles.sectionTitle}>{t("home.contactTitle")}</h2>

          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>(123) 456-7890</span>
            </div>
            <div className={styles.contactItem}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <a href="mailto:info@festival2025.com">info@festival2025.com</a>
            </div>
            <div className={styles.contactItem}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>123 Festival Street, Tokyo, Japan</span>
            </div>
          </div>

          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink} aria-label="Twitter">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="#" className={styles.socialLink} aria-label="Instagram">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className={styles.socialLink} aria-label="Facebook">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className={styles.socialLink} aria-label="YouTube">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
          </div>

          <div className={styles.newsletter}>
            <input
              type="email"
              placeholder={t("home.newsletterPlaceholder")}
              className={styles.newsletterInput}
            />
            <button className={styles.newsletterButton}>
              {t("home.subscribe")}
            </button>
          </div>

          <div className={styles.copyright}>
            <p>
              &copy; {currentYear} {t("home.festivalTitle")}.{" "}
              {t("home.rightsReserved")}
            </p>
            <div className={styles.legalLinks}>
              <a href="#">{t("home.privacyPolicy")}</a>
              <a href="#">{t("home.termsOfService")}</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
