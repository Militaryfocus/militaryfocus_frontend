import { Metadata } from 'next';

export const generateMetadata = (): Metadata => {
  const baseUrl = 'https://military-focus.vercel.app';
  
  return {
    title: 'СВО: новости, аналитика и хроника специальной военной операции 2025',
    description: 'Следите за хроникой событий СВО от непосредственного участника! Новости, аналитика и личный опыт — только проверенная информация из первых рук.',
    keywords: [
      'СВО',
      'новости',
      'аналитика',
      'хроника',
      'специальная военная операция',
      'военные новости 2025',
      'события на фронте',
      'военная аналитика',
      'сводки СВО',
      'новости фронта'
    ],
    authors: [{ name: 'Military Focus Team' }],
    creator: 'Military Focus',
    publisher: 'Military Focus',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
      languages: {
        'ru-RU': baseUrl,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: baseUrl,
      siteName: 'СВО Новости',
      title: 'СВО: новости, аналитика и хроника специальной военной операции 2025',
      description: 'Следите за хроникой событий СВО от непосредственного участника! Новости, аналитика и личный опыт — только проверенная информация из первых рук.',
      images: [
        {
          url: '/banner.jpg',
          width: 1200,
          height: 600,
          alt: 'СВО Новости - Главная страница',
        },
        {
          url: '/banner.jpg',
          width: 800,
          height: 400,
          alt: 'СВО Новости - Мобильная версия',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@militaryfocus',
      creator: '@militaryfocus',
      title: 'СВО: новости, аналитика и хроника специальной военной операции 2025',
      description: 'Следите за хроникой событий СВО от непосредственного участника!',
      images: ['/banner.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
    category: 'news',
    classification: 'Military News',
    referrer: 'origin-when-cross-origin',
    colorScheme: 'dark light',
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/manifest.json',
    other: {
      'msapplication-TileColor': '#000000',
      'msapplication-config': '/browserconfig.xml',
    },
  };
};

// Структурированные данные для поисковых систем
export const generateStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'СВО Новости',
    description: 'Следите за хроникой событий СВО от непосредственного участника! Новости, аналитика и личный опыт — только проверенная информация из первых рук.',
    url: 'https://military-focus.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://military-focus.vercel.app/?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Military Focus',
      logo: {
        '@type': 'ImageObject',
        url: 'https://military-focus.vercel.app/logo.png',
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Новости СВО',
      description: 'Последние новости специальной военной операции',
      numberOfItems: 100,
    },
  };
};

// Генерация sitemap
export const generateSitemap = () => {
  const baseUrl = 'https://military-focus.vercel.app';
  const currentDate = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
};

// Генерация robots.txt
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

Sitemap: https://military-focus.vercel.app/sitemap.xml

# Блокируем служебные страницы
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /private/

# Разрешаем индексацию основных страниц
Allow: /
Allow: /blogs/
Allow: /news/
Allow: /search/`;
};