import { Link } from "react-router-dom";
import { Event } from "../../types/common";
import { useLanguage } from "../../context/LanguageContext";
import { useBookmark } from "../../context/BookmarkContext";
import Tag from "../common/Tag";

interface EventCardProps {
  event: Event;
  showDetails?: boolean;
}

const EventCard = ({ event, showDetails = false }: EventCardProps) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${mins} min`;
    }
  };

  return (
    <div className="event-card">
      <Link to={`/detail/event/${event.id}`} className="event-card-link">
        <div className="event-card-image">
          <img
            src={event.imageUrl || "/images/placeholder-event.jpg"}
            alt={event.title}
            className="event-image"
          />

          <button
            className={`event-bookmark ${
              isBookmarked(event.id) ? "bookmarked" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark(event.id);
            }}
            aria-label={
              isBookmarked(event.id)
                ? t("actions.removeBookmark")
                : t("actions.bookmark")
            }
          >
            {isBookmarked(event.id) ? "★" : "☆"}
          </button>
        </div>

        <div className="event-card-content">
          <h3 className="event-title">{event.title}</h3>

          {showDetails && (
            <p className="event-description">{event.description}</p>
          )}

          <div className="event-meta">
            <div className="event-date-time">
              <span className="event-icon">🕒</span>
              <span>
                {event.date} | {event.time}
              </span>
            </div>

            <div className="event-location">
              <span className="event-icon">📍</span>
              <span>{event.location}</span>
            </div>

            <div className="event-organizer">
              <span className="event-icon">👥</span>
              <span>
                {t("detail.organizer")}: {event.organizer}
              </span>
            </div>

            <div className="event-duration">
              <span className="event-duration-icon">⏱️</span>
              <span>{formatDuration(event.duration)}</span>
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="event-tags">
              {event.tags.slice(0, 3).map((tag) => (
                <Tag key={tag} tag={tag} size="small" />
              ))}
              {event.tags.length > 3 && (
                <span className="event-tags-more">
                  +{event.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
