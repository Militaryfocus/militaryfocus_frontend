"use client";

import { useState, useEffect } from 'react';

interface MicroInteractionProps {
  children: React.ReactNode;
  type?: 'hover' | 'click' | 'focus' | 'load';
  animation?: 'scale' | 'bounce' | 'pulse' | 'slide' | 'fade';
  duration?: number;
  intensity?: 'subtle' | 'medium' | 'strong';
  delay?: number;
  className?: string;
}

export default function MicroInteraction({
  children,
  type = 'hover',
  animation = 'scale',
  duration = 200,
  intensity = 'medium',
  delay = 0,
  className = ""
}: MicroInteractionProps) {
  const [isActive, setIsActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (type === 'load') {
      const timer = setTimeout(() => setIsLoaded(true), delay);
      return () => clearTimeout(timer);
    }
  }, [type, delay]);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-200 ease-out';
    
    if (type === 'load' && !isLoaded) {
      return `${baseClasses} opacity-0 transform scale-95`;
    }
    
    if (type === 'load' && isLoaded) {
      return `${baseClasses} opacity-100 transform scale-100`;
    }

    const intensityMap = {
      subtle: 'hover:scale-105',
      medium: 'hover:scale-110',
      strong: 'hover:scale-115'
    };

    const animationMap = {
      scale: intensityMap[intensity],
      bounce: 'hover:animate-bounce',
      pulse: 'hover:animate-pulse',
      slide: 'hover:translate-x-1',
      fade: 'hover:opacity-80'
    };

    return `${baseClasses} ${animationMap[animation]} ${isActive ? 'transform scale-95' : ''}`;
  };

  const handleInteraction = (action: 'start' | 'end') => {
    if (type === 'click') {
      if (action === 'start') {
        setIsActive(true);
      } else {
        setTimeout(() => setIsActive(false), duration);
      }
    }
  };

  const handleMouseEnter = () => {
    if (type === 'hover') setIsActive(true);
  };

  const handleMouseLeave = () => {
    if (type === 'hover') setIsActive(false);
  };

  const handleFocus = () => {
    if (type === 'focus') setIsActive(true);
  };

  const handleBlur = () => {
    if (type === 'focus') setIsActive(false);
  };

  return (
    <div
      className={`${getAnimationClasses()} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={() => handleInteraction('start')}
      onMouseUp={() => handleInteraction('end')}
      onTouchStart={() => handleInteraction('start')}
      onTouchEnd={() => handleInteraction('end')}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

// Компонент для анимированных иконок
export function AnimatedIcon({ 
  children, 
  isActive = false, 
  className = "" 
}: { 
  children: React.ReactNode; 
  isActive?: boolean; 
  className?: string; 
}) {
  return (
    <div className={`transition-all duration-300 ${className}`}>
      <div className={`transform transition-transform duration-300 ${
        isActive ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
      }`}>
        {children}
      </div>
    </div>
  );
}

// Компонент для плавного появления элементов
export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 500,
  className = ""
}: { 
  children: React.ReactNode; 
  delay?: number; 
  duration?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-${duration} ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
}

// Компонент для анимированного счетчика
export function AnimatedCounter({ 
  value, 
  duration = 1000,
  className = ""
}: { 
  value: number; 
  duration?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <span className={`font-mono ${className}`}>
      {displayValue.toLocaleString()}
    </span>
  );
}