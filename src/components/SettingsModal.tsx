import { X, Trash2, XCircle } from 'lucide-react';
import { Settings } from '@/types/settings';
import { translations } from '@/lib/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
  onResetSchedule: () => void;
  onDeleteAll: () => void;
}

export default function SettingsModal({ isOpen, onClose, settings, onUpdateSettings, onResetSchedule, onDeleteAll }: SettingsModalProps) {
  if (!isOpen) return null;

  const t = translations[settings.language];

  const update = (key: keyof Settings, value: any) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md transition-all animate-fade-in">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-white/20 dark:border-gray-700/50 ring-1 ring-black/5 animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{t.settings}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">

          {/* Language */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{t.language}</label>
            <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-xl backdrop-blur-sm">
              <button
                onClick={() => update('language', 'en')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${settings.language === 'en'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                English
              </button>
              <button
                onClick={() => update('language', 'tr')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${settings.language === 'tr'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                Türkçe
              </button>
            </div>
          </div>

          {/* Clock Type */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{t.clockType}</label>
            <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-xl backdrop-blur-sm">
              <button
                onClick={() => update('clockType', '12h')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${settings.clockType === '12h'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                12 {t.hours}
              </button>
              <button
                onClick={() => update('clockType', '24h')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${settings.clockType === '24h'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                24 {t.hours}
              </button>
            </div>
          </div>

          {/* Schedule View */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{t.scheduleView}</label>
            <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-xl backdrop-blur-sm">
              <button
                onClick={() => update('viewType', 'daily')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${settings.viewType === 'daily'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                {t.daily}
              </button>
              <button
                onClick={() => update('viewType', 'weekly')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${settings.viewType === 'weekly'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                {t.weekly}
              </button>
            </div>
          </div>

          {/* Show Weekend */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{t.showWeekend}</label>
            <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-xl backdrop-blur-sm">
              <button
                onClick={() => update('showWeekend', true)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${settings.showWeekend
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                {t.yes}
              </button>
              <button
                onClick={() => update('showWeekend', false)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${!settings.showWeekend
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                {t.no}
              </button>
            </div>
          </div>

          {/* Start of Week */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{t.startOfWeek}</label>
            <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-xl backdrop-blur-sm">
              <button
                onClick={() => update('startOfWeek', 'monday')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${settings.startOfWeek === 'monday'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                {t.monday}
              </button>
              <button
                onClick={() => update('startOfWeek', 'sunday')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${settings.startOfWeek === 'sunday'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                {t.sunday}
              </button>
            </div>
          </div>

          {/* Time Increment */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{t.timeIncrement}</label>
            <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-xl backdrop-blur-sm">
              {[15, 30, 60].map((inc) => (
                <button
                  key={inc}
                  onClick={() => update('timeIncrement', inc)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${settings.timeIncrement === inc
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                >
                  {inc === 60 ? `1 ${t.hours}` : `${inc} ${t.min}`}
                </button>
              ))}
            </div>
          </div>

          {/* Minimize Height */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{t.minimizeHeight}</label>
            <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-xl backdrop-blur-sm">
              <button
                onClick={() => update('minimizeHeight', false)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${!settings.minimizeHeight
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                {t.no}
              </button>
            </div>
          </div>

          {/* Min Height Slider */}
          {settings.minimizeHeight && (
            <div className="space-y-3 animate-fade-in">
              <label className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{t.minHeight}</label>
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="1"
                  value={settings.minHeight}
                  onChange={(e) => update('minHeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 w-8 text-center">{settings.minHeight}</span>
              </div>
            </div>
          )}

          {/* Destructive Actions */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <button
              onClick={onResetSchedule}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.01]"
            >
              <Trash2 size={18} />
              {t.resetSchedule}
            </button>
            <button
              onClick={onDeleteAll}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.01]"
            >
              <XCircle size={18} />
              {t.deleteAll}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
