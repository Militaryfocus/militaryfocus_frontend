import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, Heart } from 'lucide-react';
import { Hero } from '../../types';

interface HeroCardProps {
  hero: Hero;
  onClick?: (hero: Hero) => void;
  showRole?: boolean;
  showStats?: boolean;
  className?: string;
}

const HeroCard: React.FC<HeroCardProps> = ({ 
  hero, 
  onClick,
  showRole = true,
  showStats = false,
  className = ''
}) => {
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Tank': 'bg-blue-600',
      'Assassin': 'bg-red-600',
      'Mage': 'bg-purple-600',
      'Marksman': 'bg-green-600',
      'Support': 'bg-yellow-600',
      'Fighter': 'bg-orange-600',
    };
    return colors[role] || 'bg-gray-600';
  };

  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return 'text-gray-400';
    if (difficulty <= 3) return 'text-green-500';
    if (difficulty <= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getDifficultyText = (difficulty?: number) => {
    if (!difficulty) return 'N/A';
    if (difficulty <= 3) return 'Легкий';
    if (difficulty <= 6) return 'Средний';
    return 'Сложный';
  };

  return (
    <div 
      className={`hero-card ${className}`}
      onClick={() => onClick && onClick(hero)}
    >
      <div className="hero-image">
        <img 
          src={hero.image_url || '/images/default-hero.jpg'} 
          alt={hero.name}
          className="w-full h-full object-cover"
        />
        {showRole && (
          <div className={`hero-role ${getRoleColor(hero.role)}`}>
            {hero.role}
          </div>
        )}
        
        {/* Win Rate Badge */}
        {hero.win_rate && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold">
            {hero.win_rate.toFixed(1)}%
          </div>
        )}
      </div>
      
      <div className="hero-info p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="hero-name text-lg font-bold text-gray-900">{hero.name}</h3>
          <span className={`text-sm font-medium ${getDifficultyColor(hero.difficulty)}`}>
            {getDifficultyText(hero.difficulty)}
          </span>
        </div>
        
        <p className="hero-specialty text-sm text-gray-600 mb-3">{hero.specialty}</p>
        
        {/* Lane indicators */}
        {hero.lane && hero.lane.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {hero.lane.map((lane, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {lane}
              </span>
            ))}
          </div>
        )}
        
        {showStats && (
          <div className="hero-stats space-y-2">
            {hero.durability && (
              <div className="stat">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Прочность</span>
                  <span>{hero.durability}/10</span>
                </div>
                <div className="stat-bar">
                  <div 
                    className="stat-fill stat-durability" 
                    style={{width: `${(hero.durability / 10) * 100}%`}}
                  ></div>
                </div>
              </div>
            )}
            
            {hero.offense && (
              <div className="stat">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Атака</span>
                  <span>{hero.offense}/10</span>
                </div>
                <div className="stat-bar">
                  <div 
                    className="stat-fill stat-offense" 
                    style={{width: `${(hero.offense / 10) * 100}%`}}
                  ></div>
                </div>
              </div>
            )}
            
            {hero.control && (
              <div className="stat">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Контроль</span>
                  <span>{hero.control}/10</span>
                </div>
                <div className="stat-bar">
                  <div 
                    className="stat-fill stat-control" 
                    style={{width: `${(hero.control / 10) * 100}%`}}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Meta stats */}
        {(hero.pick_rate || hero.ban_rate) && (
          <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
            {hero.pick_rate && (
              <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                <span>{hero.pick_rate.toFixed(1)}%</span>
              </div>
            )}
            {hero.ban_rate && (
              <div className="flex items-center">
                <Heart className="w-3 h-3 mr-1" />
                <span>{hero.ban_rate.toFixed(1)}%</span>
              </div>
            )}
          </div>
        )}
        
        {/* Action button */}
        <div className="mt-4">
          <Link
            to={`/heroes/${hero.id}`}
            className="btn-primary w-full text-center block"
            onClick={(e) => e.stopPropagation()}
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;