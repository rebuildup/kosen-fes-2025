import { gsap } from "gsap";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { DURATION, EASE } from "../../utils/animations";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = pageRef.current;
    if (!element) return;

    // Reset scroll position on route change
    window.scrollTo(0, 0);

    // Animation timeline
    const tl = gsap.timeline();

    tl.set(element, { opacity: 0, y: 20 }).to(element, {
      clearProps: "all",
      duration: DURATION.NORMAL,
      ease: EASE.SMOOTH,
      opacity: 1,
      y: 0,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return <div ref={pageRef}>{children}</div>;
};

export default PageTransition;
