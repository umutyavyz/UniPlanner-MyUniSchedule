'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/i18n';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [language, setLanguage] = useState<'tr' | 'en'>('en');

  useEffect(() => {
    // Dil kontrolü
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      if (parsed.language) setLanguage(parsed.language);
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('tr') || Intl.DateTimeFormat().resolvedOptions().timeZone === 'Europe/Istanbul') {
        setLanguage('tr');
      }
    }

    // Daha önce kabul/red edildi mi?
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Biraz gecikmeli göster ki kullanıcı hemen korkmasın
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const t = translations[language].cookieConsent;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 animate-in slide-in-from-bottom duration-500">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 relative">
        <div className="pr-8">
          {/* @ts-ignore */}
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {t.message}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
          >
            {t.accept}
          </button>
          <Link 
            href="/privacy" 
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {t.learnMore}
          </Link>
        </div>
      </div>
    </div>
  );
}
