import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import useTagFilter from "../hooks/useTagFilter";
import { events } from "../data/events";
import CardList from "../components/common/CardList";
import TagFilter from "../components/features/tag/TagFilter";
import CardGrid from "../components/common/CardGrid";
import EventHeader from "../components/pages/events/EventHeader";

const EventsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Convert events data to SearchResult format
  const eventItems = events.map((event) => ({
    ...event,
    type: "event" as const,
  }));

  // Use tag filtering hook
  const { filteredItems, activeTag, setActiveTag, allTags } =
    useTagFilter(eventItems);

  // Handle tag click from filter
  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
  };

  // Get link path for event details
  const getLinkPath = (item: (typeof filteredItems)[0]) => `/events/${item.id}`;

  // Handle card click (alternative to link navigation)
  const handleCardClick = (item: (typeof filteredItems)[0]) => {
    navigate(getLinkPath(item));
  };

  return (
    <div className="events-page pb-8">
      {/* Events Header */}
      <EventHeader />

      <div className="container mx-auto px-4">
        {/* Tag Filter */}
        <div className="mb-6">
          <TagFilter
            tags={allTags}
            activeTag={activeTag}
            onTagClick={handleTagClick}
            filterPath="/events"
          />
        </div>

        {/* Events List */}
        <CardGrid
          title={
            activeTag
              ? `${t("events.filteredBy")}: ${activeTag}`
              : t("events.allEvents")
          }
        >
          <CardList
            items={filteredItems}
            isLoading={false}
            emptyMessage={t("events.noEvents")}
            getLinkPath={getLinkPath}
            showBookmarkButton
            onCardClick={handleCardClick}
          />
        </CardGrid>
      </div>
    </div>
  );
};

export default EventsPage;
