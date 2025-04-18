import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const FooterLogo = () => {
  const { t } = useLanguage();

  return (
    <Link to="/" className="footer-logo">
      <div className="footer-logo-icon">
        <span className="footer-logo-symbol">祭</span>
      </div>
      <span className="footer-logo-text">{t("siteName")}</span>
    </Link>
  );
};

export default FooterLogo;
