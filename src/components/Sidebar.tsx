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
    <div className="w-full lg:w-[400px] flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 overflow-hidden transition-colors">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(['all', 'compulsory', 'elective'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f === 'all' ? 'Tümü' : f === 'compulsory' ? 'Zorunlu' : 'Seçmeli')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              (f === 'all' && filter === 'Tümü') || (f === 'compulsory' && filter === 'Zorunlu') || (f === 'elective' && filter === 'Seçmeli')
                ? 'bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            {t[f]}
          </button>
        ))}
      </div>

      {/* Add Custom Course Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full py-3 mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
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
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
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
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            {courses.length === 0 ? t.noCourseAdded : t.noCoursesFound}
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
