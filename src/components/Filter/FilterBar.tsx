"use client";

import { useState } from 'react';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  className?: string;
}

export default function FilterBar({ 
  filters, 
  activeFilter, 
  onFilterChange, 
  className = "" 
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterLabel = filters.find(f => f.id === activeFilter)?.label || 'Все';

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 
          bg-gray-800 border border-gray-700 
          rounded-lg text-white hover:bg-gray-700 
          transition-all duration-200
          ${isOpen ? 'ring-2 ring-blue-500' : ''}
        `}
        aria-label="Открыть фильтры"
        aria-expanded={isOpen}
      >
        <FiFilter className="h-4 w-4" />
        <span className="text-sm font-medium">{activeFilterLabel}</span>
        <FiChevronDown className={`h-4 w-4 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
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
          <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 
                         rounded-lg shadow-xl z-50 min-w-[200px]">
            <div className="p-2">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2 px-2">
                Категории
              </div>
              <div className="space-y-1">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      onFilterChange(filter.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full text-left px-3 py-2 text-sm rounded-md
                      transition-all duration-150
                      ${activeFilter === filter.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    {filter.label}
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