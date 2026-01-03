'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Calendar, Clock, MapPin, BookOpen, AlertTriangle } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import ToolMarketingSections from '@/components/ToolMarketingSections';

interface Exam {
    id: string;
    course: string;
    type: 'vize' | 'final' | 'quiz' | 'butunleme';
    date: string;
    time: string;
    location: string;
    notes: string;
}

export default function ExamsClient() {
    const [mounted, setMounted] = useState(false);
    const [exams, setExams] = useState<Exam[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newExam, setNewExam] = useState({
        course: '',
        type: 'vize' as Exam['type'],
        date: '',
        time: '',
        location: '',
        notes: ''
    });

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('exams');
        if (saved) {
            setExams(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('exams', JSON.stringify(exams));
        }
    }, [exams, mounted]);

    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('settings') : null;
    const lang = savedSettings ? JSON.parse(savedSettings).language || 'tr' : 'tr';

    const addExam = () => {
        if (!newExam.course.trim() || !newExam.date) return;
        const exam: Exam = {
            id: Date.now().toString(),
            ...newExam
        };
        setExams([...exams, exam]);
        setNewExam({ course: '', type: 'vize', date: '', time: '', location: '', notes: '' });
        setIsAdding(false);
    };

    const deleteExam = (id: string) => {
        setExams(exams.filter(e => e.id !== id));
    };

    const getDaysUntil = (date: string) => {
        const examDate = new Date(date);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        examDate.setHours(0, 0, 0, 0);
        return Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    };

    const getStudyPlan = (daysUntil: number) => {
        if (daysUntil <= 0) return null;
        const totalHours = Math.max(10, daysUntil * 2);
        const hoursPerDay = Math.ceil(totalHours / daysUntil);
        return { totalHours, hoursPerDay };
    };

    const typeLabels = {
        vize: lang === 'tr' ? 'Vize' : 'Midterm',
        final: 'Final',
        quiz: 'Quiz',
        butunleme: lang === 'tr' ? 'Bütünleme' : 'Make-up'
    };

    const typeColors = {
        vize: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        final: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        quiz: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        butunleme: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    };

    const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const upcomingExams = sortedExams.filter(e => getDaysUntil(e.date) >= 0);
    const pastExams = sortedExams.filter(e => getDaysUntil(e.date) < 0);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {lang === 'tr' ? 'Sınav Takvimi' : 'Exam Calendar'}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {lang === 'tr' ? 'Vize ve final tarihlerinizi takip edin' : 'Track your exam dates'}
                            </p>
                        </div>
                    </div>
                    <ModeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Add Button */}
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        {lang === 'tr' ? 'Sınav Ekle' : 'Add Exam'}
                    </button>
                )}

                {/* Add Form */}
                {isAdding && (
                    <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {lang === 'tr' ? 'Yeni Sınav' : 'New Exam'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Ders Adı *' : 'Course Name *'}
                                </label>
                                <input
                                    type="text"
                                    value={newExam.course}
                                    onChange={(e) => setNewExam({ ...newExam, course: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder={lang === 'tr' ? 'Matematik I' : 'Calculus I'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Sınav Türü' : 'Exam Type'}
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(['vize', 'final', 'quiz', 'butunleme'] as const).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setNewExam({ ...newExam, type })}
                                            className={`py-2 rounded-xl text-sm font-medium transition-colors ${newExam.type === type ? typeColors[type] : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            {typeLabels[type]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {lang === 'tr' ? 'Tarih *' : 'Date *'}
                                    </label>
                                    <input
                                        type="date"
                                        value={newExam.date}
                                        onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {lang === 'tr' ? 'Saat' : 'Time'}
                                    </label>
                                    <input
                                        type="time"
                                        value={newExam.time}
                                        onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Konum' : 'Location'}
                                </label>
                                <input
                                    type="text"
                                    value={newExam.location}
                                    onChange={(e) => setNewExam({ ...newExam, location: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder={lang === 'tr' ? 'Amfi A' : 'Lecture Hall A'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Notlar' : 'Notes'}
                                </label>
                                <textarea
                                    value={newExam.notes}
                                    onChange={(e) => setNewExam({ ...newExam, notes: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white resize-none"
                                    placeholder={lang === 'tr' ? 'Çalışma konuları...' : 'Study topics...'}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={addExam}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                                >
                                    {lang === 'tr' ? 'Ekle' : 'Add'}
                                </button>
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {lang === 'tr' ? 'İptal' : 'Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upcoming Exams */}
                {upcomingExams.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Calendar size={20} />
                            {lang === 'tr' ? 'Yaklaşan Sınavlar' : 'Upcoming Exams'}
                        </h2>
                        <div className="space-y-4">
                            {upcomingExams.map((exam) => {
                                const daysUntil = getDaysUntil(exam.date);
                                const studyPlan = getStudyPlan(daysUntil);

                                return (
                                    <div
                                        key={exam.id}
                                        className={`p-5 bg-white dark:bg-gray-900 rounded-2xl border transition-all ${daysUntil <= 1 ? 'border-red-200 dark:border-red-800 shadow-red-100 dark:shadow-none' :
                                            daysUntil <= 7 ? 'border-amber-200 dark:border-amber-800' :
                                                'border-gray-200 dark:border-gray-800'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exam.course}</h3>
                                                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${typeColors[exam.type]}`}>
                                                        {typeLabels[exam.type]}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(exam.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                    </span>
                                                    {exam.time && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {exam.time}
                                                        </span>
                                                    )}
                                                    {exam.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin size={14} />
                                                            {exam.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteExam(exam.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        {/* Countdown */}
                                        <div className={`p-4 rounded-xl ${daysUntil <= 1 ? 'bg-red-50 dark:bg-red-900/20' :
                                            daysUntil <= 7 ? 'bg-amber-50 dark:bg-amber-900/20' :
                                                'bg-blue-50 dark:bg-blue-900/20'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className={`text-3xl font-bold ${daysUntil <= 1 ? 'text-red-600 dark:text-red-400' :
                                                        daysUntil <= 7 ? 'text-amber-600 dark:text-amber-400' :
                                                            'text-blue-600 dark:text-blue-400'
                                                        }`}>
                                                        {daysUntil === 0 ? (lang === 'tr' ? 'BUGÜN!' : 'TODAY!') : `${daysUntil} ${lang === 'tr' ? 'gün' : 'days'}`}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {daysUntil === 0 ? (lang === 'tr' ? 'Sınav günü' : 'Exam day') : (lang === 'tr' ? 'kaldı' : 'remaining')}
                                                    </div>
                                                </div>
                                                {studyPlan && daysUntil > 0 && (
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            <BookOpen size={14} />
                                                            {lang === 'tr' ? 'Önerilen Çalışma' : 'Study Plan'}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {lang === 'tr'
                                                                ? `Günde ~${studyPlan.hoursPerDay} saat`
                                                                : `~${studyPlan.hoursPerDay}h/day`}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {exam.notes && (
                                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                                {exam.notes}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Past Exams */}
                {pastExams.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-4">
                            {lang === 'tr' ? 'Geçmiş Sınavlar' : 'Past Exams'}
                        </h2>
                        <div className="space-y-3 opacity-60">
                            {pastExams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${typeColors[exam.type]}`}>
                                            {typeLabels[exam.type]}
                                        </span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{exam.course}</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(exam.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => deleteExam(exam.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {exams.length === 0 && !isAdding && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {lang === 'tr' ? 'Henüz sınav eklenmemiş' : 'No exams added yet'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'tr' ? 'Vize ve final tarihlerinizi ekleyin' : 'Add your midterm and final exam dates'}
                        </p>
                    </div>
                )}
            </main>

            {/* Marketing Sections */}
            <ToolMarketingSections lang={lang} tool="exams" />
        </div>
    );
}
