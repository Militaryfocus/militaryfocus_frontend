"use client";

import { useState, useEffect } from 'react';
import { AnimatedCounter } from '../Animations/MicroInteractions';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProgressBar({
  progress,
  label,
  showPercentage = true,
  animated = true,
  color = 'blue',
  size = 'md',
  className = ""
}: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  const getColorClasses = () => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500'
    };
    return colorMap[color];
  };

  const getSizeClasses = () => {
    const sizeMap = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    };
    return sizeMap[size];
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-400">
              <AnimatedCounter value={Math.round(displayProgress)} />%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-700 rounded-full overflow-hidden ${getSizeClasses()}`}>
        <div
          className={`${getColorClasses()} h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: `${displayProgress}%` }}
        >
          {/* Блестящий эффект */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// Компонент для индикатора загрузки с прогрессом
interface LoadingProgressProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
  className?: string;
}

export function LoadingProgress({
  isLoading,
  progress,
  message = "Загрузка...",
  className = ""
}: LoadingProgressProps) {
  if (!isLoading) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
            </div>
            
            <div className="flex-1">
              <div className="text-sm text-white mb-1">{message}</div>
              {progress !== undefined && (
                <ProgressBar
                  progress={progress}
                  size="sm"
                  animated={true}
                  showPercentage={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Компонент для кругового прогресса
interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export function CircularProgress({
  progress,
  size = 60,
  strokeWidth = 4,
  color = '#3b82f6',
  className = ""
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Фоновый круг */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-700"
        />
        
        {/* Прогресс круг */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Процент в центре */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-white">
          <AnimatedCounter value={Math.round(progress)} />
        </span>
      </div>
    </div>
  );
}