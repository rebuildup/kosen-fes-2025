import type React from "react";
import { useMemo } from "react";

import eventsJson from "../../data/events.json";
import exhibitsJson from "../../data/exhibits.json";
import stallsJson from "../../data/stalls.json";
import type { Event, Exhibit, Item, Stall } from "../../types/common";
import VectorMap from "./VectorMap";

interface Coordinate {
  x: number;
  y: number;
}

interface LocationMarker {
  id: string;
  location: string;
  coordinates: Coordinate;
  isSelected?: boolean;
  isHovered?: boolean;
}

type PointType = "event" | "exhibit" | "stall" | "location";

interface ContentItem {
  id: string;
  title: string;
  type: PointType;
  coordinates: Coordinate;
  isSelected?: boolean;
  isHovered?: boolean;
  contentItem?: Item; // 実際のコンテンツデータ
}

interface VectorMapAdapterProps {
  // 従来のUnifiedMapプロパティとの互換性
  mode?: "display" | "detail" | "interactive";
  height?: string;
  className?: string;

  // マーカーとコンテンツ（従来形式）
  markers?: LocationMarker[];
  contentItems?: ContentItem[];

  // ハイライト
  highlightCoordinate?: Coordinate;
  selectedCoordinate?: Coordinate | null;

  // インタラクション
  onCoordinateSelect?: (coordinate: Coordinate) => void;
  onLocationHover?: (location: string | null) => void;
  onLocationSelect?: (location: string | null) => void;

  // 設定
  showZoomControls?: boolean;
  allowCoordinateSelection?: boolean;
  initialZoom?: number;
  maxZoom?: number;
  minZoom?: number;
}

const NOOP = () => {};

const VectorMapAdapter: React.FC<VectorMapAdapterProps> = ({
  allowCoordinateSelection = false,
  className = "",
  contentItems = [],
  height = "400px",
  highlightCoordinate,
  markers = [],
  // initialZoom = 1,
  maxZoom = 10,
  minZoom = 0.1,
  mode = "display",
  onCoordinateSelect,
  onLocationHover,
  onLocationSelect,
  showZoomControls = true,
}) => {
  // 全てのコンテンツデータを取得
  const allContentData = useMemo(() => {
    const events = eventsJson as Event[];
    const exhibits = exhibitsJson as Exhibit[];
    const stalls = stallsJson as Stall[];
    const mapEvents = events.filter((event) => event.showOnMap);
    return [...mapEvents, ...stalls, ...exhibits];
  }, []);

  // 従来のマーカーとコンテンツを新しいInteractivePointsに変換
  const convertToInteractivePoints = () => {
    const points: Array<{
      id: string;
      coordinates: Coordinate;
      title: string;
      type: PointType;
      isSelected?: boolean;
      isHovered?: boolean;
      contentItem?: Item;
      color?: string;
      size?: number;
      onClick: () => void;
      onHover: (hovered: boolean) => void;
    }> = [];

    // 従来のcontentItemsを変換（互換性のため）
    for (const item of contentItems) {
      // 実際のコンテンツデータを検索
      const actualContentItem = allContentData.find((content) => {
        return content.id === item.id;
      });

      points.push({
        contentItem: actualContentItem || item.contentItem,
        coordinates: item.coordinates,
        id: item.id,
        isHovered: item.isHovered,
        isSelected: item.isSelected,
        onClick: () => {
          if (onCoordinateSelect) {
            onCoordinateSelect(item.coordinates);
          }
        },
        onHover: () => {
          // ホバー処理（将来の拡張用）
        },
        title: item.title,
        type: item.type,
      });
    }

    // データから直接すべてのコンテンツポイントを作成（座標がある場合）
    for (const contentItem of allContentData) {
      const alreadyIncluded = contentItems.some((ci) => ci.id === contentItem.id);
      if (contentItem.coordinates && !alreadyIncluded) {
        points.push({
          contentItem: contentItem,
          coordinates: contentItem.coordinates,
          id: contentItem.id,
          onClick: () => {
            if (onCoordinateSelect && contentItem.coordinates) {
              onCoordinateSelect(contentItem.coordinates);
            }
          },
          onHover: () => {
            // ホバー処理（将来の拡張用）
          },
          title: contentItem.title,
          type: contentItem.type as PointType,
        });
      }
    }

    // 位置マーカーを変換
    for (const marker of markers) {
      points.push({
        color: marker.isSelected ? "#405de6" : "#0066cc",
        coordinates: marker.coordinates,
        id: marker.id,
        isHovered: marker.isHovered,
        isSelected: marker.isSelected,
        onClick: () => {
          if (onLocationSelect) {
            onLocationSelect(marker.location);
          }
        },
        onHover: (hovered: boolean) => {
          if (onLocationHover) {
            onLocationHover(hovered ? marker.location : null);
          }
        },
        size: 12,
        title: marker.location,
        type: "location",
      });
    }

    return points;
  };

  const handleMapClick = (coordinate: Coordinate) => {
    if (allowCoordinateSelection && onCoordinateSelect) {
      onCoordinateSelect(coordinate);
    }
  };

  return (
    <VectorMap
      mode={mode}
      height={height}
      className={className}
      points={convertToInteractivePoints()}
      highlightPoint={highlightCoordinate}
      onPointClick={NOOP}
      onPointHover={NOOP}
      onMapClick={handleMapClick}
      showControls={showZoomControls}
      maxZoom={maxZoom}
      minZoom={minZoom}
    />
  );
};

export default VectorMapAdapter;
