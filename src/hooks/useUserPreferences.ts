import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  articlesPerPage: number;
  defaultFilter: string;
  enableNotifications: boolean;
  enableAnimations: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: 'ru' | 'en';
  autoRefresh: boolean;
  refreshInterval: number; // в минутах
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  articlesPerPage: 10,
  defaultFilter: 'all',
  enableNotifications: true,
  enableAnimations: true,
  fontSize: 'medium',
  language: 'ru',
  autoRefresh: false,
  refreshInterval: 5,
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загружаем предпочтения из localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      console.error('Ошибка загрузки предпочтений:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Сохраняем предпочтения в localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
      } catch (error) {
        console.error('Ошибка сохранения предпочтений:', error);
      }
    }
  }, [preferences, isLoaded]);

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  const exportPreferences = useCallback(() => {
    const dataStr = JSON.stringify(preferences, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'military-focus-preferences.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [preferences]);

  const importPreferences = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setPreferences({ ...DEFAULT_PREFERENCES, ...imported });
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsText(file);
    });
  }, []);

  return {
    preferences,
    isLoaded,
    updatePreference,
    updatePreferences,
    resetPreferences,
    exportPreferences,
    importPreferences,
  };
};