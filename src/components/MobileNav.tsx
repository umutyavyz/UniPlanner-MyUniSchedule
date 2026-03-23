'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar, Clock, BarChart3, ClipboardList, Target,
  Grid3x3, Home
} from 'lucide-react';

const primaryTools = [
  { href: '/', icon: Home, label: 'Ana Sayfa', labelEn: 'Home' },
  { href: '/planner', icon: Calendar, label: 'Program', labelEn: 'Schedule' },
  { href: '/pomodoro', icon: Clock, label: 'Pomodoro', labelEn: 'Pomodoro' },
  { href: '/gpa-calculator', icon: BarChart3, label: 'GPA', labelEn: 'GPA' },
  { href: '/assignments', icon: ClipboardList, label: 'Ödevler', labelEn: 'Tasks' },
  { href: '/goals', icon: Target, label: 'Hedefler', labelEn: 'Goals' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [showAllTools, setShowAllTools] = useState(false);

  useEffect(() => {
    setMounted(true);
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
  }, []);

  if (!mounted) return null;

  // Don't show on home page
  if (pathname === '/') return null;

  return (
    <>
      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-1">
          {primaryTools.map((tool) => {
            const isActive = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all min-w-0 flex-1 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-50 dark:bg-blue-500/20' : ''}`}>
                  <tool.icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                </div>
                <span className="text-[10px] font-medium leading-tight truncate max-w-full">
                  {lang === 'tr' ? tool.label : tool.labelEn}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setShowAllTools(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all min-w-0 flex-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <div className="p-1.5 rounded-xl">
              <Grid3x3 size={20} strokeWidth={1.75} />
            </div>
            <span className="text-[10px] font-medium leading-tight">{lang === 'tr' ? 'Tümü' : 'More'}</span>
          </button>
        </div>
      </nav>

      {/* All tools drawer */}
      {showAllTools && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAllTools(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {lang === 'tr' ? 'Tüm Araçlar' : 'All Tools'}
              </h2>
              <button
                onClick={() => setShowAllTools(false)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 grid grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto pb-8">
              {[
                { href: '/planner', emoji: '📅', label: 'Ders Programı', labelEn: 'Schedule' },
                { href: '/gpa-calculator', emoji: '🎓', label: 'GPA Hesap', labelEn: 'GPA Calc' },
                { href: '/final-calculator', emoji: '📊', label: 'Vize/Final', labelEn: 'Final Calc' },
                { href: '/pomodoro', emoji: '⏱️', label: 'Pomodoro', labelEn: 'Pomodoro' },
                { href: '/attendance', emoji: '✅', label: 'Devamsızlık', labelEn: 'Attendance' },
                { href: '/assignments', emoji: '📋', label: 'Ödevler', labelEn: 'Assignments' },
                { href: '/exams', emoji: '📝', label: 'Sınavlar', labelEn: 'Exams' },
                { href: '/flashcards', emoji: '🃏', label: 'Kartlar', labelEn: 'Flashcards' },
                { href: '/budget', emoji: '💰', label: 'Bütçe', labelEn: 'Budget' },
                { href: '/applications', emoji: '💼', label: 'Kariyer', labelEn: 'Career' },
                { href: '/notes', emoji: '📓', label: 'Notlar', labelEn: 'Notes' },
                { href: '/goals', emoji: '🎯', label: 'Hedefler', labelEn: 'Goals' },
                { href: '/habits', emoji: '🔥', label: 'Alışkanlık', labelEn: 'Habits' },
                { href: '/daily-planner', emoji: '🗓️', label: 'Günlük Plan', labelEn: 'Daily Plan' },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setShowAllTools(false)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                    pathname === tool.href
                      ? 'bg-blue-50 dark:bg-blue-500/20'
                      : 'bg-gray-50 dark:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700'
                  }`}
                >
                  <span className="text-2xl leading-none">{tool.emoji}</span>
                  <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                    {lang === 'tr' ? tool.label : tool.labelEn}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spacer to push content above bottom nav */}
      <div className="md:hidden h-16 safe-area-bottom" />
    </>
  );
}
