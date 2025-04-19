import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useBookmark } from "../context/BookmarkContext";
import { useTag } from "../context/TagContext";
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";
import { Item, Event, Exhibit, Stall } from "../types/common";
import Tag from "../components/common/Tag";
import DetailMap from "../components/detail/DetailMap";
import ItemTypeIcon from "../components/common/ItemTypeIcon";

const Detail = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();
  const { selectTag } = useTag();
  const navigate = useNavigate();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find the item based on type and id
  useEffect(() => {
    setLoading(true);
    setError(null);

    if (!type || !id) {
      setError("Missing type or ID");
      setLoading(false);
      return;
    }

    let foundItem: Item | undefined;

    switch (type) {
      case "event":
        foundItem = events.find((event) => event.id === id);
        break;
      case "exhibit":
        foundItem = exhibits.find((exhibit) => exhibit.id === id);
        break;
      case "stall":
        foundItem = stalls.find((stall) => stall.id === id);
        break;
      default:
        setError(`Invalid type: ${type}`);
        setLoading(false);
        return;
    }

    if (foundItem) {
      setItem(foundItem);
    } else {
      setError(`Item not found: ${id}`);
    }

    setLoading(false);
  }, [type, id]);

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    if (item) {
      toggleBookmark(item.id);
    }
  };

  // Handle tag click
  const handleTagClick = (tag: string) => {
    selectTag(tag);
    navigate("/search");
  };

  // If loading
  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // If error
  if (error || !item) {
    return (
      <div className="detail-error">
        <h2>{t("errors.genericError")}</h2>
        <p>{error || t("errors.itemNotFound")}</p>
        <button onClick={handleBack} className="back-button">
          {t("detail.back")}
        </button>
      </div>
    );
  }

  // Determine specific properties based on item type
  const renderSpecificDetails = () => {
    switch (item.type) {
      case "event":
        const event = item as Event;
        return (
          <div className="detail-specific">
            <div className="detail-field">
              <span className="detail-label">{t("detail.organizer")}:</span>
              <span className="detail-value">{event.organizer}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">{t("detail.duration")}:</span>
              <span className="detail-value">
                {Math.floor(event.duration / 60)} hr {event.duration % 60} min
              </span>
            </div>
          </div>
        );
      case "exhibit":
        const exhibit = item as Exhibit;
        return (
          <div className="detail-specific">
            <div className="detail-field">
              <span className="detail-label">{t("detail.creator")}:</span>
              <span className="detail-value">{exhibit.creator}</span>
            </div>
          </div>
        );
      case "stall":
        const stall = item as Stall;
        return (
          <div className="detail-specific">
            <div className="detail-field">
              <span className="detail-label">{t("detail.products")}:</span>
              <div className="detail-products">
                {stall.products.map((product, index) => (
                  <span key={index} className="detail-product-item">
                    {product}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Get type label
  const getTypeLabel = () => {
    switch (item.type) {
      case "event":
        return t("detail.event");
      case "exhibit":
        return t("detail.exhibit");
      case "stall":
        return t("detail.stall");
      default:
        return "";
    }
  };

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button onClick={handleBack} className="back-button">
          ← {t("detail.back")}
        </button>

        <button
          className={`bookmark-button ${
            isBookmarked(item.id) ? "bookmarked" : ""
          }`}
          onClick={handleBookmarkToggle}
          aria-label={
            isBookmarked(item.id)
              ? t("actions.removeBookmark")
              : t("actions.bookmark")
          }
        >
          {isBookmarked(item.id) ? "★" : "☆"}
          <span className="bookmark-text">
            {isBookmarked(item.id)
              ? t("actions.removeBookmark")
              : t("actions.bookmark")}
          </span>
        </button>
      </div>

      <div className="detail-content">
        <div className="detail-type">
          <ItemTypeIcon type={item.type} size="medium" />
          <span className="detail-type-label">{getTypeLabel()}</span>
        </div>

        <h1 className="detail-title">{item.title}</h1>

        <div className="detail-meta">
          <div className="detail-field">
            <span className="detail-icon">🕒</span>
            <span className="detail-label">{t("detail.date")}:</span>
            <span className="detail-value">{item.date}</span>
          </div>

          <div className="detail-field">
            <span className="detail-icon">⏱️</span>
            <span className="detail-label">{t("detail.time")}:</span>
            <span className="detail-value">{item.time}</span>
          </div>

          <div className="detail-field">
            <span className="detail-icon">📍</span>
            <span className="detail-label">{t("detail.location")}:</span>
            <span className="detail-value">{item.location}</span>
          </div>
        </div>

        {item.imageUrl && (
          <div className="detail-image">
            <img src={item.imageUrl} alt={item.title} />
          </div>
        )}

        <div className="detail-description">
          <p>{item.description}</p>
        </div>

        {renderSpecificDetails()}

        {item.tags && item.tags.length > 0 && (
          <div className="detail-tags">
            <h3 className="detail-section-title">{t("detail.tags")}</h3>
            <div className="detail-tags-list">
              {item.tags.map((tag) => (
                <Tag
                  key={tag}
                  tag={tag}
                  size="medium"
                  onClick={handleTagClick}
                />
              ))}
            </div>
          </div>
        )}

        <div className="detail-map-section">
          <h3 className="detail-section-title">{t("map.title")}</h3>
          <DetailMap location={item.location} />
        </div>

        <div className="detail-related">
          <h3 className="detail-section-title">{t("detail.related")}</h3>
          <div className="detail-related-content">
            {/* This would be populated with related items in a real implementation */}
            <p>{t("detail.noRelatedItems")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
