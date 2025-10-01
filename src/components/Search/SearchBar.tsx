"use client";

import { useState, useCallback } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Поиск новостей...", 
  className = "" 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useCallback((searchQuery: string) => {
    onSearch(searchQuery.trim());
  }, [onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    handleSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'scale-105' : ''
      }`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className={`h-5 w-5 transition-colors duration-200 ${
            isFocused ? 'text-blue-400' : 'text-gray-400'
          }`} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-3 
            bg-gray-800 border border-gray-700 
            rounded-lg text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:border-transparent transition-all duration-200
            hover:border-gray-600
            ${isFocused ? 'shadow-lg shadow-blue-500/20' : ''}
          `}
          aria-label="Поиск новостей"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center 
                     text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Очистить поиск"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Подсказки при фокусе */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 
                       rounded-lg shadow-xl z-50 p-3">
          <div className="text-sm text-gray-400 mb-2">Быстрый поиск:</div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleSearch('СВО')}
              className="block w-full text-left px-2 py-1 text-sm text-gray-300 
                       hover:bg-gray-700 rounded transition-colors duration-150"
            >
              СВО
            </button>
            <button
              type="button"
              onClick={() => handleSearch('вооружение')}
              className="block w-full text-left px-2 py-1 text-sm text-gray-300 
                       hover:bg-gray-700 rounded transition-colors duration-150"
            >
              Вооружение
            </button>
            <button
              type="button"
              onClick={() => handleSearch('аналитика')}
              className="block w-full text-left px-2 py-1 text-sm text-gray-300 
                       hover:bg-gray-700 rounded transition-colors duration-150"
            >
              Аналитика
            </button>
          </div>
        </div>
      )}
    </form>
  );
}