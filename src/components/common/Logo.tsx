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
    <div>
      <Link to="/">
        <div>
          <span>POP!</span>
        </div>

        {withText && <span>{t("siteName")}</span>}
      </Link>
    </div>
  );
};

export default Logo;
