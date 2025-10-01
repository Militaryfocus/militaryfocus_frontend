"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyImage({
  src,
  alt,
  width = 300,
  height = 200,
  className = '',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Placeholder компонент
  const Placeholder = () => (
    <div
      className={`bg-gray-800 animate-pulse flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <div className="text-gray-600 text-sm">Загрузка...</div>
    </div>
  );

  // Error компонент
  const ErrorPlaceholder = () => (
    <div
      className={`bg-gray-800 border border-gray-700 flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <div className="text-gray-500 text-sm text-center">
        <div className="mb-2">📷</div>
        <div>Изображение недоступно</div>
      </div>
    </div>
  );

  if (hasError) {
    return <ErrorPlaceholder />;
  }

  if (!isInView) {
    return (
      <div ref={imgRef} className={className}>
        <Placeholder />
      </div>
    );
  }

  return (
    <div className={className} ref={imgRef}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '100%',
          height: 'auto',
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {!isLoaded && <Placeholder />}
    </div>
  );
}