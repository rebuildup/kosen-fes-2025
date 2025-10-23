import type { ReactNode } from "react";

export function highlightSearchQuery(text: string, query: string): ReactNode {
  if (!query.trim() || !text) return <>{text}</>;
  try {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={`highlight-${i}-${part.slice(0, 10)}`}
              className="rounded bg-gradient-to-r from-[var(--accent-yellow)] to-[var(--accent-orange)] px-1 text-[var(--text-primary)]"
            >
              {part}
            </mark>
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
}
