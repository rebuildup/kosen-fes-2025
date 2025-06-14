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
    <div>
      <Link to={`/detail/event/${event.id}`}>
        <div>
          <img
            src={event.imageUrl || "/images/placeholder-event.jpg"}
            alt={event.title}
          />

          <button
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

        <div>
          <h3>{event.title}</h3>

          {showDetails && (
            <p>{event.description}</p>
          )}

          <div>
            <div>
              <span>🕒</span>
              <span>
                {event.date} | {event.time}
              </span>
            </div>

            <div>
              <span>📍</span>
              <span>{event.location}</span>
            </div>

            <div>
              <span>👥</span>
              <span>
                {t("detail.organizer")}: {event.organizer}
              </span>
            </div>

            <div>
              <span>⏱️</span>
              <span>{formatDuration(event.duration)}</span>
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div>
              {event.tags.slice(0, 3).map((tag) => (
                <Tag key={tag} tag={tag} size="small" />
              ))}
              {event.tags.length > 3 && (
                <span>
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
