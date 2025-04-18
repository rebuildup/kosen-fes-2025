import { useTag } from "../../context/TagContext";
import { useLanguage } from "../../context/LanguageContext";
import Tag from "./Tag";

const SelectedTags = () => {
  const { selectedTags, toggleTag, clearTags } = useTag();
  const { t } = useLanguage();

  if (selectedTags.length === 0) {
    return null;
  }

  return (
    <div className="selected-tags">
      <div className="selected-tags-header">
        <span className="selected-tags-label">{t("tags.activeFilters")}:</span>
        <button className="selected-tags-clear" onClick={clearTags}>
          {t("tags.clearAll")}
        </button>
      </div>

      <div className="selected-tags-list">
        {selectedTags.map((tag) => (
          <Tag key={tag} tag={tag} onClick={toggleTag} size="medium" />
        ))}
      </div>
    </div>
  );
};

export default SelectedTags;
