import React, { useMemo } from "react";
import VectorMap from "./VectorMap";
import { events } from "../../data/events";
import { stalls } from "../../data/stalls";
import { exhibits } from "../../data/exhibits";
import { Item } from "../../types/common";

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

interface ContentItem {
  id: string;
  title: string;
  type: string;
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

const VectorMapAdapter: React.FC<VectorMapAdapterProps> = ({
  mode = "display",
  height = "400px",
  className = "",
  markers = [],
  contentItems = [],
  highlightCoordinate,
  onCoordinateSelect,
  onLocationHover,
  onLocationSelect,
  showZoomControls = true,
  allowCoordinateSelection = false,
  // initialZoom = 1,
  maxZoom = 10,
  minZoom = 0.1,
}) => {
  // 全てのコンテンツデータを取得
  const allContentData = useMemo(() => {
    return [...events, ...stalls, ...exhibits];
  }, []);

  // 従来のマーカーとコンテンツを新しいInteractivePointsに変換
  const convertToInteractivePoints = () => {
    const points: Array<{
      id: string;
      coordinates: Coordinate;
      title: string;
      type: "event" | "exhibit" | "stall" | "location";
      isSelected?: boolean;
      isHovered?: boolean;
      contentItem?: Item;
      color?: string;
      size?: number;
      onClick: () => void;
      onHover: (hovered: boolean) => void;
    }> = [];

    // 従来のcontentItemsを変換（互換性のため）
    contentItems.forEach((item) => {
      // 実際のコンテンツデータを検索
      const actualContentItem = allContentData.find(
        (content) => content.id === item.id
      );

      points.push({
        id: item.id,
        coordinates: item.coordinates,
        title: item.title,
        type: item.type as "event" | "exhibit" | "stall" | "location",
        isSelected: item.isSelected,
        isHovered: item.isHovered,
        contentItem: actualContentItem || item.contentItem,
        onClick: () => {
          if (onCoordinateSelect) {
            onCoordinateSelect(item.coordinates);
          }
        },
        onHover: () => {
          // ホバー処理（将来の拡張用）
        },
      });
    });

    // データから直接すべてのコンテンツポイントを作成（座標がある場合）
    allContentData.forEach((contentItem) => {
      if (
        contentItem.coordinates &&
        !contentItems.find((item) => item.id === contentItem.id)
      ) {
        points.push({
          id: contentItem.id,
          coordinates: contentItem.coordinates,
          title: contentItem.title,
          type: contentItem.type as "event" | "exhibit" | "stall" | "location",
          contentItem: contentItem,
          onClick: () => {
            if (onCoordinateSelect && contentItem.coordinates) {
              onCoordinateSelect(contentItem.coordinates);
            }
          },
          onHover: () => {
            // ホバー処理（将来の拡張用）
          },
        });
      }
    });

    // 位置マーカーを変換
    markers.forEach((marker) => {
      points.push({
        id: marker.id,
        coordinates: marker.coordinates,
        title: marker.location,
        type: "location" as const,
        isSelected: marker.isSelected,
        isHovered: marker.isHovered,
        color: marker.isSelected ? "#405de6" : "#0066cc",
        size: 12,
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
      });
    });

    return points;
  };

  const handleMapClick = (coordinate: Coordinate) => {
    if (allowCoordinateSelection && onCoordinateSelect) {
      onCoordinateSelect(coordinate);
    }
  };

  const handlePointClick = () => {
    // ポイントクリック処理は個別のonClick関数で処理される
  };

  const handlePointHover = () => {
    // ポイントホバー処理は個別のonHover関数で処理される
  };

  return (
    <VectorMap
      mode={mode}
      height={height}
      className={className}
      points={convertToInteractivePoints()}
      highlightPoint={highlightCoordinate}
      onPointClick={handlePointClick}
      onPointHover={handlePointHover}
      onMapClick={handleMapClick}
      showControls={showZoomControls}
      maxZoom={maxZoom}
      minZoom={minZoom}
    />
  );
};

export default VectorMapAdapter;
