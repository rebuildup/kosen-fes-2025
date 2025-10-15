import type { ReactNode } from "react";

import type { Language } from "./translations";

/**
 * Format a date string to a localized display format
 */
export const formatDate = (dateStr: string, language: Language): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
      day: "numeric",
      month: "long",
      weekday: "long",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
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
  type: "event" | "exhibit" | "stall" | "sponsor", // Add "sponsor" here
  translations: Record<string, string | undefined>,
): string => {
  switch (type) {
    case "event": {
      return translations["detail.event"] || "Event";
    }
    case "exhibit": {
      return translations["detail.exhibit"] || "Exhibit";
    }
    case "stall": {
      return translations["detail.stall"] || "Stall";
    }
    case "sponsor": {
      // Add this case
      return translations["detail.sponsor"] || "Sponsor";
    }
    default: {
      return type;
    }
  }
};

/**
 * Safely highlight text with a search query
 */
export const highlightSearchQuery = (
  text: string,
  query: string,
): ReactNode => {
  if (!query.trim() || !text) return <>{text}</>;

  try {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i}>{part}</mark>
          ) : (
            part
          ),
        )}
      </>
    );
  } catch (error) {
    console.error("Error highlighting text:", error);
    return <>{text}</>;
  }
};
