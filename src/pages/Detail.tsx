import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useBookmark } from "../context/BookmarkContext";
import { useTag } from "../context/TagContext";
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";
import { sponsors } from "../data/sponsors";
import { Item, Event, Exhibit, Stall } from "../types/common";
import Tag from "../components/common/Tag";
import DetailMap from "../components/detail/DetailMap";
import ItemTypeIcon from "../components/common/ItemTypeIcon";
import { Sponsor } from "../types/common";

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
      case "sponsor":
        foundItem = sponsors.find((sponsor) => sponsor.id === id); // Add this case
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

  // Loading state
  if (loading) {
    return (
      <div>
        <div></div>
        <p>{t("loading")}</p>
      </div>
    );
  }

  // Error state
  if (error || !item) {
    return (
      <div>
        <p>{t("errors.itemNotFound")}</p>
        <button onClick={handleBack}>{t("navigation.back")}</button>
      </div>
    );
  }

  // Determine specific properties based on item type
  const renderSpecificDetails = () => {
    switch (item.type) {
      case "event": {
        const eventItem = item as Event;
        return (
          <div>
            <div>
              <span>{t("detail.organizer")}:</span>
              <span>{eventItem.organizer}</span>
            </div>
            <div>
              <span>{t("detail.duration")}:</span>
              <span>
                {Math.floor(eventItem.duration / 60)} hr{" "}
                {eventItem.duration % 60} min
              </span>
            </div>
          </div>
        );
      }
      case "exhibit": {
        const exhibitItem = item as Exhibit;
        return (
          <div>
            <div>
              <span>{t("detail.creator")}:</span>
              <span>{exhibitItem.creator}</span>
            </div>
          </div>
        );
      }
      case "stall": {
        const stallItem = item as Stall;
        return (
          <div>
            <div>
              <span>{t("detail.products")}:</span>
              <div>
                {stallItem.products.map((product, index) => (
                  <span key={index}>{product}</span>
                ))}
              </div>
            </div>
          </div>
        );
      }
      case "sponsor": {
        const sponsorItem = item as Sponsor;
        return (
          <div>
            <div>
              <span>{t("detail.website")}:</span>
              <a
                href={sponsorItem.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {sponsorItem.website}
              </a>
            </div>
            <div>
              <span>{t("detail.tier")}:</span>
              <span>
                {sponsorItem.tier.charAt(0).toUpperCase() +
                  sponsorItem.tier.slice(1)}
              </span>
            </div>
            {sponsorItem.contactEmail && (
              <div>
                <span>{t("detail.contact")}:</span>
                <a href={`mailto:${sponsorItem.contactEmail}`}>
                  {sponsorItem.contactEmail}
                </a>
              </div>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };
  const getTypeLabel = () => {
    switch (item.type) {
      case "event":
        return t("detail.event");
      case "exhibit":
        return t("detail.exhibit");
      case "stall":
        return t("detail.stall");
      case "sponsor":
        return t("detail.sponsor");
      default:
        return "";
    }
  };

  return (
    <div>
      <div>
        <button onClick={handleBack}>← {t("navigation.back")}</button>

        <button
          onClick={handleBookmarkToggle}
          aria-label={
            isBookmarked(item.id)
              ? t("actions.removeBookmark")
              : t("actions.bookmark")
          }
        >
          {isBookmarked(item.id) ? "★" : "☆"}
          <span>
            {isBookmarked(item.id) ? t("actions.remove") : t("actions.add")}
          </span>
        </button>
      </div>

      <div>
        <div>
          <ItemTypeIcon type={item.type} size="large" />
          <span>{getTypeLabel()}</span>
        </div>

        <h1>{item.title}</h1>

        <div>
          <div>
            <span>🕒</span>
            <span>{t("detail.date")}:</span>
            <span>{item.date}</span>
          </div>

          <div>
            <span>⏱️</span>
            <span>{t("detail.time")}:</span>
            <span>{item.time}</span>
          </div>

          <div>
            <span>📍</span>
            <span>{t("detail.location")}:</span>
            <span>{item.location}</span>
          </div>
        </div>

        {item.imageUrl && (
          <div>
            <img src={item.imageUrl} alt={item.title} />
          </div>
        )}

        <div>
          <p>{item.description}</p>
        </div>

        {renderSpecificDetails()}

        {item.tags && item.tags.length > 0 && (
          <div>
            <h3>{t("detail.tags")}</h3>
            <div>
              {item.tags.map((tag, idx) => (
                <Tag key={idx} tag={tag} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h3>{t("map.title")}</h3>
          <p>{item.location}</p>
        </div>

        <div>
          <h3>{t("detail.related")}</h3>
          <div>
            {/* This would be populated with related items in a real implementation */}
            <p>{t("detail.noRelatedItems")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
