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
    <div>
      <span>{t("detail.creator")}: </span>
      <span>{creator}</span>
    </div>
  );
};

export default ExhibitCreatorInfo;
