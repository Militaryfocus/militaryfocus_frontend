"use client";

import { useState, useEffect, useCallback } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiHelpCircle } from 'react-icons/fi';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 300,
  className = ""
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = useCallback(() => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  }, [delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  }, [timeoutId]);

  const getPositionClasses = () => {
    const positionMap = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };
    return positionMap[position];
  };

  const getArrowClasses = () => {
    const arrowMap = {
      top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800',
      left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800',
      right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800'
    };
    return arrowMap[position];
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute z-50 ${getPositionClasses()}`}>
          <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs">
            {content}
            {/* Стрелка */}
            <div className={`absolute w-0 h-0 border-4 border-transparent ${getArrowClasses()}`} />
          </div>
        </div>
      )}
    </div>
  );
}

// Компонент для интерактивного тура
interface TourStep {
  id: string;
  target: string; // CSS селектор
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function Tour({ steps, isOpen, onClose, onComplete }: TourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && steps.length > 0) {
      const element = document.querySelector(steps[currentStep].target) as HTMLElement;
      setTargetElement(element);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.zIndex = '1000';
        element.style.position = 'relative';
      }
    }
  }, [isOpen, currentStep, steps]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // const getTooltipPosition = () => {
  //   if (!targetElement) return 'bottom';
  //   
  //   const rect = targetElement.getBoundingClientRect();
  //   const viewportHeight = window.innerHeight;
  //   
  //   if (rect.top < viewportHeight / 2) {
  //     return 'bottom';
  //   } else {
  //     return 'top';
  //   }
  // };

  if (!isOpen || !targetElement) return null;

  const currentStepData = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      
      {/* Highlight */}
      <div
        className="fixed z-45 border-2 border-blue-500 rounded-lg pointer-events-none"
        style={{
          top: targetElement.offsetTop - 4,
          left: targetElement.offsetLeft - 4,
          width: targetElement.offsetWidth + 8,
          height: targetElement.offsetHeight + 8,
        }}
      />
      
      {/* Tooltip */}
      <div className="fixed z-50 bg-gray-800 text-white rounded-lg shadow-xl max-w-sm p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-300 mb-4">{currentStepData.content}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {currentStep + 1} из {steps.length}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <FiChevronLeft className="h-4 w-4" />
                Назад
              </button>
            )}
            
            <button
              onClick={nextStep}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Завершить' : 'Далее'}
              {currentStep < steps.length - 1 && <FiChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Компонент для контекстной помощи
interface HelpButtonProps {
  content: string;
  className?: string;
}

export function HelpButton({ content, className = "" }: HelpButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-400 hover:text-blue-400 transition-colors p-1"
        aria-label="Показать помощь"
      >
        <FiHelpCircle className="h-4 w-4" />
      </button>
      
      {isVisible && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 text-white text-sm p-3 rounded-lg shadow-lg z-50">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-blue-400">Справка</h4>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
          <p className="text-gray-300">{content}</p>
        </div>
      )}
    </div>
  );
}

// Хук для управления турами
export const useTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTour, setCurrentTour] = useState<string | null>(null);

  const startTour = (tourId: string) => {
    setCurrentTour(tourId);
    setIsOpen(true);
  };

  const closeTour = () => {
    setIsOpen(false);
    setCurrentTour(null);
  };

  const completeTour = () => {
    if (currentTour) {
      localStorage.setItem(`tour-${currentTour}-completed`, 'true');
    }
    closeTour();
  };

  const isTourCompleted = (tourId: string) => {
    return localStorage.getItem(`tour-${tourId}-completed`) === 'true';
  };

  return {
    isOpen,
    currentTour,
    startTour,
    closeTour,
    completeTour,
    isTourCompleted,
  };
};