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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.settings}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">{t.language}</label>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => update('language', 'en')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.language === 'en' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => update('language', 'tr')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.language === 'tr' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Türkçe
              </button>
            </div>
          </div>

          {/* Clock Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">{t.clockType}</label>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => update('clockType', '12h')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.clockType === '12h' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                12 {t.hours}
              </button>
              <button
                onClick={() => update('clockType', '24h')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.clockType === '24h' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                24 {t.hours}
              </button>
            </div>
          </div>

          {/* Schedule View */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">{t.scheduleView}</label>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => update('viewType', 'daily')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.viewType === 'daily' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.daily}
              </button>
              <button
                onClick={() => update('viewType', 'weekly')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.viewType === 'weekly' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.weekly}
              </button>
            </div>
          </div>

          {/* Show Weekend */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">{t.showWeekend}</label>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => update('showWeekend', true)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.showWeekend 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.yes}
              </button>
              <button
                onClick={() => update('showWeekend', false)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  !settings.showWeekend 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.no}
              </button>
            </div>
          </div>

          {/* Start of Week */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">{t.startOfWeek}</label>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => update('startOfWeek', 'monday')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.startOfWeek === 'monday' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.monday}
              </button>
              <button
                onClick={() => update('startOfWeek', 'sunday')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.startOfWeek === 'sunday' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.sunday}
              </button>
            </div>
          </div>

          {/* Time Increment */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">{t.timeIncrement}</label>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {[15, 30, 60].map((inc) => (
                <button
                  key={inc}
                  onClick={() => update('timeIncrement', inc)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    settings.timeIncrement === inc 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {inc === 60 ? `1 ${t.hours}` : `${inc} ${t.min}`}
                </button>
              ))}
            </div>
          </div>

          {/* Minimize Height */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">{t.minimizeHeight}</label>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => update('minimizeHeight', true)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.minimizeHeight 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.yes}
              </button>
              <button
                onClick={() => update('minimizeHeight', false)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  !settings.minimizeHeight 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.no}
              </button>
            </div>
          </div>

          {/* Min Height Slider */}
          {settings.minimizeHeight && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 dark:text-white">{t.minHeight}</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="1"
                  value={settings.minHeight}
                  onChange={(e) => update('minHeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">{settings.minHeight}</span>
              </div>
            </div>
          )}

          {/* Destructive Actions */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <button 
              onClick={onResetSchedule}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl font-medium transition-colors"
            >
              <Trash2 size={18} />
              {t.resetSchedule}
            </button>
            <button 
              onClick={onDeleteAll}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl font-medium transition-colors"
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
