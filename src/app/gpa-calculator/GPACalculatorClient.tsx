'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Calculator, GraduationCap, RotateCcw, Globe } from 'lucide-react';
import { translations } from '@/lib/i18n';
import { Settings, defaultSettings } from '@/types/settings';
import { ModeToggle } from '@/components/mode-toggle';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import GpaInfoSection from '@/components/GpaInfoSection';

interface GPACourse {
  id: string;
  name: string;
  credits: number | string;
  grade: string;
}

type GradingSystemKey = 'aa-ff' | 'a-f-plus' | 'a-f' | 'a1-f3';

const GRADING_SYSTEMS: Record<GradingSystemKey, { label: string; grades: Record<string, number> }> = {
  'aa-ff': {
    label: 'AA, BA, BB, CB, CC, DC, DD, FD, FF',
    grades: {
      'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
      'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FD': 0.5, 'FF': 0.0
    }
  },
  'a-f-plus': {
    label: 'A, A-, B+, B, B-, C+, C, C-, D+, D, F',
    grades: {
      'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
    }
  },
  'a-f': {
    label: 'A, B, C, D, F',
    grades: {
      'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0
    }
  },
  'a1-f3': {
    label: 'A1, A2, A3, B1, B2, B3, C1, C2, C3, D, F1, F2, F3',
    grades: {
      'A1': 4.0, 'A2': 3.75, 'A3': 3.5,
      'B1': 3.25, 'B2': 3.0, 'B3': 2.75,
      'C1': 2.5, 'C2': 2.25, 'C3': 2.0,
      'D': 1.75, 'F1': 1.5, 'F2': 0.0, 'F3': 0.0
    }
  }
};

