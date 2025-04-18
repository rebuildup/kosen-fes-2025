import { Link } from "react-router-dom";
import { Item } from "../../types/common";
import { useLanguage } from "../../context/LanguageContext";
import BookmarkButton from "./BookmarkButton";
import ItemTypeIcon from "./ItemTypeIcon";

interface FeaturedCardProps {
  item: Item;
}

const FeaturedCard = ({ item }: FeaturedCardProps) => {
  const { t } = useLanguage();

  return (
    <div className="featured-card">
      <div className="featured-card-content">
        <div className="featured-card-info">
          <div className="featured-card-meta">
            <ItemTypeIcon type={item.type} size="small" />
            <span className="featured-card-type">
              {item.type === "event"
                ? t("detail.event")
                : item.type === "exhibit"
                ? t("detail.exhibit")
                : t("detail.stall")}
            </span>
          </div>

          <h2 className="featured-card-title">{item.title}</h2>

          <p className="featured-card-description">{item.description}</p>

          <div className="featured-card-details">
            <div className="featured-detail">
              <span className="detail-icon">🕒</span>
              <span>
                {item.date} | {item.time}
              </span>
            </div>
            <div className="featured-detail">
              <span className="detail-icon">📍</span>
              <span>{item.location}</span>
            </div>
          </div>

          <div className="featured-card-actions">
            <Link
              to={`/detail/${item.type}/${item.id}`}
              className="featured-card-button"
            >
              {t("actions.viewDetails")}
            </Link>
            <BookmarkButton itemId={item.id} size="medium" showText />
          </div>
        </div>

        <div className="featured-card-image-container">
          <img
            src={item.imageUrl || "/images/placeholder.jpg"}
            alt={item.title}
            className="featured-card-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/placeholder.jpg";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;
