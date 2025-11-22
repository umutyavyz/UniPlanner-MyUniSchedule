import { Course } from '@/types';
import { Settings } from '@/types/settings';
import { translations } from '@/lib/i18n';
import { Plus, Check, Edit2, Trash2 } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onAdd: (course: Course) => void;
  onRemove: (courseId: string) => void;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  isAdded: boolean;
  settings: Settings;
}

export default function CourseCard({ course, onAdd, onRemove, onEdit, onDelete, isAdded, settings }: CourseCardProps) {
  const t = translations[settings.language];
  
  const mapDayToTranslation = (day: string) => {
    const map: Record<string, keyof typeof t.days> = {
      'Pazartesi': 'monday',
      'Salı': 'tuesday',
      'Çarşamba': 'wednesday',
      'Perşembe': 'thursday',
      'Cuma': 'friday',
      'Cumartesi': 'saturday',
      'Pazar': 'sunday'
    };
    return t.days[map[day]];
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all mb-3 animate-fade-in group relative">
      <div className="absolute top-2 right-2 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(course); }}
          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title={t.edit}
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(course.id); }}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title={t.delete}
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {course.color && (
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: course.color }}
              />
            )}
            <span className="font-bold text-gray-900 dark:text-white">{course.code}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              course.type === 'Zorunlu' 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' 
                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            }`}>
              {course.type === 'Zorunlu' ? t.compulsory.toUpperCase() : t.elective.toUpperCase()}
            </span>
          </div>
          <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-1">{course.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{course.instructor}</p>
          {course.classroom && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{course.classroom}</p>
          )}
          <div className="mt-2 space-y-1">
            {course.schedule.map((sch, idx) => (
              <div key={idx} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {mapDayToTranslation(sch.day)}
                </span>
                <span>{sch.startTime} - {sch.endTime}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 mt-6">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md">
            {course.credits} {t.credit}
          </span>
          <button
            onClick={() => isAdded ? onRemove(course.id) : onAdd(course)}
            className={`p-1.5 rounded-lg transition-colors group/btn ${
              isAdded 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400' 
                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'
            }`}
            title={isAdded ? t.delete : t.addCourse}
          >
            {isAdded ? (
              <>
                <Check size={20} className="hidden lg:block lg:group-hover/btn:hidden" />
                <Trash2 size={20} className="block lg:hidden lg:group-hover/btn:block" />
              </>
            ) : (
              <Plus size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
