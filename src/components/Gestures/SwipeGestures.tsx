"use client";

import { useEffect, useCallback, useState } from 'react';

interface SwipeGestureProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  threshold?: number;
  className?: string;
  children: React.ReactNode;
}

export function SwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  threshold = 50,
  className = "",
  children
}: SwipeGestureProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number; time: number } | null>(null);
  const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
    setTouchEnd(null);

    // Обработка pinch жеста
    if (e.touches.length === 2) {
      const distance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      setLastPinchDistance(distance);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });

    // Обработка pinch жеста
    if (e.touches.length === 2 && lastPinchDistance && onPinch) {
      const distance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      const scale = distance / lastPinchDistance;
      onPinch(scale);
    }
  }, [lastPinchDistance, onPinch]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const deltaTime = touchEnd.time - touchStart.time;

    // Проверяем, что жест был быстрым (менее 300ms)
    if (deltaTime > 300) return;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Определяем направление свайпа
    if (absDeltaX > absDeltaY) {
      // Горизонтальный свайп
      if (absDeltaX > threshold) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    } else {
      // Вертикальный свайп
      if (absDeltaY > threshold) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setLastPinchDistance(null);
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

// Компонент для жестов навигации
interface NavigationGesturesProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onRefresh?: () => void;
  className?: string;
  children: React.ReactNode;
}

export function NavigationGestures({
  onNext,
  onPrevious,
  onRefresh,
  className = "",
  children
}: NavigationGesturesProps) {
  const handleSwipeLeft = useCallback(() => {
    onNext?.();
  }, [onNext]);

  const handleSwipeRight = useCallback(() => {
    onPrevious?.();
  }, [onPrevious]);

  const handleSwipeDown = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  return (
    <SwipeGesture
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onSwipeDown={handleSwipeDown}
      className={className}
    >
      {children}
    </SwipeGesture>
  );
}

// Хук для определения типа устройства
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setIsTouchDevice(hasTouch);

      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { deviceType, isTouchDevice };
};

// Компонент для индикатора жестов
interface GestureIndicatorProps {
  gesture: 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'pinch';
  className?: string;
}

export function GestureIndicator({ gesture, className = "" }: GestureIndicatorProps) {
  const getGestureIcon = () => {
    switch (gesture) {
      case 'swipe-left':
        return '←';
      case 'swipe-right':
        return '→';
      case 'swipe-up':
        return '↑';
      case 'swipe-down':
        return '↓';
      case 'pinch':
        return '🤏';
      default:
        return '👆';
    }
  };

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-400 ${className}`}>
      <span className="text-lg">{getGestureIcon()}</span>
      <span className="capitalize">{gesture.replace('-', ' ')}</span>
    </div>
  );
}

// Компонент для обучения жестам
interface GestureTutorialProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

export function GestureTutorial({ isVisible, onClose, className = "" }: GestureTutorialProps) {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-white mb-4">Жесты для навигации</h3>
        
        <div className="space-y-3 text-gray-300">
          <GestureIndicator gesture="swipe-left" />
          <span className="text-sm">Следующая страница</span>
          
          <GestureIndicator gesture="swipe-right" />
          <span className="text-sm">Предыдущая страница</span>
          
          <GestureIndicator gesture="swipe-down" />
          <span className="text-sm">Обновить</span>
          
          <GestureIndicator gesture="pinch" />
          <span className="text-sm">Масштабирование</span>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}

// Хук для управления жестами
export const useGestures = () => {
  const [gesturesEnabled, setGesturesEnabled] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gesturesEnabled');
    if (saved !== null) {
      setGesturesEnabled(JSON.parse(saved));
    }

    const tutorialShown = localStorage.getItem('gestureTutorialShown');
    if (!tutorialShown) {
      setShowTutorial(true);
    }
  }, []);

  const toggleGestures = useCallback(() => {
    setGesturesEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('gesturesEnabled', JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const closeTutorial = useCallback(() => {
    setShowTutorial(false);
    localStorage.setItem('gestureTutorialShown', 'true');
  }, []);

  return {
    gesturesEnabled,
    showTutorial,
    toggleGestures,
    closeTutorial,
  };
};