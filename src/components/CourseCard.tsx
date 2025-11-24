import { Course } from '@/types';
import { Settings } from '@/types/settings';
import { translations } from '@/lib/i18n';
import { Plus, Check, Edit2, Trash2, Minus } from 'lucide-react';

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
    <div className={`
      p-4 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 mb-3 animate-fade-in group relative backdrop-blur-sm
      ${isAdded 
        ? 'bg-green-50/40 dark:bg-green-900/10 border-green-200 dark:border-green-800/30 hover:shadow-green-500/10' 
        : 'bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50 hover:shadow-blue-500/5 dark:hover:shadow-blue-900/10'
      }
    `}>
      <div className="absolute top-3 right-3 flex gap-0.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 transform lg:translate-x-2 lg:group-hover:translate-x-0 z-20">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(course); }}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          title={t.edit}
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(course.id); }}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          title={t.delete}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap pr-12">
            {course.color && (
              <div 
                className="w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-white dark:ring-gray-800" 
                style={{ backgroundColor: course.color }}
              />
            )}
            <span className="font-bold text-gray-900 dark:text-white tracking-tight">{course.code}</span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wide uppercase ${
              course.type === 'Zorunlu' 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' 
                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            }`}>
              {course.type === 'Zorunlu' ? t.compulsory : t.elective}
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wide uppercase bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              {course.credits} {t.credit}
            </span>
          </div>
          <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-1.5 truncate leading-tight pr-4">{course.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{course.instructor}</p>
          {course.classroom && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              {course.classroom}
            </p>
          )}
          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="space-y-1.5">
            {course.schedule.map((sch, idx) => (
              <div key={idx} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-md w-fit">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {mapDayToTranslation(sch.day)}
                </span>
                <span className="w-px h-3 bg-gray-200 dark:bg-gray-700"></span>
                <span className="tabular-nums tracking-tight">{sch.startTime} - {sch.endTime}</span>
              </div>
            ))}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); isAdded ? onRemove(course.id) : onAdd(course); }}
            className={`p-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group/btn shrink-0 ${
              isAdded 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border border-green-200 dark:border-green-900/30 hover:border-red-200 dark:hover:border-red-900/30' 
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-900/30'
            }`}
            title={isAdded ? t.delete : t.addCourse}
          >
            {isAdded ? (
              <>
                <Check size={20} className="hidden lg:block lg:group-hover/btn:hidden" />
                <Minus size={20} className="block lg:hidden lg:group-hover/btn:block" />
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
