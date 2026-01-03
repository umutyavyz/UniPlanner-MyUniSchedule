'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, CheckCircle, XCircle, UserCheck, TrendingUp, Users } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import PageHeader from '@/components/PageHeader';
import ToolMarketingSections from '@/components/ToolMarketingSections';

interface CourseAttendance {
    id: string;
    name: string;
    totalClasses: number;
    attendedClasses: number;
    requiredPercentage: number;
}

export default function AttendanceClient() {
    const [mounted, setMounted] = useState(false);
    const [courses, setCourses] = useState<CourseAttendance[]>([]);
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: '', totalClasses: 14, requiredPercentage: 70 });

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('attendance');
        if (saved) {
            setCourses(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('attendance', JSON.stringify(courses));
        }
    }, [courses, mounted]);

    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('settings') : null;
    const lang = savedSettings ? JSON.parse(savedSettings).language || 'tr' : 'tr';

    const addCourse = () => {
        if (!newCourse.name.trim()) return;
        const course: CourseAttendance = {
            id: Date.now().toString(),
            name: newCourse.name,
            totalClasses: newCourse.totalClasses,
            attendedClasses: 0,
            requiredPercentage: newCourse.requiredPercentage
        };
        setCourses([...courses, course]);
        setNewCourse({ name: '', totalClasses: 14, requiredPercentage: 70 });
        setIsAddingCourse(false);
    };

    const updateAttendance = (id: string, attended: number) => {
        setCourses(courses.map(c =>
            c.id === id ? { ...c, attendedClasses: Math.max(0, Math.min(c.totalClasses, attended)) } : c
        ));
    };

    const deleteCourse = (id: string) => {
        setCourses(courses.filter(c => c.id !== id));
    };

    const getAttendanceStatus = (course: CourseAttendance) => {
        const percentage = (course.attendedClasses / course.totalClasses) * 100;
        const remaining = course.totalClasses - course.attendedClasses;
        const minRequired = Math.ceil(course.totalClasses * (course.requiredPercentage / 100));
        const canMiss = course.attendedClasses - minRequired + remaining;

        if (percentage >= course.requiredPercentage) {
            return { status: 'safe', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', canMiss: Math.max(0, canMiss) };
        } else if (percentage >= course.requiredPercentage - 10) {
            return { status: 'warning', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', canMiss: Math.max(0, canMiss) };
        } else {
            return { status: 'danger', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', canMiss: 0 };
        }
    };

    // Summary stats
    const safeCount = courses.filter(c => getAttendanceStatus(c).status === 'safe').length;
    const warningCount = courses.filter(c => getAttendanceStatus(c).status === 'warning').length;
    const dangerCount = courses.filter(c => getAttendanceStatus(c).status === 'danger').length;

    if (!mounted) return null;

    return (
        <PageWrapper>
            <PageHeader
                title={lang === 'tr' ? 'Devamsızlık Takibi' : 'Attendance Tracker'}
                subtitle={lang === 'tr' ? 'Derslerinize katılımınızı takip edin' : 'Track your class attendance'}
                icon={UserCheck}
                iconGradient="from-cyan-500 to-blue-500"
            />

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Quick Stats */}
                {courses.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-white dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{safeCount}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'tr' ? 'Güvenli' : 'Safe'}</div>
                        </div>
                        <div className="p-4 bg-white dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{warningCount}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'tr' ? 'Dikkat' : 'Warning'}</div>
                        </div>
                        <div className="p-4 bg-white dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{dangerCount}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'tr' ? 'Kritik' : 'Critical'}</div>
                        </div>
                    </div>
                )}

                {/* Add Course Button */}
                {!isAddingCourse && (
                    <button
                        onClick={() => setIsAddingCourse(true)}
                        className="w-full mb-6 p-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-gray-500 dark:text-gray-400 hover:border-cyan-500 hover:text-cyan-600 dark:hover:border-cyan-500 dark:hover:text-cyan-400 transition-all flex items-center justify-center gap-2 bg-white/50 dark:bg-white/[0.01]"
                    >
                        <Plus size={20} />
                        {lang === 'tr' ? 'Ders Ekle' : 'Add Course'}
                    </button>
                )}

                {/* Add Course Form */}
                {isAddingCourse && (
                    <div className="mb-6 p-6 bg-white dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {lang === 'tr' ? 'Yeni Ders Ekle' : 'Add New Course'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    {lang === 'tr' ? 'Ders Adı' : 'Course Name'}
                                </label>
                                <input
                                    type="text"
                                    value={newCourse.name}
                                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder={lang === 'tr' ? 'Matematik I' : 'Calculus I'}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        {lang === 'tr' ? 'Toplam Ders' : 'Total Classes'}
                                    </label>
                                    <input
                                        type="number"
                                        value={newCourse.totalClasses}
                                        onChange={(e) => setNewCourse({ ...newCourse, totalClasses: parseInt(e.target.value) || 14 })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        {lang === 'tr' ? 'Zorunlu (%)' : 'Required (%)'}
                                    </label>
                                    <input
                                        type="number"
                                        value={newCourse.requiredPercentage}
                                        onChange={(e) => setNewCourse({ ...newCourse, requiredPercentage: parseInt(e.target.value) || 70 })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={addCourse}
                                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg transition-all hover:shadow-cyan-500/25"
                                >
                                    {lang === 'tr' ? 'Ekle' : 'Add'}
                                </button>
                                <button
                                    onClick={() => setIsAddingCourse(false)}
                                    className="px-6 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    {lang === 'tr' ? 'İptal' : 'Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Course List */}
                {courses.length === 0 && !isAddingCourse ? (
                    <div className="text-center py-16 bg-white/50 dark:bg-white/[0.01] rounded-3xl border border-gray-100 dark:border-white/5">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {lang === 'tr' ? 'Henüz ders eklenmemiş' : 'No courses added yet'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {lang === 'tr' ? 'Devamsızlık takibi için ders ekleyin' : 'Add courses to track attendance'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {courses.map((course) => {
                            const status = getAttendanceStatus(course);
                            const percentage = Math.round((course.attendedClasses / course.totalClasses) * 100);

                            return (
                                <div
                                    key={course.id}
                                    className="p-5 bg-white dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {lang === 'tr' ? `Zorunlu: %${course.requiredPercentage}` : `Required: ${course.requiredPercentage}%`}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteCourse(course.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className={`font-semibold ${status.color}`}>%{percentage}</span>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {course.attendedClasses} / {course.totalClasses}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${status.status === 'safe' ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                                                    status.status === 'warning' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-rose-500'
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Attendance Controls */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateAttendance(course.id, course.attendedClasses - 1)}
                                                className="w-10 h-10 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-bold text-lg"
                                            >
                                                −
                                            </button>
                                            <span className="w-12 text-center text-xl font-bold text-gray-900 dark:text-white">
                                                {course.attendedClasses}
                                            </span>
                                            <button
                                                onClick={() => updateAttendance(course.id, course.attendedClasses + 1)}
                                                className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors font-bold text-lg"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg}`}>
                                            {status.status === 'safe' && <CheckCircle size={16} className={status.color} />}
                                            {status.status === 'warning' && <AlertTriangle size={16} className={status.color} />}
                                            {status.status === 'danger' && <XCircle size={16} className={status.color} />}
                                            <span className={`text-sm font-medium ${status.color}`}>
                                                {status.status === 'safe' && (lang === 'tr' ? `${status.canMiss} hak` : `${status.canMiss} left`)}
                                                {status.status === 'warning' && (lang === 'tr' ? 'Dikkat!' : 'Warning!')}
                                                {status.status === 'danger' && (lang === 'tr' ? 'Kritik!' : 'Critical!')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Marketing Sections */}
            <ToolMarketingSections lang={lang as 'tr' | 'en'} tool="attendance" hideScrollIndicator={true} />
        </PageWrapper>
    );
}
