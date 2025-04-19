import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface SectionProps {
  title: string;
  icon?: string;
  linkTo?: string;
  linkText?: string;
  children: ReactNode;
  className?: string;
}

const Section = ({
  title,
  icon,
  linkTo,
  linkText,
  children,
  className = "",
}: SectionProps) => {
  return (
    <section className={`section ${className}`}>
      <div className="section-header">
        <h2 className="section-title">
          {icon && <span className="section-icon">{icon}</span>}
          {title}
        </h2>

        {linkTo && linkText && (
          <Link to={linkTo} className="section-link">
            {linkText}
            <span className="section-link-icon">→</span>
          </Link>
        )}
      </div>

      <div className="section-content">{children}</div>
    </section>
  );
};

export default Section;
