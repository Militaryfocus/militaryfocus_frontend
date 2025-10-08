import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Calendar, User, Tag } from 'lucide-react';
import { News } from '@/types';

interface NewsCardProps {
  news: News;
  showAuthor?: boolean;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  news, 
  showAuthor = true,
  className = ''
}) => {
  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'patch': 'bg-blue-100 text-blue-800',
      'event': 'bg-green-100 text-green-800',
      'tournament': 'bg-purple-100 text-purple-800',
      'community': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category || ''] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} мин чтения`;
  };

  return (
    <article className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* Image */}
      {news.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={news.image_url}
            alt={news.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {news.is_featured && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Рекомендуем
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          {news.category && (
            <span className={`tag ${getCategoryColor(news.category)}`}>
              {news.category}
            </span>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <Eye className="w-4 h-4 mr-1" />
            <span>{news.views}</span>
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors duration-200">
          <Link to={`/news/${news.id}`}>
            {news.title}
          </Link>
        </h2>
        
        {/* Summary */}
        {news.summary && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {news.summary}
          </p>
        )}
        
        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {news.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="flex items-center text-xs text-gray-500">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {news.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{news.tags.length - 3} еще
              </span>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(news.created_at)}</span>
          </div>
          
          {showAuthor && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>Автор #{news.author_id}</span>
            </div>
          )}
        </div>
        
        {/* Reading time */}
        <div className="mt-2 text-xs text-gray-400">
          {getReadingTime(news.content)}
        </div>
      </div>
    </article>
  );
};

export default NewsCard;