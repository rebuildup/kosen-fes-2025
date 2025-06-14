import { useLanguage } from "../../context/LanguageContext";
import TagFilter from "../common/TagFilter";

interface FilterPanelProps {
  onFilterChange: () => void;
}

const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {
  const { t } = useLanguage();

  return (
    <div>
      <div>
        <h3>{t("tags.filterByTag")}</h3>
        <TagFilter onFilter={onFilterChange} />
      </div>
    </div>
  );
};

export default FilterPanel;
