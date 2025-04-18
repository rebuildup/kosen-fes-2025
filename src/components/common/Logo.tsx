import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface LogoProps {
  size?: "small" | "medium" | "large";
  withText?: boolean;
}

const Logo = ({ size = "medium", withText = true }: LogoProps) => {
  const { t } = useLanguage();

  const sizeClass = `logo-${size}`;

  return (
    <div className={`logo ${sizeClass}`}>
      <Link to="/" className="logo-link">
        <div className="logo-icon">
          <span className="logo-symbol">祭</span>
        </div>

        {withText && <span className="logo-text">{t("siteName")}</span>}
      </Link>
    </div>
  );
};

export default Logo;
