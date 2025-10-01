"use client";

import { useEffect, useState, useCallback } from 'react';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: HTMLElement;
  selector?: string;
  rule?: string;
}

interface AccessibilityCheckerProps {
  onIssuesFound?: (issues: AccessibilityIssue[]) => void;
  checkInterval?: number;
  enabled?: boolean;
}

export default function AccessibilityChecker({
  onIssuesFound,
  checkInterval = 5000,
  enabled = true,
}: AccessibilityCheckerProps) {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkAccessibility = useCallback(() => {
    if (!enabled) return;

    setIsChecking(true);
    const foundIssues: AccessibilityIssue[] = [];

    // Проверка заголовков
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels: number[] = [];
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      headingLevels.push(level);
      
      // Проверка на пустые заголовки
      if (!heading.textContent?.trim()) {
        foundIssues.push({
          type: 'error',
          message: 'Пустой заголовок',
          element: heading as HTMLElement,
          selector: heading.tagName.toLowerCase(),
          rule: 'heading-has-content',
        });
      }
    });

    // Проверка последовательности заголовков
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] > headingLevels[i - 1] + 1) {
        foundIssues.push({
          type: 'warning',
          message: 'Нарушена последовательность заголовков',
          rule: 'heading-order',
        });
      }
    }

    // Проверка изображений
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.alt) {
        foundIssues.push({
          type: 'error',
          message: 'Изображение без alt-текста',
          element: img as HTMLElement,
          selector: 'img',
          rule: 'img-alt',
        });
      }
      
      if (img.alt === '') {
        foundIssues.push({
          type: 'warning',
          message: 'Декоративное изображение должно иметь пустой alt',
          element: img as HTMLElement,
          selector: 'img',
          rule: 'img-alt-empty',
        });
      }
    });

    // Проверка ссылок
    const links = document.querySelectorAll('a');
    links.forEach((link) => {
      if (!link.textContent?.trim() && !link.getAttribute('aria-label')) {
        foundIssues.push({
          type: 'error',
          message: 'Ссылка без текста',
          element: link as HTMLElement,
          selector: 'a',
          rule: 'link-has-content',
        });
      }
      
      if (link.href === '#' || link.href === 'javascript:void(0)') {
        foundIssues.push({
          type: 'warning',
          message: 'Ссылка-заглушка',
          element: link as HTMLElement,
          selector: 'a',
          rule: 'link-has-href',
        });
      }
    });

    // Проверка форм
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      const inputElement = input as HTMLInputElement;
      
      if (inputElement.type !== 'hidden' && !inputElement.id && !inputElement.getAttribute('aria-label')) {
        foundIssues.push({
          type: 'error',
          message: 'Поле ввода без метки',
          element: inputElement,
          selector: input.tagName.toLowerCase(),
          rule: 'form-field-has-label',
        });
      }
    });

    // Проверка контрастности (упрощенная)
    const elements = document.querySelectorAll('*');
    elements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      
      // Простая проверка на белый текст на белом фоне
      if (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(255, 255, 255)') {
        foundIssues.push({
          type: 'warning',
          message: 'Возможные проблемы с контрастностью',
          element: element as HTMLElement,
          rule: 'color-contrast',
        });
      }
    });

    // Проверка клавиатурной навигации
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) {
      foundIssues.push({
        type: 'warning',
        message: 'Нет элементов для клавиатурной навигации',
        rule: 'keyboard-navigation',
      });
    }

    setIssues(foundIssues);
    onIssuesFound?.(foundIssues);
    setIsChecking(false);
  }, [enabled, onIssuesFound]);

  useEffect(() => {
    if (!enabled) return;

    // Первоначальная проверка
    checkAccessibility();

    // Периодическая проверка
    const interval = setInterval(checkAccessibility, checkInterval);

    return () => clearInterval(interval);
  }, [enabled, checkInterval, checkAccessibility]);

  // Функция для получения оценки доступности
  const getAccessibilityScore = (issues: AccessibilityIssue[]): number => {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'error':
          score -= 10;
          break;
        case 'warning':
          score -= 5;
          break;
        case 'info':
          score -= 2;
          break;
      }
    });
    
    return Math.max(0, score);
  };

  const score = getAccessibilityScore(issues);
  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;

  return (
    <div className="fixed top-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-white z-50 max-w-sm">
      <div className="font-semibold mb-2 flex items-center justify-between">
        <span>Доступность (a11y)</span>
        <button
          onClick={checkAccessibility}
          disabled={isChecking}
          className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          title="Проверить доступность"
        >
          {isChecking ? '⏳' : '🔄'}
        </button>
      </div>
      
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
        
        <div className="flex justify-between">
          <span>Ошибки:</span>
          <span className={`font-bold ${
            errorCount === 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {errorCount}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Предупреждения:</span>
          <span className={`font-bold ${
            warningCount === 0 ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {warningCount}
          </span>
        </div>
        
        {issues.length > 0 && (
          <div className="max-h-32 overflow-y-auto mt-2">
            {issues.slice(0, 3).map((issue, index) => (
              <div key={index} className={`text-xs border-l-2 pl-2 mb-1 ${
                issue.type === 'error' ? 'border-red-500 text-red-300' :
                issue.type === 'warning' ? 'border-yellow-500 text-yellow-300' :
                'border-blue-500 text-blue-300'
              }`}>
                <div className="font-medium truncate">{issue.message}</div>
                {issue.rule && (
                  <div className="text-gray-500 text-xs">{issue.rule}</div>
                )}
              </div>
            ))}
            {issues.length > 3 && (
              <div className="text-gray-500 text-center">
                ... и еще {issues.length - 3} проблем
              </div>
            )}
          </div>
        )}
        
        {issues.length === 0 && (
          <div className="text-green-400 text-center">
            ✅ Проблем с доступностью не найдено
          </div>
        )}
      </div>
    </div>
  );
}