import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ItemTypeIcon from "../components/common/ItemTypeIcon";
import PillButton from "../components/common/PillButton";
import Tag from "../components/common/Tag";
import VectorMap from "../components/map/VectorMap";
import { useBookmark } from "../context/BookmarkContext";
import { useLanguage } from "../context/LanguageContext";
import eventsJson from "../data/events.json";
import exhibitsJson from "../data/exhibits.json";
import sponsorsJson from "../data/sponsors.json";
import stallsJson from "../data/stalls.json";
import type { Event, Exhibit, Item, Sponsor, Stall } from "../types/common";
const events = eventsJson as Event[];
const exhibits = exhibitsJson as Exhibit[];
const sponsors = sponsorsJson as Sponsor[];
const stalls = stallsJson as Stall[];
import UnifiedCard from "../shared/components/ui/UnifiedCard";

const Detail = () => {
  const { id, type } = useParams<{ type: string; id: string }>();
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
      case "event": {
        foundItem = events.find((event) => event.id === id);
        break;
      }
      case "exhibit": {
        foundItem = exhibits.find((exhibit) => exhibit.id === id);
        break;
      }
      case "stall": {
        foundItem = stalls.find((stall) => stall.id === id);
        break;
      }
      case "sponsor": {
        foundItem = sponsors.find((sponsor) => sponsor.id === id);
        break;
      }
      default: {
        setError(`Invalid type: ${type}`);
        setLoading(false);
        return;
      }
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
              otherItem.tags.some((tag) => foundItem!.tags?.includes(tag)),
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <p
              className="mb-6 text-lg"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("errors.itemNotFound")}
            </p>
            <button
              onClick={handleBack}
              className="rounded-lg px-6 py-3 font-medium transition-all duration-200 hover:scale-105"
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
            className="rounded-lg p-6"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            <h3
              className="mb-4 text-xl font-semibold"
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
            className="rounded-lg p-6"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            <h3
              className="mb-4 text-xl font-semibold"
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
            className="rounded-lg p-6"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            <h3
              className="mb-4 text-xl font-semibold"
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
                <div className="mt-2 flex flex-wrap gap-2">
                  {stallItem.products.map((product, index) => (
                    <span
                      key={index}
                      className="rounded px-2 py-1 text-sm"
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
            className="rounded-lg p-6"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            <h3
              className="mb-4 text-xl font-semibold"
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
            </div>
          </div>
        );
      }
      default: {
        return null;
      }
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case "event": {
        return t("detail.event");
      }
      case "exhibit": {
        return t("detail.exhibit");
      }
      case "stall": {
        return t("detail.stall");
      }
      case "sponsor": {
        return t("detail.sponsor");
      }
      default: {
        return "";
      }
    }
  };

  return (
    <div className="min-h-screen">
      <section
        className="section"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <PillButton onClick={handleBack} variant="secondary">
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                <ArrowLeft className="h-4 w-4" />
                <span>{t("detail.back")}</span>
              </span>
            </PillButton>

            <button
              onClick={handleBookmarkToggle}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                isBookmarked(item.id)
                  ? "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500"
                  : "border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] focus:ring-[var(--primary-color)]"
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
            <div className="mb-6 flex items-center gap-4">
              <ItemTypeIcon type={item.type} size="large" />
              <span
                className="rounded-full px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                }}
              >
                {getTypeLabel()}
              </span>
            </div>

            <h1
              className="mb-6 text-3xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {item.title}
            </h1>

            <div
              className="grid grid-cols-1 gap-4 rounded-lg p-6 md:grid-cols-3"
              style={{ backgroundColor: "var(--color-bg-secondary)" }}
            >
              <div className="flex items-center gap-2">
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
              <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-auto w-full object-cover"
                  style={{ backgroundColor: "var(--color-bg-secondary)" }}
                />
              </div>
            )}

            {/* Location Information */}
            <div
              className="rounded-lg p-6"
              style={{ backgroundColor: "var(--color-bg-secondary)" }}
            >
              <h3
                className="mb-4 flex items-center gap-2 text-xl font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
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
              className="rounded-lg p-6"
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
                  className="mb-4 text-xl font-semibold"
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
            {(item.location || item.coordinates) && item.type !== "sponsor" && (
              <div
                className="rounded-lg border border-white/20 bg-white/10 p-6"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <h3
                  className="mb-4 flex items-center gap-2 text-xl font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("map.title")}
                </h3>
                <div className="map-container h-64 overflow-hidden rounded-lg">
                  <VectorMap
                    key={`detail-map-${item.id}`}
                    mode="detail"
                    highlightPoint={item.coordinates}
                    points={
                      item.coordinates
                        ? [
                            {
                              contentItem: item,
                              coordinates: item.coordinates,
                              id: item.id,
                              isHovered: false,
                              isSelected: true,
                              onClick: () => {},
                              onHover: () => {},
                              title: item.title,
                              type: item.type as
                                | "event"
                                | "exhibit"
                                | "stall"
                                | "location",
                            },
                          ]
                        : []
                    }
                    height="100%"
                    maxZoom={8}
                    minZoom={0.3}
                    showControls={true}
                  />
                </div>
              </div>
            )}

            {/* Related Items */}
            {relatedItems.length > 0 && (
              <div
                className="rounded-lg border border-white/20 bg-white/10 p-6"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <h3
                  className="mb-4 text-xl font-semibold"
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
