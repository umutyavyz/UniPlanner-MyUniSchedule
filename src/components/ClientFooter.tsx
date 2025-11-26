'use client';

import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import { translations } from '@/lib/i18n';

export default function ClientFooter() {
  const [language, setLanguage] = useState<'tr' | 'en'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.language) setLanguage(parsed.language);
    } else {
      let isTurkish = false;
      try {
        const browserLang = navigator.language;
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        isTurkish = (browserLang && browserLang.toLowerCase().startsWith('tr')) || 
                    (timeZone === 'Europe/Istanbul');
      } catch (e) {
        isTurkish = navigator.language?.toLowerCase().startsWith('tr');
      }
      setLanguage(isTurkish ? 'tr' : 'en');
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Footer t={translations[language]} />;
}
