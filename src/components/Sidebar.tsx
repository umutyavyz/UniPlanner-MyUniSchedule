import { useState, useEffect } from 'react';
import { Search, PlusCircle, X, BookOpen, Filter } from 'lucide-react';
import { Course } from '@/types';
import { Settings } from '@/types/settings';
import { translations } from '@/lib/i18n';
import CourseCard from './CourseCard';
import AddCourseModal, { COLORS } from './AddCourseModal';

interface SidebarProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onRemoveFromSchedule: (courseId: string) => void;
  onCreateCourse: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  addedCourseIds: string[];
  settings: Settings;
  isOpen?: boolean; // New prop for mobile drawer state
  onClose?: () => void; // New prop for closing mobile drawer
}

export default function Sidebar({ courses, onAddCourse, onRemoveFromSchedule, onCreateCourse, onEditCourse, onDeleteCourse, addedCourseIds, settings, isOpen = true, onClose }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'Tümü' | 'Zorunlu' | 'Seçmeli'>('Tümü');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Close drawer on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const t = translations[settings.language];

  const handleEditClick = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSaveCourse = (course: Course) => {
    if (editingCourse) {
      onEditCourse(course);
    } else {
      onCreateCourse(course);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Tümü' || course.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`
        fixed inset-y-0 left-0 z-50 w-[85%] max-w-[360px] 
        lg:static lg:w-[400px] lg:z-0
        flex flex-col 
        bg-white/95 dark:bg-gray-900/95 lg:bg-white lg:dark:bg-gray-900
        backdrop-blur-xl lg:backdrop-blur-none
        border-r lg:border border-gray-200 dark:border-gray-800 
        transition-transform duration-300 ease-in-out 
        shadow-2xl lg:shadow-xl lg:shadow-gray-200/50 lg:dark:shadow-none
        h-full lg:rounded-3xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Header - Mobile Only Close Button + Title */}
        <div className="flex items-center justify-between p-5 pb-2 lg:pt-6">
          <h2 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent flex items-center gap-2">
            <BookOpen className="text-blue-600" size={24} />
            {t.courses}
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 pt-2 flex flex-col h-full overflow-hidden">
          {/* Search */}
          <div className="relative mb-4 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-1.5 mb-4 p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg">
            {(['all', 'compulsory', 'elective'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f === 'all' ? 'Tümü' : f === 'compulsory' ? 'Zorunlu' : 'Seçmeli')}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-all duration-200 ${(f === 'all' && filter === 'Tümü') ||
                    (f === 'compulsory' && filter === 'Zorunlu') ||
                    (f === 'elective' && filter === 'Seçmeli')
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                {t[f]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 mb-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
          >
            <PlusCircle size={20} />
            {t.addCourse}
          </button>

          <AddCourseModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSave={handleSaveCourse}
            initialData={editingCourse}
            settings={settings}
            defaultColor={COLORS[courses.length % COLORS.length]}
          />

          {/* Course List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 pb-4">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onAdd={onAddCourse}
                onRemove={onRemoveFromSchedule}
                onEdit={handleEditClick}
                onDelete={onDeleteCourse}
                isAdded={addedCourseIds.includes(course.id)}
                settings={settings}
              />
            ))}
            {filteredCourses.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-center text-gray-400 dark:text-gray-500 mt-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                <Search size={28} className="mb-2 opacity-50" />
                <p className="text-sm font-medium">{courses.length === 0 ? t.noCourseAdded : t.noCoursesFound}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
