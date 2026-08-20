import { useCallback, useRef, useState } from "react";
import type { TouchEvent } from "react";

const PULL_THRESHOLD = 64;
const MAX_PULL = 96;
const PULL_RESISTANCE = 0.5;

interface UsePullToRefreshOptions {
  onRefresh: () => void | Promise<void>;
  disabled?: boolean;
}

export function usePullToRefresh<T extends HTMLElement>({ onRefresh, disabled }: UsePullToRefreshOptions) {
  const containerRef = useRef<T | null>(null);
  const startY = useRef<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onTouchStart = useCallback(
    (event: TouchEvent<T>) => {
      if (disabled || refreshing || (containerRef.current?.scrollTop ?? 0) > 0) {
        startY.current = null;
        return;
      }
      startY.current = event.touches[0].clientY;
      setIsDragging(true);
    },
    [disabled, refreshing],
  );

  const onTouchMove = useCallback((event: TouchEvent<T>) => {
    if (startY.current === null) {
      return;
    }
    const delta = event.touches[0].clientY - startY.current;
    setPullDistance(delta > 0 ? Math.min(delta * PULL_RESISTANCE, MAX_PULL) : 0);
  }, []);

  const onTouchEnd = useCallback(async () => {
    if (startY.current === null) {
      return;
    }
    startY.current = null;
    setIsDragging(false);

    if (pullDistance < PULL_THRESHOLD) {
      setPullDistance(0);
      return;
    }

    setRefreshing(true);
    setPullDistance(PULL_THRESHOLD);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
      setPullDistance(0);
    }
  }, [pullDistance, onRefresh]);

  return {
    containerRef,
    pullDistance,
    refreshing,
    isDragging,
    threshold: PULL_THRESHOLD,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  } as const;
}
