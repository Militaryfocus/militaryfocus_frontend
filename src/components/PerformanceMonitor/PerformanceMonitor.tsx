"use client";

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  memoryUsage?: number;
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  reportInterval?: number;
}

export default function PerformanceMonitor({
  onMetricsUpdate,
  reportInterval = 5000,
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Проверяем поддержку Performance API
    if (!('performance' in window) || !('PerformanceObserver' in window)) {
      console.warn('Performance API не поддерживается');
      return;
    }

    setIsSupported(true);

    const collectMetrics = (): PerformanceMetrics => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      const lcp = performance.getEntriesByType('largest-contentful-paint')[0];
      
      // Получаем метрики Web Vitals
      const vitals = {
        loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        firstContentfulPaint: fcp ? fcp.startTime : 0,
        largestContentfulPaint: lcp ? lcp.startTime : 0,
        firstInputDelay: 0, // Будет обновлено через PerformanceObserver
        cumulativeLayoutShift: 0, // Будет обновлено через PerformanceObserver
      };

      // Получаем информацию о памяти (если доступно)
      if ('memory' in performance) {
        (vitals as any).memoryUsage = (performance as any).memory.usedJSHeapSize;
      }

      return vitals;
    };

    // Наблюдатель для FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.processingStart && entry.startTime) {
          const fid = entry.processingStart - entry.startTime;
          setMetrics(prev => prev ? { ...prev, firstInputDelay: fid } : null);
        }
      });
    });

    // Наблюдатель для CLS (Cumulative Layout Shift)
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      setMetrics(prev => prev ? { ...prev, cumulativeLayoutShift: clsValue } : null);
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Не удалось запустить PerformanceObserver:', error);
    }

    // Собираем метрики при загрузке
    const initialMetrics = collectMetrics();
    setMetrics(initialMetrics);
    onMetricsUpdate?.(initialMetrics);

    // Периодическое обновление метрик
    const interval = setInterval(() => {
      const currentMetrics = collectMetrics();
      setMetrics(currentMetrics);
      onMetricsUpdate?.(currentMetrics);
    }, reportInterval);

    return () => {
      clearInterval(interval);
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [onMetricsUpdate, reportInterval]);

  // Функция для получения оценки производительности
  const getPerformanceScore = (metrics: PerformanceMetrics): number => {
    let score = 100;

    // Штрафы за медленную загрузку
    if (metrics.loadTime > 3000) score -= 20;
    else if (metrics.loadTime > 2000) score -= 10;

    // Штрафы за медленный FCP
    if (metrics.firstContentfulPaint > 2000) score -= 20;
    else if (metrics.firstContentfulPaint > 1500) score -= 10;

    // Штрафы за медленный LCP
    if (metrics.largestContentfulPaint > 4000) score -= 20;
    else if (metrics.largestContentfulPaint > 2500) score -= 10;

    // Штрафы за высокий CLS
    if (metrics.cumulativeLayoutShift > 0.25) score -= 20;
    else if (metrics.cumulativeLayoutShift > 0.1) score -= 10;

    // Штрафы за высокий FID
    if (metrics.firstInputDelay > 300) score -= 20;
    else if (metrics.firstInputDelay > 100) score -= 10;

    return Math.max(0, score);
  };

  if (!isSupported) {
    return null;
  }

  const score = metrics ? getPerformanceScore(metrics) : 0;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-white z-50">
      <div className="font-semibold mb-2">Производительность</div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Оценка:</span>
          <span className={`font-bold ${
            score >= 90 ? 'text-green-400' :
            score >= 70 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {score}/100
          </span>
        </div>
        {metrics && (
          <>
            <div className="flex justify-between">
              <span>Загрузка:</span>
              <span>{metrics.loadTime.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>FCP:</span>
              <span>{metrics.firstContentfulPaint.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>LCP:</span>
              <span>{metrics.largestContentfulPaint.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>FID:</span>
              <span>{metrics.firstInputDelay.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>CLS:</span>
              <span>{metrics.cumulativeLayoutShift.toFixed(3)}</span>
            </div>
            {metrics.memoryUsage && (
              <div className="flex justify-between">
                <span>Память:</span>
                <span>{(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}