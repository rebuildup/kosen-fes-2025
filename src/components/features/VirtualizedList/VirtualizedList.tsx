// src/components/features/VirtualizedList/VirtualizedList.tsx
import React, { useRef, useState, useEffect } from "react";
import styles from "./VirtualizedList.module.css";

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  className?: string;
}

// シンプルな仮想化リスト実装（@tanstack/react-virtualの代わり）
function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  className = "",
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  useEffect(() => {
    const handleScroll = () => {
      if (!parentRef.current) return;

      const { scrollTop, clientHeight } = parentRef.current;
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(
        items.length - 1,
        Math.floor((scrollTop + clientHeight) / itemHeight) + 5 // バッファを追加
      );

      setVisibleRange({ start: Math.max(0, start - 5), end: end + 5 }); // バッファを追加
    };

    const container = parentRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll(); // 初期状態を設定
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [itemHeight, items.length]);

  const totalHeight = items.length * itemHeight;
  const visibleItems = items.slice(visibleRange.start, visibleRange.end + 1);
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div ref={parentRef} className={`${styles.virtualList} ${className}`}>
      <div
        style={{
          height: `${totalHeight}px`,
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{
                height: `${itemHeight}px`,
              }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualizedList;
