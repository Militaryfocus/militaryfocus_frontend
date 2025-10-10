import React from 'react';
import { useParams } from 'react-router-dom';

const HeroDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Детали героя {id}</h1>
      <p className="text-gray-600">Страница с деталями героя в разработке...</p>
    </div>
  );
};

export default HeroDetailPage;