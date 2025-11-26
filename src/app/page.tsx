'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Course, ScheduledCourse } from '@/types';
import { Settings, defaultSettings } from '@/types/settings';
import { translations } from '@/lib/i18n';
import Sidebar from '@/components/Sidebar';
import Calendar from '@/components/Calendar';
import SettingsModal from '@/components/SettingsModal';
import { GraduationCap, Printer, ImageDown, CalendarPlus, Settings as SettingsIcon, Globe, Download, ChevronDown, Menu, FileJson, Upload, Share2, Calculator } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import LandingPage from '@/components/LandingPage';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import DownloadOverlay, { ExportStatus } from '@/components/DownloadOverlay';
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
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  
  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDestructive: false
  });

  const appRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const scrollToApp = () => {
    appRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const savedAllCourses = localStorage.getItem('allCourses');
    const savedSelectedCourses = localStorage.getItem('selectedCourses');
    const savedSettings = localStorage.getItem('settings');
    
    // Check for shared URL data
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');

    if (sharedData) {
      try {
        const decoded = decodeURIComponent(atob(sharedData));
        const data = JSON.parse(decoded);
        
        // Map minified data back to full structure
        if (data.s) {
          const courses: ScheduledCourse[] = data.s.map((c: any) => ({
            id: c.id,
            code: c.c,
            name: c.n,
            instructor: c.i,
            classroom: c.r,
            credits: c.cr,
            type: c.t,
            color: c.co,
            schedule: c.sc.map((s: any) => ({ day: s.d, startTime: s.s, endTime: s.e }))
          }));
          
          setSelectedCourses(courses);
          // Also add to all courses if not present (simplified)
          setAllCourses(courses);
          
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname);
        }
      } catch (e) {
        console.error('Error parsing shared data', e);
      }
    } else {
      if (savedAllCourses) setAllCourses(JSON.parse(savedAllCourses));
      if (savedSelectedCourses) setSelectedCourses(JSON.parse(savedSelectedCourses));
    }
    
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    } else {
      // Detect browser language for default
      const browserLang = navigator.language;
      const isTurkish = browserLang.toLowerCase().startsWith('tr');
      setSettings({
        ...defaultSettings,
        language: isTurkish ? 'tr' : 'en'
      });
    }
    
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
    setConfirmDialog({
      isOpen: true,
      title: t.deleteCourse,
      message: t.confirmDeleteCourse,
      isDestructive: true,
      onConfirm: () => {
        setAllCourses(allCourses.filter(c => c.id !== courseId));
        setSelectedCourses(selectedCourses.filter(c => c.id !== courseId));
      }
    });
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
    setConfirmDialog({
      isOpen: true,
      title: t.deleteAll,
      message: t.confirmDeleteAll,
      isDestructive: true,
      onConfirm: () => {
        setAllCourses([]);
        setSelectedCourses([]);
      }
    });
  };

  const handleReset = () => {
    setConfirmDialog({
      isOpen: true,
      title: t.resetSchedule,
      message: t.confirmResetSchedule,
      isDestructive: true,
      onConfirm: () => {
        setSelectedCourses([]);
      }
    });
  };

  const handleDownloadImage = async () => {
    setExportStatus('loading');
    const element = document.getElementById('calendar-container');
    if (!element) {
      setExportStatus('idle');
      return;
    }

    // Find the scrollable element to get the full height
    const scrollableElement = element.querySelector('.overflow-auto');
    const fullHeight = scrollableElement ? scrollableElement.scrollHeight : element.scrollHeight;

    try {
      // Wait a bit for UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        height: fullHeight,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#030712' : '#ffffff',
        filter: (node) => {
          return !node.classList?.contains('print:hidden') && !node.classList?.contains('export-exclude');
        },
        style: {
          height: `${fullHeight}px`,
          maxHeight: 'none',
          overflow: 'visible',
          borderRadius: '0',
          border: 'none',
          boxShadow: 'none'
        },
        // @ts-ignore
        onClone: (clonedNode: HTMLElement) => {
           const inner = clonedNode.querySelector('.overflow-auto') as HTMLElement;
           if (inner) {
               inner.style.overflow = 'visible';
               inner.style.height = 'auto';
           }
        }
      });
      
      const link = document.createElement('a');
      link.download = 'ders_programi.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (err) {
      console.error("Ekran görüntüsü hatası:", err);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 2000);
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

  const handleBackup = () => {
    const backupData = {
      allCourses,
      selectedCourses,
      settings,
      version: '1.0',
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `uniplanner_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.allCourses && data.selectedCourses && data.settings) {
          setAllCourses(data.allCourses);
          setSelectedCourses(data.selectedCourses);
          setSettings(data.settings);
          setError(t.restoreSuccess);
          setTimeout(() => setError(null), 3000);
        } else {
          throw new Error('Invalid format');
        }
      } catch (err) {
        console.error('Restore error:', err);
        setError(t.restoreError);
        setTimeout(() => setError(null), 3000);
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const handleShareURL = () => {
    const data = {
      s: selectedCourses.map(c => ({
        id: c.id,
        c: c.code,
        n: c.name,
        i: c.instructor,
        r: c.classroom,
        cr: c.credits,
        t: c.type,
        co: c.color,
        sc: c.schedule.map(s => ({ d: s.day, s: s.startTime, e: s.endTime }))
      }))
    };
    
    const jsonString = JSON.stringify(data);
    const encoded = btoa(encodeURIComponent(jsonString));
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setError(t.urlCopied);
      setTimeout(() => setError(null), 3000);
    });
  };

  const handleDownloadPDF = async () => {
    setExportStatus('loading');
    const element = document.getElementById('calendar-container');
    if (!element) {
      setExportStatus('idle');
      return;
    }

    // Find the scrollable element to get the full height
    const scrollableElement = element.querySelector('.overflow-auto');
    const fullHeight = scrollableElement ? scrollableElement.scrollHeight : element.scrollHeight;

    try {
      // Wait a bit for UI to update
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        height: fullHeight,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#030712' : '#ffffff',
        filter: (node) => {
          return !node.classList?.contains('print:hidden') && !node.classList?.contains('export-exclude');
        },
        style: {
          height: `${fullHeight}px`,
          maxHeight: 'none',
          overflow: 'visible',
          borderRadius: '0',
          border: 'none',
          boxShadow: 'none'
        },
        // @ts-ignore
        onClone: (clonedNode: HTMLElement) => {
           const inner = clonedNode.querySelector('.overflow-auto') as HTMLElement;
           if (inner) {
               inner.style.overflow = 'visible';
               inner.style.height = 'auto';
           }
        }
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [element.offsetWidth, fullHeight]
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ders_programi.pdf');
      
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);

    } catch (err) {
      console.error("PDF oluşturma hatası:", err);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 2000);
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
    <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 transition-colors selection:bg-blue-100 dark:selection:bg-blue-900">
      {/* Top Navigation Bar - Glassmorphism Style */}
      <header className="h-16 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-50 transition-all bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 supports-backdrop-filter:bg-white/60">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="bg-linear-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20 hidden sm:block transform hover:scale-105 transition-transform duration-300">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">UniPlanner <span className="text-blue-600 dark:text-blue-400">Pro</span></h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide mt-0.5 hidden sm:block opacity-80">{t.semesterPlanner}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <Link 
              href="/gpa-calculator"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
            >
              <Calculator size={18} />
              <span>{t.gpaCalculator}</span>
            </Link>

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


          </div>
        </div>
      </header>

      {/* Main App Content */}
      <div ref={appRef} className="flex flex-col lg:flex-row h-[calc(100vh-64px)] relative overflow-hidden bg-gray-50/50 dark:bg-gray-950 lg:p-6 lg:gap-6">
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
        <div id="calendar-container" className="flex-1 h-full overflow-hidden flex flex-col bg-white dark:bg-gray-900 lg:rounded-2xl lg:border lg:border-gray-200/60 lg:dark:border-gray-800 lg:shadow-xl lg:shadow-gray-200/50 lg:dark:shadow-none transition-all">
          {/* Toolbar */}
          <div className="export-exclude flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
            {/* Stats */}
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.totalCourse}:</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedCourses.length}</span>
               </div>
               <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
               <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.totalCredit}:</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{totalCredits}</span>
               </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
               {/* Settings */}
               <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
                  title={t.settings}
                >
                  <SettingsIcon size={18} />
                  <span className="text-sm font-medium hidden sm:inline">{t.settings}</span>
                </button>

               {/* Export */}
               <div className="relative">
                  <button 
                    onClick={() => {
                      setIsExportOpen(!isExportOpen);
                      setIsLanguageOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm shadow-blue-500/20"
                    title="Export"
                  >
                    <Download size={16} />
                    <span className="text-sm font-medium hidden sm:inline">{t.download}</span>
                    <ChevronDown size={14} className={`transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isExportOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsExportOpen(false)}></div>
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-1 z-40 animate-fade-in max-h-[80vh] overflow-y-auto">
                        <button 
                          onClick={() => {
                            handleDownloadPDF();
                            setIsExportOpen(false);
                          }}
                          disabled={exportStatus !== 'idle'}
                          className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Printer size={16} />
                          {t.print}
                        </button>
                        <button 
                          onClick={() => {
                            handleDownloadImage();
                            setIsExportOpen(false);
                          }}
                          disabled={exportStatus !== 'idle'}
                          className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ImageDown size={16} />
                          {t.downloadImage}
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
                        <button 
                          onClick={() => {
                            handleShareURL();
                            setIsExportOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Share2 size={16} />
                          {t.shareURL}
                        </button>
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                        <button 
                          onClick={() => {
                            handleBackup();
                            setIsExportOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                        >
                          <FileJson size={16} />
                          {t.backup}
                        </button>
                        <button 
                          onClick={() => {
                            fileInputRef.current?.click();
                            setIsExportOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Upload size={16} />
                          {t.restore}
                        </button>
                      </div>
                    </>
                  )}
               </div>
               
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleRestore} 
                  className="hidden" 
                  accept=".json"
                />
            </div>
          </div>
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

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDestructive={confirmDialog.isDestructive}
        confirmText={t.yes}
        cancelText={t.no}
      />

      <DownloadOverlay 
        status={exportStatus}
        messages={{
          loading: t.preparingDownload,
          success: t.downloadSuccess,
          error: t.downloadError
        }}
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