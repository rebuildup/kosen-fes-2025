import { ReactNode } from "react";
import { Language } from "./translations";

/**
 * Format a date string to a localized display format
 */
export const formatDate = (dateStr: string, language: Language): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateStr;
  }
};

/**
 * Format duration from minutes to a human-readable string
 */
export const formatDuration = (minutes: number, language: Language): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (language === "ja") {
    if (hours === 0) {
      return `${mins}分`;
    } else if (mins === 0) {
      return `${hours}時間`;
    } else {
      return `${hours}時間${mins}分`;
    }
  } else {
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${mins} min`;
    }
  }
};

/**
 * Get type label based on item type and language
 */
export const getTypeLabel = (
  type: "event" | "exhibit" | "stall",
  translations: Record<string, any>
): string => {
  switch (type) {
    case "event":
      return translations["detail.event"] || "Event";
    case "exhibit":
      return translations["detail.exhibit"] || "Exhibit";
    case "stall":
      return translations["detail.stall"] || "Stall";
    default:
      return type;
  }
};

/**
 * Safely highlight text with a search query
 */
export const highlightSearchQuery = (
  text: string,
  query: string
): ReactNode => {
  if (!query.trim() || !text) return <>{text}</>;

  try {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="search-highlight">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  } catch (e) {
    console.error("Error highlighting text:", e);
    return <>{text}</>;
  }
};
