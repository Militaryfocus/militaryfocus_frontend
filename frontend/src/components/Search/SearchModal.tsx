import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useQuery } from 'react-query';
import apiService from '@/services/api';
import { Hero, BuildGuide, User } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Получаем предложения поиска
  const { data: suggestions, isLoading: suggestionsLoading } = useQuery(
    ['search-suggestions', query],
    () => apiService.getSearchSuggestions(query, 5),
    {
      enabled: query.length > 1,
      staleTime: 30000,
    }
  );

  // Получаем результаты поиска
  const { data: searchResults, isLoading: searchLoading } = useQuery(
    ['search', query],
    () => apiService.search(query, undefined, 10),
    {
      enabled: query.length > 2,
      staleTime: 30000,
    }
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Загружаем недавние поиски из localStorage
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Добавляем в недавние поиски
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recent-searches', JSON.stringify(newRecent));
      
      // Перенаправляем на страницу поиска
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Поиск героев, гайдов, пользователей..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {query.length === 0 ? (
            /* Recent Searches */
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Недавние поиски
                </h3>
                {recentSearches.length > 0 && (
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Очистить
                  </button>
                )}
              </div>
              
              {recentSearches.length > 0 ? (
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Нет недавних поисков</p>
              )}
            </div>
          ) : query.length <= 2 ? (
            /* Suggestions */
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Популярные поиски
              </h3>
              
              {suggestionsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>
              ) : suggestions?.suggestions?.length > 0 ? (
                <div className="space-y-1">
                  {suggestions.suggestions.map((suggestion: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion.text)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200 flex items-center"
                    >
                      <span className="flex-1">{suggestion.text}</span>
                      <span className="text-xs text-gray-400 ml-2 capitalize">
                        {suggestion.type}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Нет предложений</p>
              )}
            </div>
          ) : (
            /* Search Results */
            <div className="p-4">
              {searchLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : searchResults ? (
                <div className="space-y-4">
                  {/* Heroes */}
                  {searchResults.heroes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Герои</h3>
                      <div className="space-y-1">
                        {searchResults.heroes.slice(0, 3).map((hero: Hero) => (
                          <button
                            key={hero.id}
                            onClick={() => {
                              window.location.href = `/heroes/${hero.id}`;
                              onClose();
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200 flex items-center"
                          >
                            <img
                              src={hero.avatar_url || '/images/default-hero.png'}
                              alt={hero.name}
                              className="w-6 h-6 rounded-full mr-3 object-cover"
                            />
                            <div className="flex-1">
                              <div className="font-medium">{hero.name}</div>
                              <div className="text-xs text-gray-500">{hero.role} • {hero.specialty}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Guides */}
                  {searchResults.guides.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Гайды</h3>
                      <div className="space-y-1">
                        {searchResults.guides.slice(0, 3).map((guide: BuildGuide) => (
                          <button
                            key={guide.id}
                            onClick={() => {
                              window.location.href = `/guides/${guide.id}`;
                              onClose();
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                          >
                            <div className="font-medium">{guide.title}</div>
                            <div className="text-xs text-gray-500">
                              {guide.description?.substring(0, 50)}...
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Users */}
                  {searchResults.users.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Пользователи</h3>
                      <div className="space-y-1">
                        {searchResults.users.slice(0, 3).map((user: User) => (
                          <button
                            key={user.id}
                            onClick={() => {
                              window.location.href = `/profile/${user.id}`;
                              onClose();
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200 flex items-center"
                          >
                            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-xs font-medium">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{user.username}</div>
                              <div className="text-xs text-gray-500">{user.ign || 'No IGN'}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show All Results */}
                  {searchResults.total_results > 9 && (
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => handleSearch(query)}
                        className="w-full text-center px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200"
                      >
                        Показать все результаты ({searchResults.total_results})
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Результаты не найдены</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;