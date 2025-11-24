import { useState } from 'react';
import { Search, PlusCircle, X } from 'lucide-react';
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
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ courses, onAddCourse, onRemoveFromSchedule, onCreateCourse, onEditCourse, onDeleteCourse, addedCourseIds, settings, isOpen, onClose }: SidebarProps) {
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-[85vw] sm:w-[400px] flex flex-col h-full 
        bg-white dark:bg-gray-900 border-r lg:border-0 border-gray-200 dark:border-gray-800 
        p-5 overflow-hidden transition-all duration-300 ease-in-out shadow-2xl lg:shadow-xl lg:shadow-gray-200/50 lg:dark:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:inset-auto lg:h-full lg:rounded-[2rem] lg:border lg:border-gray-200/60 lg:dark:border-gray-800
      `}>
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Dersler</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
          {(['all', 'compulsory', 'elective'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f === 'all' ? 'Tümü' : f === 'compulsory' ? 'Zorunlu' : 'Seçmeli')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                (f === 'all' && filter === 'Tümü') || (f === 'compulsory' && filter === 'Zorunlu') || (f === 'elective' && filter === 'Seçmeli')
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm scale-[1.02]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {t[f]}
            </button>
          ))}
        </div>

        {/* Add Custom Course Button */}
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
        <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
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
    </>
  );
}
