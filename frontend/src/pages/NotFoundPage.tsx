import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Страница не найдена</h2>
      <p className="text-gray-600 mb-8">
        К сожалению, запрашиваемая страница не существует.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
      >
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFoundPage;