"use client";

import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Получаем сохраненную тему из localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Применяем тему
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', theme);
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const getCurrentIcon = () => {
    switch (theme) {
      case 'light':
        return <FiSun className="h-4 w-4" />;
      case 'dark':
        return <FiMoon className="h-4 w-4" />;
      case 'system':
      default:
        return <FiMonitor className="h-4 w-4" />;
    }
  };

  const getCurrentLabel = () => {
    switch (theme) {
      case 'light':
        return 'Светлая';
      case 'dark':
        return 'Темная';
      case 'system':
      default:
        return 'Системная';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 
          bg-gray-800 border border-gray-700 
          rounded-lg text-white hover:bg-gray-700 
          transition-all duration-200
          ${isOpen ? 'ring-2 ring-blue-500' : ''}
        `}
        aria-label="Переключить тему"
        aria-expanded={isOpen}
      >
        {getCurrentIcon()}
        <span className="text-sm font-medium hidden sm:inline">
          {getCurrentLabel()}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 
                         rounded-lg shadow-xl z-50 min-w-[160px]">
            <div className="p-2">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2 px-2">
                Тема
              </div>
              <div className="space-y-1">
                {[
                  { value: 'light', label: 'Светлая', icon: FiSun },
                  { value: 'dark', label: 'Темная', icon: FiMoon },
                  { value: 'system', label: 'Системная', icon: FiMonitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleThemeChange(value as Theme)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md
                      transition-all duration-150
                      ${theme === value 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}