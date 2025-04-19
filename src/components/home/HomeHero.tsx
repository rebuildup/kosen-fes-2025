import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../utils/animations";

interface HomeHeroProps {
  className?: string;
}

const HomeHero = ({ className = "" }: HomeHeroProps) => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const decorationRef = useRef<HTMLDivElement>(null);

  // Animation on component mount
  useEffect(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline();

    // Hero section fade in
    tl.fromTo(
      heroRef.current,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: DURATION.NORMAL,
        ease: EASE.SMOOTH,
      }
    );

    // Title animation
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: DURATION.NORMAL,
          ease: EASE.SMOOTH,
        },
        "-=0.2"
      );
    }

    // Subtitle animation
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: DURATION.NORMAL,
          ease: EASE.SMOOTH,
        },
        "-=0.2"
      );
    }

    // Dates animation
    if (datesRef.current) {
      tl.fromTo(
        datesRef.current,
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: DURATION.NORMAL,
          ease: EASE.SMOOTH,
        },
        "-=0.2"
      );
    }

    // CTA button animation
    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: DURATION.NORMAL,
          ease: EASE.SMOOTH,
          onComplete: () => {
            // Add pulse animation to CTA
            gsap.to(ctaRef.current, {
              scale: 1.05,
              duration: 1,
              repeat: -1,
              yoyo: true,
              ease: "power1.inOut",
            });
          },
        },
        "-=0.2"
      );
    }

    // Decoration animation
    if (decorationRef.current) {
      tl.fromTo(
        decorationRef.current,
        { autoAlpha: 0, x: "10%" },
        {
          autoAlpha: 0.1,
          x: "20%",
          duration: DURATION.SLOW,
          ease: EASE.SMOOTH,
          onComplete: () => {
            // Add floating animation to decoration
            gsap.to(decorationRef.current, {
              y: 15,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
        },
        "-=0.4"
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className={`home-hero ${className}`} ref={heroRef}>
      <div className="home-hero-content">
        <h1 className="home-hero-title" ref={titleRef}>
          {t("siteName")}
        </h1>
        <p className="home-hero-subtitle" ref={subtitleRef}>
          {t("home.subtitle")}
        </p>
        <div className="home-hero-dates" ref={datesRef}>
          <span className="home-hero-dates-icon">📅</span>
          <span>2025/06/15 - 2025/06/16</span>
        </div>
        <Link to="/schedule" className="home-hero-cta" ref={ctaRef}>
          {t("schedule.title")}
          <span className="home-hero-cta-icon">→</span>
        </Link>
      </div>
      <div className="home-hero-decoration" ref={decorationRef}>
        <div className="festival-symbol">祭</div>
      </div>
    </section>
  );
};

export default HomeHero;
