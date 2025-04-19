import { ReactNode, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { DURATION, EASE } from "../../utils/animations";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const { pathname } = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = pageRef.current;
    if (!element) return;

    // Reset scroll position
    window.scrollTo(0, 0);

    // Animation timeline
    const tl = gsap.timeline();

    tl.set(element, { opacity: 0, y: 20 }).to(element, {
      opacity: 1,
      y: 0,
      duration: DURATION.NORMAL,
      ease: EASE.SMOOTH,
      clearProps: "all",
    });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <div className="page-transition-wrapper" ref={pageRef}>
      {children}
    </div>
  );
};

export default PageTransition;
