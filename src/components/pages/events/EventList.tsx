import React from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import { SearchResult } from "../../../types/common";
import CardList from "../../common/CardList";

interface EventListProps {
  events: SearchResult[];
  isLoading?: boolean;
  className?: string;
}

const EventList: React.FC<EventListProps> = ({
  events,
  isLoading = false,
  className = "",
}) => {
  const { t } = useLanguage();

  // Get link path for event details
  const getLinkPath = (item: SearchResult) => `/events/${item.id}`;

  return (
    <div className={`event-list ${className}`}>
      <CardList
        items={events}
        isLoading={isLoading}
        emptyMessage={t("events.noEvents")}
        getLinkPath={getLinkPath}
        showBookmarkButton
      />
    </div>
  );
};

export default EventList;
