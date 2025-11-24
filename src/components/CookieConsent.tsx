'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Hafif bir gecikme ile göster ki kullanıcı hemen korkmasın
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 animate-fade-in-up">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>
        
        <div className="pr-8">
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Çerez Politikası 🍪</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Deneyiminizi iyileştirmek ve reklamları kişiselleştirmek için çerezleri kullanıyoruz. 
            Sitemizi kullanarak çerez kullanımını kabul etmiş olursunuz.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
          >
            Kabul Et
          </button>
          <a 
            href="/privacy" 
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Detaylar
          </a>
        </div>
      </div>
    </div>
  );
}
