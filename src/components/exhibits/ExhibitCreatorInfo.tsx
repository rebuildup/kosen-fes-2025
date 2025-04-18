import { useLanguage } from "../../context/LanguageContext";

interface ExhibitCreatorInfoProps {
  creator: string;
}

const ExhibitCreatorInfo = ({ creator }: ExhibitCreatorInfoProps) => {
  const { t } = useLanguage();

  if (!creator) {
    return null;
  }

  return (
    <div className="exhibit-creator">
      <span className="exhibit-creator-label">{t("detail.creator")}: </span>
      <span className="exhibit-creator-name">{creator}</span>
    </div>
  );
};

export default ExhibitCreatorInfo;
