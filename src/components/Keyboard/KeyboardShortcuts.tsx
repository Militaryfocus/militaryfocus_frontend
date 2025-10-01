"use client";

import { useEffect, useCallback, useState } from 'react';
import { FiX } from 'react-icons/fi';

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  category?: string;
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  showHelp?: boolean;
  className?: string;
}

export function KeyboardShortcuts({ 
  shortcuts, 
  showHelp = true, 
  className = "" 
}: KeyboardShortcutsProps) {
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    setPressedKeys(prev => new Set([...prev, key]));

    // Проверяем комбинации клавиш
    const modifiers = {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey
    };

    const shortcut = shortcuts.find(s => {
      const parts = s.key.toLowerCase().split('+');
      const hasAllKeys = parts.every(part => {
        switch (part.trim()) {
          case 'ctrl': return modifiers.ctrl;
          case 'alt': return modifiers.alt;
          case 'shift': return modifiers.shift;
          case 'meta': return modifiers.meta;
          default: return pressedKeys.has(part.trim());
        }
      });
      return hasAllKeys && parts.length === Object.values(modifiers).filter(Boolean).length + 1;
    });

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }, [shortcuts, pressedKeys]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'Общие';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  if (!showHelp) return null;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsHelpVisible(!isHelpVisible)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        title="Клавиатурные сокращения"
      >
        <FiX className="h-4 w-4" />
        <span className="text-sm">⌨️</span>
      </button>

      {isHelpVisible && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsHelpVisible(false)}
            aria-hidden="true"
          />
          
          <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Клавиатурные сокращения</h3>
                <button
                  onClick={() => setIsHelpVisible(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-sm font-medium text-blue-400 mb-2">{category}</h4>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{shortcut.description}</span>
                        <kbd className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded border border-gray-600">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-700">
                💡 Нажмите Escape для закрытия
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Хук для создания клавиатурных сокращений
export const useKeyboardShortcuts = () => {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);

  const addShortcut = useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts(prev => [...prev, shortcut]);
  }, []);

  const removeShortcut = useCallback((key: string) => {
    setShortcuts(prev => prev.filter(s => s.key !== key));
  }, []);

  const clearShortcuts = useCallback(() => {
    setShortcuts([]);
  }, []);

  return {
    shortcuts,
    addShortcut,
    removeShortcut,
    clearShortcuts,
  };
};

// Компонент для отображения активных клавиш
export function ActiveKeysDisplay({ className = "" }: { className?: string }) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setActiveKeys(prev => new Set([...prev, key]));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (activeKeys.size === 0) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Активные клавиши:</span>
          <div className="flex gap-1">
            {Array.from(activeKeys).map(key => (
              <kbd
                key={key}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded border border-gray-600 animate-pulse"
              >
                {key}
              </kbd>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}