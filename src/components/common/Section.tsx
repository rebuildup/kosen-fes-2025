import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface SectionProps {
  title: string;
  icon?: string;
  linkTo?: string;
  linkText?: string;
  children: ReactNode;
}

const Section = ({ children, icon, linkText, linkTo, title }: SectionProps) => {
  return (
    <section>
      <div>
        <h2>
          {icon && <span>{icon}</span>}
          {title}
        </h2>

        {linkTo && linkText && (
          <Link to={linkTo}>
            {linkText}
            <span>→</span>
          </Link>
        )}
      </div>

      <div>{children}</div>
    </section>
  );
};

export default Section;
