'use client';

import React, { useEffect, useState } from 'react';
import { X, Monitor } from 'lucide-react';
import { Settings } from '@/types/settings';
import { translations } from '@/lib/i18n';

interface MobileInfoDialogProps {
  settings: Settings;
}

export default function MobileInfoDialog({ settings }: MobileInfoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[settings.language];

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        // Check if already dismissed in this session
        const dismissed = sessionStorage.getItem('mobileInfoDismissed');
        if (!dismissed) {
          setIsOpen(true);
        }
      }
    };

    checkMobile();
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('mobileInfoDismissed', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-scale-in border border-gray-100 dark:border-gray-800">
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
            <Monitor size={32} />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {t.mobileInfo.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
            {t.mobileInfo.message}
          </p>

          <button
            onClick={handleDismiss}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-500/20"
          >
            {t.mobileInfo.button}
          </button>
        </div>
      </div>
    </div>
  );
}
