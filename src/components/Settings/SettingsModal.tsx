"use client";

import { useState } from 'react';
import { FiSettings, FiSave, FiRotateCcw, FiDownload, FiUpload, FiX } from 'react-icons/fi';
import { useUserPreferences, UserPreferences } from '@/hooks/useUserPreferences';
import { FILTER_OPTIONS } from '@/constants/app.constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    preferences,
    updatePreference,
    resetPreferences,
    exportPreferences,
    importPreferences,
  } = useUserPreferences();

  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen) return null;

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importPreferences(file);
      alert('Настройки успешно импортированы!');
    } catch {
      alert('Ошибка импорта настроек');
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <FiSettings className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Настройки</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Закрыть настройки"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Тема */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Тема оформления
              </label>
              <select
                value={preferences.theme}
                onChange={(e) => updatePreference('theme', e.target.value as UserPreferences['theme'])}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="system">Системная</option>
                <option value="light">Светлая</option>
                <option value="dark">Темная</option>
              </select>
            </div>

            {/* Статей на странице */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Количество статей на странице
              </label>
              <select
                value={preferences.articlesPerPage}
                onChange={(e) => updatePreference('articlesPerPage', parseInt(e.target.value))}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Фильтр по умолчанию */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Фильтр по умолчанию
              </label>
              <select
                value={preferences.defaultFilter}
                onChange={(e) => updatePreference('defaultFilter', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {FILTER_OPTIONS.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Размер шрифта */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Размер шрифта
              </label>
              <select
                value={preferences.fontSize}
                onChange={(e) => updatePreference('fontSize', e.target.value as UserPreferences['fontSize'])}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="small">Маленький</option>
                <option value="medium">Средний</option>
                <option value="large">Большой</option>
              </select>
            </div>

            {/* Переключатели */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Уведомления
                </label>
                <input
                  type="checkbox"
                  checked={preferences.enableNotifications}
                  onChange={(e) => updatePreference('enableNotifications', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Анимации
                </label>
                <input
                  type="checkbox"
                  checked={preferences.enableAnimations}
                  onChange={(e) => updatePreference('enableAnimations', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Автообновление
                </label>
                <input
                  type="checkbox"
                  checked={preferences.autoRefresh}
                  onChange={(e) => updatePreference('autoRefresh', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Интервал обновления */}
            {preferences.autoRefresh && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Интервал обновления (минуты)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={preferences.refreshInterval}
                  onChange={(e) => updatePreference('refreshInterval', parseInt(e.target.value))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-700">
            <div className="flex gap-2">
              <button
                onClick={exportPreferences}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <FiDownload className="h-4 w-4" />
                Экспорт
              </button>
              
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
                <FiUpload className="h-4 w-4" />
                Импорт
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  disabled={isImporting}
                />
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetPreferences}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <FiRotateCcw className="h-4 w-4" />
                Сброс
              </button>
              
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FiSave className="h-4 w-4" />
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}