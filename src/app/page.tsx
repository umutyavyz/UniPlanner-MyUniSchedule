'use client';

import React, { useState, useEffect } from 'react';
import { Course, ScheduledCourse } from '@/types';
import { Settings, defaultSettings } from '@/types/settings';
import { translations } from '@/lib/i18n';
import Sidebar from '@/components/Sidebar';
import Calendar from '@/components/Calendar';
import SettingsModal from '@/components/SettingsModal';
import { GraduationCap, Printer, Trash2, XCircle, ImageDown, CalendarPlus, Settings as SettingsIcon, Globe, Download, ChevronDown, Menu } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import AdPlaceholder from '@/components/AdPlaceholder';
import LandingPage from '@/components/LandingPage';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function Home() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<ScheduledCourse[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const appRef = React.useRef<HTMLDivElement>(null);

  const scrollToApp = () => {
    appRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const savedAllCourses = localStorage.getItem('allCourses');
    const savedSelectedCourses = localStorage.getItem('selectedCourses');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedAllCourses) setAllCourses(JSON.parse(savedAllCourses));
    if (savedSelectedCourses) setSelectedCourses(JSON.parse(savedSelectedCourses));
    if (savedSettings) setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    
    setIsLoaded(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('allCourses', JSON.stringify(allCourses));
      localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
      localStorage.setItem('settings', JSON.stringify(settings));
    }
  }, [allCourses, selectedCourses, settings, isLoaded]);

  const t = translations[settings.language];

  const checkConflict = (newCourse: Course, currentCourses: ScheduledCourse[]): boolean => {
    for (const newSchedule of newCourse.schedule) {
      const newStart = parseInt(newSchedule.startTime.replace(':', ''));
      const newEnd = parseInt(newSchedule.endTime.replace(':', ''));

      for (const existingCourse of currentCourses) {
        for (const existingSchedule of existingCourse.schedule) {
          if (newSchedule.day === existingSchedule.day) {
            const existingStart = parseInt(existingSchedule.startTime.replace(':', ''));
            const existingEnd = parseInt(existingSchedule.endTime.replace(':', ''));

            if (newStart < existingEnd && newEnd > existingStart) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const handleCreateCourse = (course: Course) => {
    setAllCourses([...allCourses, course]);
    // Optionally auto-add to schedule if no conflict
    if (!checkConflict(course, selectedCourses)) {
      setSelectedCourses([...selectedCourses, course]);
    } else {
      setError(t.conflictDetected.replace('{code}', course.code));
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEditCourse = (updatedCourse: Course) => {
    setAllCourses(allCourses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    setSelectedCourses(selectedCourses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm(t.confirmDeleteCourse)) {
      setAllCourses(allCourses.filter(c => c.id !== courseId));
      setSelectedCourses(selectedCourses.filter(c => c.id !== courseId));
    }
  };

  const handleAddCourse = (course: Course) => {
    if (checkConflict(course, selectedCourses)) {
      setError(t.conflictDetected.replace('{code}', course.code));
      setTimeout(() => setError(null), 3000);
      return;
    }
    setSelectedCourses([...selectedCourses, course]);
  };

  const handleRemoveFromSchedule = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== courseId));
  };

  const handleDeleteAll = () => {
    if (confirm(t.confirmDeleteAll)) {
      setAllCourses([]);
      setSelectedCourses([]);
    }
  };

  const handleReset = () => {
    if (confirm(t.confirmResetSchedule)) {
      setSelectedCourses([]);
    }
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById('calendar-container');
    if (!element) return;

    try {
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#030712' : '#ffffff',
        filter: (node) => {
          return !node.classList?.contains('print:hidden');
        }
      });
      
      const link = document.createElement('a');
      link.download = 'ders_programi.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Ekran görüntüsü hatası:", err);
      setError(t.imageDownloadError);
      setTimeout(() => setError(null), 3000);
    }
  };

  // 2. Takvime Ekle (.ics)
  const handleAddToCalendar = () => {
    const daysMap: { [key: string]: number } = {
      'Pazartesi': 1, 'Salı': 2, 'Çarşamba': 3, 'Perşembe': 4, 'Cuma': 5
    };

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//UniPlanner Pro//TR\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";

    selectedCourses.forEach(course => {
      course.schedule.forEach(sch => {
        const now = new Date();
        const dayIndex = daysMap[sch.day];
        const currentDay = now.getDay(); 
        
        let daysUntil = dayIndex - currentDay;
        if (daysUntil <= 0) daysUntil += 7;
        
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + daysUntil);
        
        const year = nextDate.getFullYear();
        const month = (nextDate.getMonth() + 1).toString().padStart(2, '0');
        const day = nextDate.getDate().toString().padStart(2, '0');
        
        const start = sch.startTime.replace(':', '') + '00';
        const end = sch.endTime.replace(':', '') + '00';
        
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `SUMMARY:${course.code} - ${course.name}\n`;
        icsContent += `DTSTART:${year}${month}${day}T${start}\n`;
        icsContent += `DTEND:${year}${month}${day}T${end}\n`;
        icsContent += `RRULE:FREQ=WEEKLY;INTERVAL=1\n`; 
        icsContent += `LOCATION:${course.classroom || ''}\n`;
        icsContent += `DESCRIPTION:${course.instructor || ''}\n`;
        icsContent += "END:VEVENT\n";
      });
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ders_programi.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('calendar-container');
    if (!element) return;

    try {
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#030712' : '#ffffff',
        filter: (node) => {
          return !node.classList?.contains('print:hidden');
        }
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight]
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ders_programi.pdf');

    } catch (err) {
      console.error("PDF oluşturma hatası:", err);
      setError(t.imageDownloadError);
      setTimeout(() => setError(null), 3000);
    }
  };

  const totalCredits = selectedCourses.reduce((acc, curr) => acc + curr.credits, 0);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-gray-900 shrink-0 z-50 sticky top-0 transition-colors">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <div className="bg-blue-500 p-2 rounded-lg text-white shadow-lg shadow-blue-500/30 hidden sm:block">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white leading-none">UniPlanner <span className="text-blue-500">Pro</span></h1>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide mt-0.5 hidden sm:block">{t.semesterPlanner}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden md:flex items-center bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-1.5 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
            <div className="flex flex-col items-center px-3 border-r border-gray-200 dark:border-gray-700">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.totalCourse}</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400 leading-none mt-0.5">{selectedCourses.length}</span>
            </div>
            <div className="flex flex-col items-center px-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.totalCredit}</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400 leading-none mt-0.5">{totalCredits}</span>
            </div>
          </div>

                    <div className="flex items-center gap-1 sm:gap-2">
            <ModeToggle />

            {/* Language Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsLanguageOpen(!isLanguageOpen);
                  setIsExportOpen(false);
                }}
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

            {/* Export Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsExportOpen(!isExportOpen);
                  setIsLanguageOpen(false);
                }}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1"
                title="Export"
              >
                <Download size={20} />
                <ChevronDown size={14} className={`transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExportOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsExportOpen(false)}></div>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-1 z-40 animate-fade-in">
                    <button 
                      onClick={() => {
                        handleDownloadImage();
                        setIsExportOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                    >
                      <ImageDown size={16} />
                      {t.downloadImage}
                    </button>
                    <button 
                      onClick={() => {
                        handleDownloadPDF();
                        setIsExportOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Printer size={16} />
                      {t.print}
                    </button>
                    <button 
                      onClick={() => {
                        handleAddToCalendar();
                        setIsExportOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                    >
                      <CalendarPlus size={16} />
                      {t.addToCalendar}
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={t.settings}
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main App Content */}
      <div ref={appRef} className="flex flex-col lg:flex-row h-[calc(100vh-64px)] relative overflow-hidden">
        <Sidebar 
          courses={allCourses}
          onAddCourse={handleAddCourse} 
          onRemoveFromSchedule={handleRemoveFromSchedule}
          onCreateCourse={handleCreateCourse}
          onEditCourse={handleEditCourse}
          onDeleteCourse={handleDeleteCourse}
          addedCourseIds={selectedCourses.map(c => c.id)} 
          settings={settings}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div id="calendar-container" className="flex-1 h-full overflow-auto flex flex-col bg-white dark:bg-gray-950">
          <Calendar courses={selectedCourses} settings={settings} />
        </div>
      </div>

      {/* Landing Page Content */}
      <LandingPage settings={settings} onStart={scrollToApp} />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings} 
        onUpdateSettings={setSettings}
        onResetSchedule={handleReset}
        onDeleteAll={handleDeleteAll}
      />

      {/* Error Toast */}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-fade-in z-50 max-w-md text-center">
          {error}
        </div>
      )}
    </main>
  );
}
