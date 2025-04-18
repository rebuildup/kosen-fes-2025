import { useLanguage } from "../../context/LanguageContext";
import TagFilter from "../common/TagFilter";

interface FilterPanelProps {
  onFilterChange: () => void;
}

const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {
  const { t } = useLanguage();

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <h3 className="filter-section-title">{t("tags.filterByTag")}</h3>
        <TagFilter onFilter={onFilterChange} />
      </div>
    </div>
  );
};

export default FilterPanel;
