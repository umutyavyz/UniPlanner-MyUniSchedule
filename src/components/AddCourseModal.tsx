import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
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

  const t = translations[settings.language];

  useEffect(() => {
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
  }, [initialData, isOpen, defaultColor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credits === '') return;

    if (!code && !name) {
      alert(t.codeOrNameRequired);
      return;
    }

    // Validate time slots
    for (const schedule of schedules) {
      const start = schedule.startTime.split(':').map(Number);
      const end = schedule.endTime.split(':').map(Number);
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      
      if (endMinutes <= startMinutes) {
        alert(t.endTimeBeforeStart);
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

  if (!isOpen) return null;

  const addSchedule = () => {
    setSchedules([...schedules, { day: 'Pazartesi', startTime: '09:00', endTime: '10:00' }]);
  };

  const removeSchedule = (index: number) => {
    if (schedules.length === 1) {
      alert(settings.language === 'tr' ? 'En az bir zaman dilimi olmalıdır.' : 'At least one time slot is required.');
      return;
    }
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const updateSchedule = (index: number, field: string, value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in mx-2 sm:mx-0">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{initialData ? t.edit : t.addCourse}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.courseCode}</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MAT101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.courseName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Matematik I"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.instructor}</label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Prof. Dr. ..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.classroom}</label>
              <input
                type="text"
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="D-101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.credit}</label>
              <input
                required
                type="number"
                min="0"
                value={credits}
                onChange={(e) => setCredits(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.type}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CourseType)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Zorunlu">{t.compulsory}</option>
                <option value="Seçmeli">{t.elective}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.color}</label>
              <div className="flex gap-2 mt-2 flex-wrap" role="radiogroup" aria-label={t.color}>
                {COLORS.map((c, idx) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-blue-500' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }}
                    aria-label={`${t.color} ${idx + 1}`}
                    role="radio"
                    aria-checked={color === c}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.schedule}</label>
              <button
                type="button"
                onClick={addSchedule}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Plus size={16} />
                {t.addTimeSlot}
              </button>
            </div>
            <div className="space-y-2">
              {schedules.map((schedule, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg sm:bg-transparent sm:p-0">
                  <select
                    value={schedule.day}
                    onChange={(e) => updateSchedule(index, 'day', e.target.value)}
                    className="w-full sm:flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {DAYS.map(day => (
                      <option key={day} value={day}>{getDayLabel(day)}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                      className="flex-1 sm:w-32 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <span className="self-center text-gray-400 shrink-0 hidden sm:block">-</span>
                    <input
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                      className="flex-1 sm:w-32 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="w-full sm:w-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0 flex justify-center items-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
