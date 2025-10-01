"use client";

import { useState, useRef, useMemo } from 'react';
import { INews } from '@/types/news.types';

interface VirtualizedListProps {
  items: INews[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: INews, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

export default function VirtualizedList({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
}: VirtualizedListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Вычисляем видимые элементы
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );

    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex,
      items: items.slice(
        Math.max(0, startIndex - overscan),
        endIndex
      ),
    };
  }, [scrollTop, itemHeight, containerHeight, items, overscan]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Общая высота всех элементов
  const totalHeight = items.length * itemHeight;

  // Смещение для видимых элементов
  const offsetY = visibleItems.startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.items.map((item, index) => {
            const actualIndex = visibleItems.startIndex + index;
            return (
              <div
                key={item.id}
                style={{ height: itemHeight }}
                className="flex items-center"
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}