export default function GPACalculatorClient() {
  const [courses, setCourses] = useState<GPACourse[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [gpa, setGpa] = useState<number | null>(null);
  const [cumulativeGPA, setCumulativeGPA] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // New state variables
  const [calculationMode, setCalculationMode] = useState<'term' | 'cumulative'>('term');
  const [gradingSystem, setGradingSystem] = useState<GradingSystemKey>('aa-ff');
  const [previousGPA, setPreviousGPA] = useState<string>('');
  const [previousCredits, setPreviousCredits] = useState<string>('');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [exitingItems, setExitingItems] = useState<string[]>([]);

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    const savedGPACourses = localStorage.getItem('gpaCourses');
    const savedMode = localStorage.getItem('gpaCalculationMode');
    const savedSystem = localStorage.getItem('gpaGradingSystem');
    const savedPrevGPA = localStorage.getItem('gpaPreviousGPA');
    const savedPrevCredits = localStorage.getItem('gpaPreviousCredits');

    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    } else {
        let isTurkish = false;
        try {
          const browserLang = navigator.language;
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          // Check if browser is Turkish OR if the user is physically in Turkey (Timezone)
          isTurkish = (browserLang && browserLang.toLowerCase().startsWith('tr')) || 
                      (timeZone === 'Europe/Istanbul');
        } catch (e) {
          isTurkish = navigator.language?.toLowerCase().startsWith('tr');
        }

        setSettings({
          ...defaultSettings,
          language: isTurkish ? 'tr' : 'en'
        });
    }

    if (savedGPACourses) {
      setCourses(JSON.parse(savedGPACourses));
    } else {
      // Add one empty course to start
      setCourses([{ id: crypto.randomUUID(), name: '', credits: '', grade: '' }]);
    }

    if (savedMode) setCalculationMode(savedMode as 'term' | 'cumulative');
    if (savedSystem && Object.keys(GRADING_SYSTEMS).includes(savedSystem)) {
      setGradingSystem(savedSystem as GradingSystemKey);
    }
    if (savedPrevGPA) setPreviousGPA(savedPrevGPA);
    if (savedPrevCredits) setPreviousCredits(savedPrevCredits);
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gpaCourses', JSON.stringify(courses));
      localStorage.setItem('gpaCalculationMode', calculationMode);
      localStorage.setItem('gpaGradingSystem', gradingSystem);
      localStorage.setItem('gpaPreviousGPA', previousGPA);
      localStorage.setItem('gpaPreviousCredits', previousCredits);
    }
  }, [courses, calculationMode, gradingSystem, previousGPA, previousCredits, isLoaded]);

  const t = translations[settings.language];

  const addCourse = () => {
    setCourses([...courses, { id: crypto.randomUUID(), name: '', credits: '', grade: '' }]);
  };

  const removeCourse = (id: string) => {
    setExitingItems(prev => [...prev, id]);
    setTimeout(() => {
      setCourses(courses.filter(c => c.id !== id));
      setExitingItems(prev => prev.filter(itemId => itemId !== id));
    }, 300);
  };

  const updateCourse = (id: string, field: keyof GPACourse, value: string | number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleCourseCountChange = (count: number) => {
    const currentCount = courses.length;
    
    if (count > currentCount) {
      const newCourses = [...courses];
      for (let i = 0; i < count - currentCount; i++) {
        newCourses.push({ id: crypto.randomUUID(), name: '', credits: '', grade: '' });
      }
      setCourses(newCourses);
    } else if (count < currentCount) {
      setCourses(courses.slice(0, count));
    }
  };

  const handleSystemChange = (system: GradingSystemKey) => {
    setGradingSystem(system);
    // Reset grades to empty string to force selection
    setCourses(courses.map(c => ({ ...c, grade: '' })));
  };

  const handleReset = () => {
    setCourses([{ id: crypto.randomUUID(), name: '', credits: '', grade: '' }]);
    setCalculationMode('term');
    setGradingSystem('aa-ff');
    setPreviousGPA('');
    setPreviousCredits('');
    setGpa(null);
    setCumulativeGPA(null);
    setIsResetDialogOpen(false);
  };

  const calculateGPA = () => {
    let termPoints = 0;
    let termCredits = 0;
    const currentGrades = GRADING_SYSTEMS[gradingSystem].grades;

    courses.forEach(course => {
      if (course.grade === '' || course.credits === '') return;
      
      const gradeValue = currentGrades[course.grade];
      const creditValue = Number(String(course.credits).replace(',', '.'));
      
      if (gradeValue !== undefined && !isNaN(creditValue)) {
        termPoints += gradeValue * creditValue;
        termCredits += creditValue;
      }
    });

    if (termCredits === 0) {
      setGpa(0);
    } else {
      setGpa(termPoints / termCredits);
    }

    if (calculationMode === 'cumulative') {
      const prevGpaVal = parseFloat(previousGPA) || 0;
      const prevCreditsVal = parseFloat(previousCredits) || 0;
      
      const totalPoints = termPoints + (prevGpaVal * prevCreditsVal);
      const totalCredits = termCredits + prevCreditsVal;
      
      if (totalCredits > 0) {
        setCumulativeGPA(totalPoints / totalCredits);
      } else {
        setCumulativeGPA(0);
      }
    } else {
      setCumulativeGPA(null);
    }
  };

  // Auto calculate when courses or other inputs change
  useEffect(() => {
    if (isLoaded) {
      calculateGPA();
    }
  }, [courses, calculationMode, gradingSystem, previousGPA, previousCredits, isLoaded]);

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      <header className="h-16 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="bg-linear-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20 hidden sm:block">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">UniPlanner <span className="text-blue-600 dark:text-blue-400">Pro</span></h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide mt-0.5 hidden sm:block opacity-80">{t.gpaCalculator}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ModeToggle />
          
          {/* Language Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1"
              title={t.language}
            >
              <Globe size={20} />
              <ChevronDown size={14} className={`transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLanguageOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsLanguageOpen(false)}></div>
                <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-1 z-40 animate-fade-in">
                  <button
                    onClick={() => {
                      setSettings({ ...settings, language: 'tr' });
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      settings.language === 'tr' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    Türkçe
                  </button>
                  <button
                    onClick={() => {
                      setSettings({ ...settings, language: 'en' });
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      settings.language === 'en' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    English
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="text-blue-600 dark:text-blue-400" />
              {t.gpaCalculator}
            </h2>
            
            <div className="flex gap-6 w-full md:w-auto justify-end">
              {gpa !== null && (
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">{t.termGPA}</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{gpa.toFixed(2)}</div>
                </div>
              )}
              
              {calculationMode === 'cumulative' && cumulativeGPA !== null && (
                <div className="text-right pl-6 border-l border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">{t.cumulativeGPA}</div>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{cumulativeGPA.toFixed(2)}</div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t.calculationMode}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="mode" 
                    checked={calculationMode === 'term'} 
                    onChange={() => setCalculationMode('term')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t.termGPA}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="mode" 
                    checked={calculationMode === 'cumulative'} 
                    onChange={() => setCalculationMode('cumulative')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t.cumulativeGPA}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.gradingSystem}</label>
              <div className="relative">
                <select
                  value={gradingSystem}
                  onChange={(e) => handleSystemChange(e.target.value as GradingSystemKey)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all"
                >
                  {Object.entries(GRADING_SYSTEMS).map(([key, system]) => (
                    <option key={key} value={key}>{system.label}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.courseCount}</label>
              <div className="relative">
                <select
                  value={courses.length}
                  onChange={(e) => handleCourseCountChange(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {calculationMode === 'cumulative' && (
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.currentGPA}</label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    step="0.01"
                    value={previousGPA}
                    onChange={(e) => setPreviousGPA(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.currentTotalCredits}</label>
                  <input
                    type="number"
                    min="0"
                    value={previousCredits}
                    onChange={(e) => setPreviousCredits(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {courses.map((course, index) => (
              <div 
                key={course.id} 
                className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out hover:border-gray-200 dark:hover:border-gray-700 ${
                  exitingItems.includes(course.id) ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">{t.courseName}</label>
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                    placeholder={`${t.course} ${index + 1}`}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                
                <div className="flex gap-4 w-full sm:w-auto">
                  <div className="w-24">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">{t.credit}</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={course.credits}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Allow only numbers, dot, comma
                        if (!/^[0-9.,]*$/.test(val)) return;
                        // Max 2 digits for integer part
                        if (val.split(/[.,]/)[0].length > 2) return;
                        updateCourse(course.id, 'credits', val);
                      }}
                      placeholder={t.creditAbbr}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center"
                    />
                  </div>
                  
                  <div className="w-24">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">{t.grade}</label>
                    <div className="relative">
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all"
                      >
                        <option value="">{t.select}</option>
                        {Object.keys(GRADING_SYSTEMS[gradingSystem].grades).map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end pb-1">
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title={t.delete}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={addCourse}
              className="flex-1 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-semibold hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              {t.addCourse}
            </button>
            
            <button
              onClick={() => setIsResetDialogOpen(true)}
              className="px-6 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-semibold hover:border-red-500 hover:text-red-500 dark:hover:border-red-400 dark:hover:text-red-400 transition-all flex items-center justify-center gap-2"
              title={t.reset}
            >
              <RotateCcw size={20} />
              <span className="hidden sm:inline">{t.reset}</span>
            </button>
          </div>
        </div>
      </div>

      <GpaInfoSection t={t} />

      <ConfirmationDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleReset}
        title={t.reset}
        message={t.confirmReset}
        confirmText={t.yes}
        cancelText={t.cancel}
        isDestructive={true}
      />
    </main>
  );
}

function ChevronDown({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
