"use client";

import { useState, useCallback } from 'react';
import { FiDownload, FiFileText, FiShare2 } from 'react-icons/fi';
import { useFavorites } from '@/components/Favorites/FavoriteButton';

interface ExportFavoritesProps {
  className?: string;
}

export default function ExportFavorites({ className = "" }: ExportFavoritesProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { getFavorites } = useFavorites();

  const exportToJSON = useCallback(async () => {
    setIsExporting(true);
    try {
      const favorites = getFavorites();
      const data = {
        title: 'Избранные новости - Military Focus',
        exportDate: new Date().toISOString(),
        count: favorites.length,
        articles: favorites.map(article => ({
          id: article.id,
          title: article.article_title,
          link: article.article_link,
          date: article.date,
          image: article.article_image,
        })),
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `military-focus-favorites-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка экспорта:', error);
    } finally {
      setIsExporting(false);
    }
  }, [getFavorites]);

  const exportToHTML = useCallback(async () => {
    setIsExporting(true);
    try {
      const favorites = getFavorites();
      
      const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Избранные новости - Military Focus</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f9fafb;
        }
        .header {
            text-align: center;
            margin-bottom: 2rem;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .article {
            background: white;
            margin-bottom: 1rem;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .article-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            color: #1f2937;
        }
        .article-date {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        .article-image {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
        .article-link {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
        }
        .article-link:hover {
            text-decoration: underline;
        }
        .footer {
            text-align: center;
            margin-top: 2rem;
            padding: 1rem;
            color: #6b7280;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Избранные новости</h1>
        <p>Military Focus - ${favorites.length} статей</p>
        <p>Экспортировано: ${new Date().toLocaleDateString('ru-RU')}</p>
    </div>
    
    ${favorites.map(article => `
        <div class="article">
            <div class="article-title">${article.article_title}</div>
            <div class="article-date">${article.date}</div>
            ${article.article_image ? `<img src="${article.article_image}" alt="${article.article_title}" class="article-image" />` : ''}
            <a href="${article.article_link}" class="article-link" target="_blank">Читать статью</a>
        </div>
    `).join('')}
    
    <div class="footer">
        <p>Экспортировано из Military Focus</p>
        <p>Дата экспорта: ${new Date().toLocaleString('ru-RU')}</p>
    </div>
</body>
</html>`;

      const dataBlob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `military-focus-favorites-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка экспорта HTML:', error);
    } finally {
      setIsExporting(false);
    }
  }, [getFavorites]);

  const shareFavorites = useCallback(async () => {
    try {
      const favorites = getFavorites();
      const text = `Мои избранные новости из Military Focus (${favorites.length} статей):\n\n` +
        favorites.slice(0, 5).map(article => `• ${article.article_title}`).join('\n') +
        (favorites.length > 5 ? `\n... и еще ${favorites.length - 5} статей` : '');

      if (navigator.share) {
        await navigator.share({
          title: 'Избранные новости Military Focus',
          text: text,
          url: window.location.href,
        });
      } else {
        // Fallback для браузеров без поддержки Web Share API
        await navigator.clipboard.writeText(text);
        alert('Список избранного скопирован в буфер обмена!');
      }
    } catch (error) {
      console.error('Ошибка при попытке поделиться:', error);
    }
  }, [getFavorites]);

  const favorites = getFavorites();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-400">
        Избранное: {favorites.length}
      </span>
      
      <div className="flex gap-1">
        <button
          onClick={exportToJSON}
          disabled={isExporting}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 
                   disabled:bg-gray-600 text-white text-sm rounded-lg transition-colors"
          title="Экспорт в JSON"
        >
          <FiDownload className="h-4 w-4" />
          JSON
        </button>
        
        <button
          onClick={exportToHTML}
          disabled={isExporting}
          className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 
                   disabled:bg-gray-600 text-white text-sm rounded-lg transition-colors"
          title="Экспорт в HTML"
        >
          <FiFileText className="h-4 w-4" />
          HTML
        </button>
        
        <button
          onClick={shareFavorites}
          className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 
                   text-white text-sm rounded-lg transition-colors"
          title="Поделиться"
        >
          <FiShare2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}