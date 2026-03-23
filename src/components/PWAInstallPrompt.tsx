'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check dismissal
    const wasDismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (wasDismissed) {
      const dismissedAt = parseInt(wasDismissed);
      // Show again after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
    }

    // Language detection
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.language) setLang(parsed.language);
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (!browserLang.startsWith('tr') && Intl.DateTimeFormat().resolvedOptions().timeZone !== 'Europe/Istanbul') {
        setLang('en');
      }
    }

    // iOS detection
    const ua = navigator.userAgent;
    const iosDevice = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream;
    setIsIOS(iosDevice);

    if (iosDevice) {
      // Show iOS instructions after 10 seconds
      const timer = setTimeout(() => setShowBanner(true), 10000);
      return () => clearTimeout(timer);
    }

    // Android/Chrome install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after 5 seconds
      setTimeout(() => setShowBanner(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  };

  if (isInstalled || dismissed || !showBanner) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/50 border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-500/20 rounded-xl shrink-0">
            <Smartphone size={22} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {lang === 'tr' ? 'Uygulamayı Yükle' : 'Install App'}
            </h3>
            {isIOS ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                {lang === 'tr'
                  ? "Paylaş → Ana Ekrana Ekle'ye basarak uygulamayı yükle."
                  : "Tap Share → Add to Home Screen to install."}
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                {lang === 'tr'
                  ? 'Ana ekrana ekleyerek uygulama gibi kullan. Ücretsiz!'
                  : 'Add to home screen and use like an app. Free!'}
              </p>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0 -mt-1 -mr-1"
          >
            <X size={16} />
          </button>
        </div>

        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstall}
            className="w-full mt-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Download size={16} />
            {lang === 'tr' ? 'Yükle — Ücretsiz' : 'Install — Free'}
          </button>
        )}

        {isIOS && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
              <span className="text-lg">1.</span>
              <span>{lang === 'tr' ? 'Safari\'de paylaş simgesine bas' : 'Tap the Share icon in Safari'}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-2">
              <span className="text-lg">2.</span>
              <span>{lang === 'tr' ? '"Ana Ekrana Ekle"yi seç' : 'Select "Add to Home Screen"'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
