import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, Heart, User, Calendar } from 'lucide-react';
import { BuildGuide } from '@/types';

interface GuideCardProps {
  guide: BuildGuide;
  showAuthor?: boolean;
  className?: string;
}

const GuideCard: React.FC<GuideCardProps> = ({ 
  guide, 
  showAuthor = true,
  className = ''
}) => {
  const getDifficultyColor = (difficulty?: string) => {
    const colors: Record<string, string> = {
      'Easy': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-red-100 text-red-800',
    };
    return colors[difficulty || ''] || 'bg-gray-100 text-gray-800';
  };

  const getPlayStyleColor = (playStyle?: string) => {
    const colors: Record<string, string> = {
      'Aggressive': 'bg-red-100 text-red-800',
      'Defensive': 'bg-blue-100 text-blue-800',
      'Balanced': 'bg-green-100 text-green-800',
    };
    return colors[playStyle || ''] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className={`guide-card ${className}`}>
      <div className="guide-header">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {guide.title}
          </h3>
          <div className="flex items-center ml-2">
            <div className="rating-stars">
              {renderStars(guide.rating)}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              ({guide.rating_count})
            </span>
          </div>
        </div>
        
        {guide.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {guide.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {guide.difficulty && (
            <span className={`tag ${getDifficultyColor(guide.difficulty)}`}>
              {guide.difficulty}
            </span>
          )}
          {guide.play_style && (
            <span className={`tag ${getPlayStyleColor(guide.play_style)}`}>
              {guide.play_style}
            </span>
          )}
          {guide.tags && guide.tags.map((tag, index) => (
            <span key={index} className="tag tag-meta">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="guide-content">
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{guide.views}</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              <span>{guide.likes}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(guide.created_at)}</span>
          </div>
        </div>
        
        {/* Author info */}
        {showAuthor && (
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Автор #{guide.author_id}</p>
              <p className="text-xs text-gray-500">Версия {guide.version}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="guide-footer">
        <Link
          to={`/guides/${guide.id}`}
          className="btn-primary flex-1 text-center"
        >
          Читать гайд
        </Link>
      </div>
    </div>
  );
};

export default GuideCard;