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
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        borderColor: "var(--color-border-primary)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("tags.activeFilters")}:
        </span>
        <button
          className="text-xs font-medium cursor-pointer transition-colors hover:underline"
          style={{ color: "var(--color-accent)" }}
          onClick={clearTags}
        >
          {t("tags.clearAll")}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Tag key={tag} tag={tag} onClick={toggleTag} size="medium" />
        ))}
      </div>
    </div>
  );
};

export default SelectedTags;
