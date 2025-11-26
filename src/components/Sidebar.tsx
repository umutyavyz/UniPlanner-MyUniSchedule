import { useState } from 'react';
import { Search, PlusCircle } from 'lucide-react';
import { Course } from '@/types';
import { Settings } from '@/types/settings';
import { translations } from '@/lib/i18n';
import CourseCard from './CourseCard';
import AddCourseModal, { COLORS } from './AddCourseModal';
import AdPlaceholder from './AdPlaceholder';

interface SidebarProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onRemoveFromSchedule: (courseId: string) => void;
  onCreateCourse: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  addedCourseIds: string[];
  settings: Settings;
}

export default function Sidebar({ courses, onAddCourse, onRemoveFromSchedule, onCreateCourse, onEditCourse, onDeleteCourse, addedCourseIds, settings }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'Tümü' | 'Zorunlu' | 'Seçmeli'>('Tümü');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

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
    <div className={`
      w-full lg:w-[400px] flex flex-col 
      bg-white dark:bg-gray-900 
      border-t border-gray-200 dark:border-gray-800 
      p-4 lg:p-5 transition-all duration-300 ease-in-out 
      shadow-none lg:shadow-xl lg:shadow-gray-200/50 lg:dark:shadow-none
      order-2 lg:order-1
      min-h-[500px] h-auto lg:h-full lg:rounded-4xl lg:border lg:border-gray-200/60 lg:dark:border-gray-800
    `}>
      
      {/* Search */}
      <div className="relative mb-4 group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-6 p-1.5 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        {(['all', 'compulsory', 'elective'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f === 'all' ? 'Tümü' : f === 'compulsory' ? 'Zorunlu' : 'Seçmeli')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              (f === 'all' && filter === 'Tümü') ||
              (f === 'compulsory' && filter === 'Zorunlu') ||
              (f === 'elective' && filter === 'Seçmeli')
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            {t[f]}
          </button>
        ))}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full py-4 mb-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-semibold flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
      >
        <PlusCircle size={22} />
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
      <div className="flex-1 overflow-y-auto space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
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
          <div className="flex flex-col items-center justify-center h-40 text-center text-gray-400 dark:text-gray-500 mt-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
            <Search size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">{courses.length === 0 ? t.noCourseAdded : t.noCoursesFound}</p>
          </div>
        )}
      </div>
      
      {/* Ad Space - Bottom of Sidebar */}
      {/* <div className="mt-4 flex justify-center shrink-0">
        <AdPlaceholder width="300px" height="250px" text="Sponsorlu Alan" />
      </div> */}
    </div>
  );
}
