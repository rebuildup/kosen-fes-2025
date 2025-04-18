import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { events } from "../data/events";
import { exhibitions } from "../data/exhibitions";
import { foodStalls } from "../data/foodStalls";
import { locations } from "../data/locations";
import { SearchResult } from "../types/common";
import DetailHeader from "../components/pages/detail/DetailHeader";
import DetailContent from "../components/pages/detail/DetailContent";
import DetailMap from "../components/pages/detail/DetailMap";
import RelatedItems from "../components/pages/detail/RelatedItems";

const DetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<SearchResult | null>(null);
  const [itemType, setItemType] = useState<
    "event" | "exhibition" | "foodStall" | null
  >(null);
  const [relatedItems, setRelatedItems] = useState<SearchResult[]>([]);
  const [locationInfo, setLocationInfo] = useState<any>(null);

  // Determine which collection we're looking at based on the URL path
  useEffect(() => {
    const path = window.location.pathname;

    let type: "event" | "exhibition" | "foodStall" | null = null;
    let collection;

    if (path.includes("/events/")) {
      type = "event";
      collection = events;
    } else if (path.includes("/exhibitions/")) {
      type = "exhibition";
      collection = exhibitions;
    } else if (path.includes("/food-stalls/")) {
      type = "foodStall";
      collection = foodStalls;
    }

    setItemType(type);

    if (type && collection && id) {
      const foundItem = collection.find((item) => item.id === id);

      if (foundItem) {
        setItem({
          ...foundItem,
          type,
        });

        // Find location info
        if (foundItem.location) {
          const location = locations.find(
            (loc) => loc.name === foundItem.location
          );
          setLocationInfo(location || null);
        }

        // Find related items (same tags)
        if (foundItem.tags && foundItem.tags.length > 0) {
          const allItems = [
            ...events.map((event) => ({ ...event, type: "event" as const })),
            ...exhibitions.map((exhibition) => ({
              ...exhibition,
              type: "exhibition" as const,
            })),
            ...foodStalls.map((foodStall) => ({
              ...foodStall,
              type: "foodStall" as const,
            })),
          ];

          // Find items with matching tags
          const related = allItems
            .filter(
              (i) =>
                i.id !== id &&
                i.tags &&
                i.tags.some((tag) => foundItem.tags?.includes(tag))
            )
            .slice(0, 6); // Limit to 6 related items

          setRelatedItems(related);
        }
      } else {
        // Item not found, navigate to 404
        navigate("/404");
      }
    }
  }, [id, navigate]);

  // If no item is found, show loading
  if (!item) {
    return (
      <div className="detail-page-loading container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page pb-12">
      {/* Detail Header */}
      <DetailHeader item={item} />

      <div className="container mx-auto px-4">
        {/* Detail Content */}
        <DetailContent item={item} />

        {/* Map Section */}
        {item.location && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              {t("detail.location")}
            </h2>
            <DetailMap location={item.location} locationInfo={locationInfo} />
          </div>
        )}

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6">
              {t("detail.relatedItems")}
            </h2>
            <RelatedItems items={relatedItems} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
