import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/services/auth';
import Layout from '@/components/Layout/Layout';
import HomePage from '@/pages/HomePage';
import HeroesPage from '@/pages/HeroesPage';
import HeroDetailPage from '@/pages/HeroDetailPage';
import GuidesPage from '@/pages/GuidesPage';
import GuideDetailPage from '@/pages/GuideDetailPage';
import GuideBuilderPage from '@/pages/GuideBuilderPage';
import NewsPage from '@/pages/NewsPage';
import NewsDetailPage from '@/pages/NewsDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import SearchPage from '@/pages/SearchPage';
import NotFoundPage from '@/pages/NotFoundPage';
import './App.css';
import './components/components.css';

// Создаем QueryClient для React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 минут
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Layout>
              <Routes>
                {/* Главная страница */}
                <Route path="/" element={<HomePage />} />
                
                {/* Герои */}
                <Route path="/heroes" element={<HeroesPage />} />
                <Route path="/heroes/:id" element={<HeroDetailPage />} />
                
                {/* Гайды */}
                <Route path="/guides" element={<GuidesPage />} />
                <Route path="/guides/:id" element={<GuideDetailPage />} />
                <Route path="/guides/builder" element={<GuideBuilderPage />} />
                <Route path="/guides/builder/:id" element={<GuideBuilderPage />} />
                
                {/* Новости */}
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                
                {/* Поиск */}
                <Route path="/search" element={<SearchPage />} />
                
                {/* Аутентификация */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Профиль */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
            
            {/* Toast уведомления */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;