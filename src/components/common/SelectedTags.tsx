import { useLanguage } from "../../context/LanguageContext";
import { useTag } from "../../context/TagContext";
import Tag from "./Tag";

const SelectedTags = () => {
  const { clearTags, selectedTags, toggleTag } = useTag();
  const { t } = useLanguage();

  if (selectedTags.length === 0) {
    return null;
  }

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        borderColor: "var(--color-border-primary)",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
          {t("tags.activeFilters")}:
        </span>
        <button
          type="button"
          className="cursor-pointer text-xs font-medium transition-colors hover:underline"
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
