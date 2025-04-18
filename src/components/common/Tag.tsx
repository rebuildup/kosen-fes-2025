import { useTag } from "../../context/TagContext";
import { useNavigate } from "react-router-dom";

interface TagProps {
  tag: string;
  count?: number;
  size?: "small" | "medium" | "large";
  onClick?: (tag: string) => void;
  interactive?: boolean;
}

const Tag = ({
  tag,
  count,
  size = "medium",
  onClick,
  interactive = true,
}: TagProps) => {
  const { isTagSelected, selectTag } = useTag();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onClick) {
      onClick(tag);
    } else if (interactive) {
      selectTag(tag);
    }
  };

  const isActive = isTagSelected(tag);
  const sizeClass = `tag-${size}`;

  return (
    <button
      className={`tag ${sizeClass} ${isActive ? "tag-active" : ""}`}
      onClick={handleClick}
      type="button"
    >
      <span className="tag-text">#{tag}</span>
      {count !== undefined && <span className="tag-count">{count}</span>}
    </button>
  );
};

export default Tag;
