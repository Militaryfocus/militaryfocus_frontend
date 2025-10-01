"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { FiSearch, FiX, FiFilter, FiTrendingUp, FiClock, FiStar } from 'react-icons/fi';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  showFilters?: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'trending' | 'recent' | 'category';
  icon?: React.ReactNode;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Поиск новостей СВО...", 
  className = "",
  showSuggestions = true,
  showFilters = true
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsPanel, setShowSuggestionsPanel] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions: SearchSuggestion[] = [
    { id: '1', text: 'СВО', type: 'trending', icon: <FiTrendingUp className="w-3 h-3" /> },
    { id: '2', text: 'Вооружение', type: 'category' },
    { id: '3', text: 'Аналитика', type: 'category' },
    { id: '4', text: 'Фронт', type: 'trending', icon: <FiTrendingUp className="w-3 h-3" /> },
    { id: '5', text: 'Новости сегодня', type: 'recent', icon: <FiClock className="w-3 h-3" /> },
    { id: '6', text: 'Важные события', type: 'recent', icon: <FiStar className="w-3 h-3" /> },
  ];

  const handleSearch = useCallback((searchQuery: string) => {
    onSearch(searchQuery.trim());
    setShowSuggestionsPanel(false);
  }, [onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    handleSearch('');
    setShowSuggestionsPanel(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestions && suggestions.length > 0) {
      setShowSuggestionsPanel(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestionsPanel(false);
    }, 200);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestionsPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    if (suggestion.icon) return suggestion.icon;
    
    switch (suggestion.type) {
      case 'trending':
        return <FiTrendingUp className="w-3 h-3" />;
      case 'recent':
        return <FiClock className="w-3 h-3" />;
      case 'category':
        return <FiSearch className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'trending':
        return 'text-orange-400';
      case 'recent':
        return 'text-blue-400';
      case 'category':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-300 ${
          isFocused ? 'scale-105' : ''
        }`}>
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className={`h-5 w-5 transition-colors duration-200 ${
              isFocused ? 'text-blue-400' : 'text-gray-400'
            }`} />
          </div>
          
          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`
              w-full pl-12 pr-12 py-4
              bg-white/10 backdrop-blur-md border border-white/20
              rounded-xl text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
              focus:border-blue-400/50 transition-all duration-300
              hover:bg-white/15 hover:border-white/30
              ${isFocused ? 'shadow-xl shadow-blue-500/20' : 'shadow-lg'}
            `}
            aria-label="Поиск новостей"
          />
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-12 flex items-center 
                       text-gray-400 hover:text-white transition-colors duration-200
                       hover:bg-white/10 rounded-lg px-2"
              aria-label="Очистить поиск"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}

          {/* Filter Button */}
          {showFilters && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center 
                       text-gray-400 hover:text-white transition-colors duration-200
                       hover:bg-white/10 rounded-lg px-2"
              aria-label="Фильтры"
            >
              <FiFilter className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>
      
      {/* Suggestions Panel */}
      {showSuggestionsPanel && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl 
                       border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden
                       animate-slide-down">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Популярные запросы</h3>
              <span className="text-xs text-gray-500">{suggestions.length} вариантов</span>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-300 
                         hover:bg-white/10 hover:text-white transition-colors duration-150
                         border-b border-white/5 last:border-b-0"
              >
                <div className={`flex-shrink-0 ${getSuggestionColor(suggestion.type)}`}>
                  {getSuggestionIcon(suggestion)}
                </div>
                <span className="flex-1">{suggestion.text}</span>
                <span className="text-xs text-gray-500 capitalize">{suggestion.type}</span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-800/50 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center">
              Нажмите Enter для поиска или выберите предложение
            </p>
          </div>
        </div>
      )}

      {/* Search Tips */}
      {isFocused && !showSuggestionsPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl 
                       border border-white/20 rounded-xl shadow-xl z-50 p-4 animate-fade-in">
          <div className="text-sm text-gray-400 mb-2">💡 Советы по поиску:</div>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Используйте ключевые слова: &quot;СВО&quot;, &quot;фронт&quot;, &quot;вооружение&quot;</li>
            <li>• Добавьте дату для поиска по времени: &quot;сегодня&quot;, &quot;вчера&quot;</li>
            <li>• Используйте кавычки для точного поиска</li>
          </ul>
        </div>
      )}
    </div>
  );
}