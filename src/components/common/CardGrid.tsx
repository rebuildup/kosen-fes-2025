import { useMemo, useState, useEffect } from "react";
import { MonitorX } from "lucide-react";
import { Item } from "../../types/common";
import UnifiedCard from "../../shared/components/ui/UnifiedCard";
import { useLanguage } from "../../context/LanguageContext";
import LoadingIndicator from "../../shared/components/feedback/LoadingIndicator";

// Update the filterType prop type
interface CardGridProps {
  items: Item[];
  variant?: "default" | "compact" | "grid" | "list";
  showTags?: boolean;
  showDescription?: boolean;
  emptyMessage?: React.ReactNode;
  onCardClick?: (item: Item) => void;
  highlightText?: (text: string) => React.ReactNode;
  className?: string;
  columns?: number;
  filterType?: "event" | "exhibit" | "stall" | "sponsor" | "all"; // Add "sponsor" here
  isLoading?: boolean;
}

const CardGrid = ({
  items,
  variant = "default",
  showTags = false,
  showDescription = false,
  emptyMessage,
  onCardClick,
  highlightText,
  className = "",
  columns,
  filterType = "all",
  isLoading = false,
}: CardGridProps) => {
  const { t } = useLanguage();

  // Animation state for smooth transitions
  const [animationKey, setAnimationKey] = useState(0);
  const [prevItemsHash, setPrevItemsHash] = useState<string>("");
  const [animationType, setAnimationType] = useState<"variant" | "content">(
    "variant"
  );

  // Filter items by type if specified
  const filteredItems = useMemo(() => {
    if (filterType === "all") return items;
    return items.filter((item) => item.type === filterType);
  }, [items, filterType]);

  // Create a hash of current items to detect changes
  const currentItemsHash = useMemo(() => {
    return filteredItems.map((item) => item.id).join(",");
  }, [filteredItems]);

  // Trigger animation when items change (category/filter change)
  useEffect(() => {
    const shouldAnimate =
      prevItemsHash !== "" && prevItemsHash !== currentItemsHash;

    if (shouldAnimate) {
      setAnimationType("content");
      setAnimationKey((prev) => prev + 1);

      setPrevItemsHash(currentItemsHash);
    } else {
      setPrevItemsHash(currentItemsHash);
    }
  }, [currentItemsHash, prevItemsHash]);

  // Trigger animation when variant changes
  useEffect(() => {
    setAnimationType("variant");
    setAnimationKey((prev) => prev + 1);
  }, [variant]);

  // Get default empty message based on filter type
  const getDefaultEmptyMessage = () => {
    switch (filterType) {
      case "event":
        return t("events.noEvents");
      case "exhibit":
        return t("exhibits.noExhibits");
      case "stall":
        return t("exhibits.noStalls");
      default:
        return t("common.noItems");
    }
  };

  // Generate grid style based on columns prop
  const gridStyle = columns
    ? {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }
    : undefined;

  // Get grid classes based on variant
  const getGridClasses = () => {
    switch (variant) {
      case "compact":
        return "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3";
      case "list":
        return "space-y-4";
      case "grid":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <LoadingIndicator size="large" />
      </div>
    );
  }

  // If no items and we have an empty message
  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <MonitorX className="w-16 h-16 mx-auto" />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {emptyMessage || getDefaultEmptyMessage()}
        </p>
      </div>
    );
  }

  // Calculate progressive delay that gets smaller for later items
  const calculateDelay = (index: number, totalItems: number): number => {
    const baseDelay = variant === "list" ? 0.08 : 0.05;
    const minDelay = variant === "list" ? 0.02 : 0.015;

    // For small lists (<=10 items), use regular spacing
    if (totalItems <= 10) {
      return index * baseDelay;
    }

    // For larger lists, use progressive delay reduction
    const progressFactor = index / (totalItems - 1);

    // Smooth curve that starts at baseDelay and approaches minDelay
    // Using exponential decay curve: starts high, decreases gradually
    const curve = Math.pow(1 - progressFactor, 0.8);
    const delay = minDelay + (baseDelay - minDelay) * curve;

    // Add cumulative delay based on index but with diminishing returns
    const cumulativeBase = index * minDelay * 0.3;

    return delay + cumulativeBase;
  };

  return (
    <div className={`${getGridClasses()} ${className}`} style={gridStyle}>
      {filteredItems.map((item, index) => {
        const getAnimationClass = () => {
          if (animationType === "content") {
            return "animate-category-change";
          }
          return variant === "list"
            ? "animate-card-enter-list"
            : "animate-card-enter";
        };

        return (
          <div
            key={`${animationKey}-${item.id}`}
            className={getAnimationClass()}
            style={{
              animationDelay: `${calculateDelay(index, filteredItems.length)}s`,
              animationFillMode: "both",
            }}
          >
            <UnifiedCard
              item={item}
              variant={variant}
              showTags={showTags}
              showDescription={showDescription}
              highlightText={highlightText}
              onClick={onCardClick ? () => onCardClick(item) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CardGrid;
