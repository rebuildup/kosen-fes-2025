import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useBookmark } from "../context/BookmarkContext";
import { events } from "../data/events";
import { exhibits } from "../data/exhibits";
import { stalls } from "../data/stalls";
import { sponsors } from "../data/sponsors";
import { Item, Event, Exhibit, Stall, Sponsor } from "../types/common";
import Tag from "../components/common/Tag";
import ItemTypeIcon from "../components/common/ItemTypeIcon";
import PillButton from "../components/common/PillButton";
import UnifiedCard from "../shared/components/ui/UnifiedCard";
import SimpleMap from "../components/map/UnifiedMap";

const Detail = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();
  const navigate = useNavigate();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);

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
        foundItem = sponsors.find((sponsor) => sponsor.id === id);
        break;
      default:
        setError(`Invalid type: ${type}`);
        setLoading(false);
        return;
    }

    if (foundItem) {
      setItem(foundItem);

      // Find related items with same tags
      if (foundItem.tags && foundItem.tags.length > 0) {
        const allItems = [...events, ...exhibits, ...stalls, ...sponsors];
        const related = allItems
          .filter(
            (otherItem) =>
              otherItem.id !== foundItem!.id &&
              otherItem.tags &&
              otherItem.tags.some((tag) => foundItem!.tags?.includes(tag))
          )
          .slice(0, 6); // Limit to 6 items
        setRelatedItems(related);
      }
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

  // Loading state
  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p
              className="text-lg"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("loading")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !item) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p
              className="text-lg mb-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("errors.itemNotFound")}
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "white",
              }}
            >
              {t("detail.back")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine specific properties based on item type
  const renderSpecificDetails = () => {
    switch (item.type) {
      case "event": {
        const eventItem = item as Event;
        return (
          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("detail.eventDetails")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("detail.organizer")}:
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>
                  {eventItem.organizer}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("detail.duration")}:
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>
                  {Math.floor(eventItem.duration / 60)} hr{" "}
                  {eventItem.duration % 60} min
                </span>
              </div>
            </div>
          </div>
        );
      }
      case "exhibit": {
        const exhibitItem = item as Exhibit;
        return (
          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("detail.exhibitDetails")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("detail.creator")}:
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>
                  {exhibitItem.creator}
                </span>
              </div>
            </div>
          </div>
        );
      }
      case "stall": {
        const stallItem = item as Stall;
        return (
          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("detail.stallDetails")}
            </h3>
            <div className="space-y-3">
              <div>
                <span
                  className="font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("detail.products")}:
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {stallItem.products.map((product, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded text-sm"
                      style={{
                        backgroundColor: "var(--color-bg-tertiary)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case "sponsor": {
        const sponsorItem = item as Sponsor;
        return (
          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("detail.sponsorDetails")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("detail.website")}:
                </span>
                <a
                  href={sponsorItem.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: "var(--color-accent)" }}
                >
                  {sponsorItem.website}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("detail.tier")}:
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>
                  {sponsorItem.tier}
                </span>
              </div>
            </div>
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
    <div className="min-h-screen">
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <PillButton onClick={handleBack} variant="secondary">
              ← {t("detail.back")}
            </PillButton>

            <button
              onClick={handleBookmarkToggle}
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isBookmarked(item.id)
                  ? "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] focus:ring-[var(--primary-color)]"
              }`}
              aria-label={
                isBookmarked(item.id)
                  ? t("actions.removeBookmark")
                  : t("actions.bookmark")
              }
              title={
                isBookmarked(item.id)
                  ? t("actions.removeBookmark")
                  : t("actions.bookmark")
              }
            >
              <span className="text-xl">
                {isBookmarked(item.id) ? "★" : "☆"}
              </span>
            </button>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <ItemTypeIcon type={item.type} size="large" />
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                }}
              >
                {getTypeLabel()}
              </span>
            </div>

            <h1
              className="text-3xl font-bold mb-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              {item.title}
            </h1>

            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-lg"
              style={{ backgroundColor: "var(--color-bg-secondary)" }}
            >
              <div className="flex items-center gap-2">
                <span>🕒</span>
                <span
                  className="font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("detail.date")}:
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>
                  {item.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span>⏱️</span>
                <span
                  className="font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("detail.time")}:
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>
                  {item.time}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span>📍</span>
                <span
                  className="font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("detail.location")}:
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>
                  {item.location}
                </span>
              </div>
            </div>

            {item.imageUrl && (
              <div className="rounded-lg overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-auto object-cover"
                  style={{ backgroundColor: "var(--color-bg-secondary)" }}
                />
              </div>
            )}

            {/* Location Information */}
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: "var(--color-bg-secondary)" }}
            >
              <h3
                className="text-xl font-semibold mb-4 flex items-center gap-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                <span>📍</span>
                {t("detail.location")}
              </h3>
              <div className="space-y-2">
                <p
                  className="text-lg"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {item.location}
                </p>
                {item.coordinates && (
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    座標: ({item.coordinates.x.toFixed(0)},{" "}
                    {item.coordinates.y.toFixed(0)})
                  </p>
                )}
              </div>
            </div>

            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: "var(--color-bg-secondary)" }}
            >
              <p
                className="text-lg leading-relaxed"
                style={{ color: "var(--color-text-primary)" }}
              >
                {item.description}
              </p>
            </div>

            {renderSpecificDetails()}

            {item.tags && item.tags.length > 0 && (
              <div>
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("detail.tags")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, idx) => (
                    <Tag key={idx} tag={tag} />
                  ))}
                </div>
              </div>
            )}

            {/* Campus Map */}
            {(item.location || item.coordinates) && (
              <div
                className="rounded-lg p-6 backdrop-blur-md bg-white/10 border border-white/20"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <h3
                  className="text-xl font-semibold mb-4 flex items-center gap-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <span>🗺️</span>
                  {t("map.title")}
                </h3>
                <div className="map-container h-64 rounded-lg overflow-hidden">
                  <SimpleMap
                    mode="detail"
                    highlightCoordinate={item.coordinates}
                    contentItems={
                      item.coordinates
                        ? [
                            {
                              id: item.id,
                              title: item.title,
                              type: item.type,
                              coordinates: item.coordinates,
                              isSelected: true,
                              isHovered: false,
                            },
                          ]
                        : []
                    }
                    height="100%"
                    initialZoom={item.coordinates ? 2 : 1}
                    maxZoom={8}
                    minZoom={0.3}
                    showZoomControls={true}
                  />
                </div>
              </div>
            )}

            {/* Related Items */}
            {relatedItems.length > 0 && (
              <div
                className="p-6 rounded-lg backdrop-blur-md bg-white/10 border border-white/20"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("detail.related")}
                </h3>
                <div className="overflow-x-auto">
                  <div
                    className="flex gap-4 pb-2"
                    style={{ minWidth: "max-content" }}
                  >
                    {relatedItems.map((relatedItem) => (
                      <div key={relatedItem.id} className="w-64 flex-shrink-0">
                        <UnifiedCard
                          item={relatedItem}
                          showTags={true}
                          variant="compact"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Detail;
