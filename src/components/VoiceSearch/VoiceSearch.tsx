"use client";

import { useState, useCallback, useEffect } from 'react';
import { FiMic, FiMicOff, FiVolume2 } from 'react-icons/fi';

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  isSupported?: boolean;
  className?: string;
}

export default function VoiceSearch({ 
  onSearch, 
  isSupported = true,
  className = "" 
}: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Проверяем поддержку Web Speech API
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupportedBrowser(supported);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupportedBrowser) {
      setError('Голосовой поиск не поддерживается в вашем браузере');
      return;
    }

    setError(null);
    setTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ru-RU';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      onSearch(result);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Ошибка распознавания: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [isSupportedBrowser, onSearch]);

  const stopListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.stop();
    }
    setIsListening(false);
  }, []);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  if (!isSupported || !isSupportedBrowser) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Кнопка голосового поиска */}
      <button
        onClick={isListening ? stopListening : startListening}
        className={`
          p-3 rounded-lg transition-all duration-200
          ${isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
          }
        `}
        title={isListening ? 'Остановить прослушивание' : 'Начать голосовой поиск'}
        aria-label={isListening ? 'Остановить прослушивание' : 'Начать голосовой поиск'}
      >
        {isListening ? (
          <FiMicOff className="h-5 w-5" />
        ) : (
          <FiMic className="h-5 w-5" />
        )}
      </button>

      {/* Индикатор статуса */}
      {isListening && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <div className="animate-pulse">🎤</div>
          <span>Слушаю...</span>
        </div>
      )}

      {/* Результат распознавания */}
      {transcript && !isListening && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Распознано:</span>
          <span className="text-sm text-white bg-gray-700 px-2 py-1 rounded">
            &quot;{transcript}&quot;
          </span>
          <button
            onClick={() => speakText(transcript)}
            className="text-gray-400 hover:text-white transition-colors"
            title="Произнести текст"
          >
            <FiVolume2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}

// Хук для проверки поддержки голосового поиска
export const useVoiceSearch = () => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
  }, []);

  return { isSupported };
};