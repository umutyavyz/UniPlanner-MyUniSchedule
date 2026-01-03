import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, Check } from 'lucide-react';
import { Course, CourseType } from '@/types';
import { Settings } from '@/types/settings';
import { translations } from '@/lib/i18n';



const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'] as const;
export const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  initialData?: Course | null;
  settings: Settings;
  defaultColor?: string;
}



export default function AddCourseModal({ isOpen, onClose, onSave, initialData, settings, defaultColor }: AddCourseModalProps) {
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [classroom, setClassroom] = useState('');
  const [credits, setCredits] = useState<number | ''>(3);
  const [type, setType] = useState<CourseType>('Zorunlu');
  const [color, setColor] = useState(defaultColor || COLORS[0]);
  const [schedules, setSchedules] = useState<{ day: typeof DAYS[number]; startTime: string; endTime: string }[]>([
    { day: 'Pazartesi', startTime: '09:00', endTime: '10:00' }
  ]);

  const [error, setError] = useState<string | null>(null);

  const t = translations[settings.language];

  useEffect(() => {
    setMounted(true);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code);
      setName(initialData.name);
      setInstructor(initialData.instructor);
      setClassroom(initialData.classroom || '');
      setCredits(initialData.credits);
      setType(initialData.type);
      setColor(initialData.color || COLORS[0]);
      setSchedules(initialData.schedule);
    } else {
      setCode('');
      setName('');
      setInstructor('');
      setClassroom('');
      setCredits(3);
      setType('Zorunlu');
      setColor(defaultColor || COLORS[0]);
      setSchedules([{ day: 'Pazartesi', startTime: '09:00', endTime: '10:00' }]);
    }
    setError(null);
  }, [initialData, isOpen, defaultColor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (credits === '') return;

    if (!code && !name) {
      setError(t.codeOrNameRequired);
      return;
    }

    // Validate time slots
    for (const schedule of schedules) {
      const start = schedule.startTime.split(':').map(Number);
      const end = schedule.endTime.split(':').map(Number);
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];

      if (endMinutes <= startMinutes) {
        setError(t.endTimeBeforeStart);
        return;
      }
    }

    onSave({
      id: initialData?.id || crypto.randomUUID(),
      code,
      name,
      instructor,
      classroom,
      credits,
      type,
      color,
      schedule: schedules
    });
    onClose();
  };

  // Helper to map Turkish day names to translation keys
  const getDayLabel = (day: string) => {
    const map: Record<string, string> = {
      'Pazartesi': 'monday',
      'Salı': 'tuesday',
      'Çarşamba': 'wednesday',
      'Perşembe': 'thursday',
      'Cuma': 'friday',
      'Cumartesi': 'saturday',
      'Pazar': 'sunday'
    };
    const key = map[day] || day.toLowerCase();
    return t.days[key as keyof typeof t.days];
  };

  if (!isOpen || !mounted) return null;

  const addSchedule = () => {
    setSchedules([...schedules, { day: 'Pazartesi', startTime: '09:00', endTime: '10:00' }]);
  };

  const removeSchedule = (index: number) => {
    if (schedules.length === 1) {
      setError(t.minTimeSlotWarning);
      return;
    }
    setSchedules(schedules.filter((_, i) => i !== index));
    setError(null);
  };

  const updateSchedule = (index: number, field: string, value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in transition-all">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in mx-2 sm:mx-0 border border-white/20 dark:border-gray-700/50 ring-1 ring-black/5">
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-10">
          <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {initialData ? t.edit : t.addCourse}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.courseCode}</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                placeholder={t.courseCodePlaceholder}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.courseName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                placeholder={t.courseNamePlaceholder}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.instructor}</label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              placeholder={t.instructorPlaceholder}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.classroom}</label>
              <input
                type="text"
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                placeholder={t.classroomPlaceholder}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.credit}</label>
              <input
                required
                type="number"
                min="0"
                value={credits}
                onChange={(e) => setCredits(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.type}</label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CourseType)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none"
                >
                  <option value="Zorunlu">{t.compulsory}</option>
                  <option value="Seçmeli">{t.elective}</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.color}</label>
              <div className="flex gap-3 mt-2 flex-wrap" role="radiogroup" aria-label={t.color}>
                {COLORS.map((c, idx) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 shadow-md' : 'hover:scale-110 hover:shadow-sm opacity-80 hover:opacity-100'}`}
                    style={{ backgroundColor: c, '--tw-ring-color': c } as React.CSSProperties}
                    aria-label={`${t.color} ${idx + 1}`}
                    role="radio"
                    aria-checked={color === c}
                  >
                    {color === c && <Check size={16} className="text-white drop-shadow-md" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{t.schedule}</label>
              <button
                type="button"
                onClick={addSchedule}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Plus size={16} />
                {t.addTimeSlot}
              </button>
            </div>
            <div className="space-y-3">
              {schedules.map((schedule, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:border-gray-200 dark:hover:border-gray-700">
                  <div className="relative w-full sm:flex-1 min-w-[120px]">
                    <select
                      value={schedule.day}
                      onChange={(e) => updateSchedule(index, 'day', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm appearance-none"
                    >
                      {DAYS.map(day => (
                        <option key={day} value={day}>{getDayLabel(day)}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto items-center">
                    <input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                      className="flex-1 sm:w-32 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    />
                    <span className="text-gray-400 shrink-0 hidden sm:block font-medium">-</span>
                    <input
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                      className="flex-1 sm:w-32 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="w-full sm:w-auto p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0 flex justify-center items-center transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
