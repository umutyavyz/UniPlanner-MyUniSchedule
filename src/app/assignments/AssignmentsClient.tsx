'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Clock, CheckCircle, Circle, AlertCircle, Calendar, Edit2, X, Save } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import ToolMarketingSections from '@/components/ToolMarketingSections';

interface Assignment {
    id: string;
    title: string;
    course: string;
    dueDate: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
}

export default function AssignmentsClient() {
    const [mounted, setMounted] = useState(false);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        course: '',
        dueDate: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high'
    });

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('assignments');
        if (saved) {
            setAssignments(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('assignments', JSON.stringify(assignments));
        }
    }, [assignments, mounted]);

    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('settings') : null;
    const lang = savedSettings ? JSON.parse(savedSettings).language || 'tr' : 'tr';

    const addAssignment = () => {
        if (!newAssignment.title.trim() || !newAssignment.dueDate) return;
        const assignment: Assignment = {
            id: Date.now().toString(),
            ...newAssignment,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        setAssignments([...assignments, assignment]);
        setNewAssignment({ title: '', course: '', dueDate: '', description: '', priority: 'medium' });
        setIsAdding(false);
    };

    const updateStatus = (id: string, status: Assignment['status']) => {
        setAssignments(assignments.map(a => a.id === id ? { ...a, status } : a));
    };

    const deleteAssignment = (id: string) => {
        setAssignments(assignments.filter(a => a.id !== id));
    };

    const getDaysUntilDue = (dueDate: string) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getUrgencyColor = (dueDate: string, status: string) => {
        if (status === 'completed') return 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10';
        const days = getDaysUntilDue(dueDate);
        if (days < 0) return 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10';
        if (days <= 1) return 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10';
        if (days <= 3) return 'border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-900/10';
        return 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900';
    };

    const filteredAssignments = assignments
        .filter(a => {
            if (filter === 'pending') return a.status !== 'completed';
            if (filter === 'completed') return a.status === 'completed';
            return true;
        })
        .sort((a, b) => {
            if (a.status === 'completed' && b.status !== 'completed') return 1;
            if (a.status !== 'completed' && b.status === 'completed') return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

    const priorityColors = {
        low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };

    const priorityLabels = {
        low: lang === 'tr' ? 'Düşük' : 'Low',
        medium: lang === 'tr' ? 'Orta' : 'Medium',
        high: lang === 'tr' ? 'Yüksek' : 'High'
    };

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
                                {lang === 'tr' ? 'Ödev Takibi' : 'Assignments'}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {lang === 'tr' ? 'Ödevlerinizi ve deadline\'ları takip edin' : 'Track your assignments and deadlines'}
                            </p>
                        </div>
                    </div>
                    <ModeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {(['all', 'pending', 'completed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            {f === 'all' && (lang === 'tr' ? 'Tümü' : 'All')}
                            {f === 'pending' && (lang === 'tr' ? 'Bekleyen' : 'Pending')}
                            {f === 'completed' && (lang === 'tr' ? 'Tamamlanan' : 'Completed')}
                        </button>
                    ))}
                </div>

                {/* Add Button */}
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        {lang === 'tr' ? 'Yeni Ödev Ekle' : 'Add New Assignment'}
                    </button>
                )}

                {/* Add Form */}
                {isAdding && (
                    <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {lang === 'tr' ? 'Yeni Ödev' : 'New Assignment'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Ödev Başlığı *' : 'Assignment Title *'}
                                </label>
                                <input
                                    type="text"
                                    value={newAssignment.title}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder={lang === 'tr' ? 'Proje ödevi' : 'Project assignment'}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {lang === 'tr' ? 'Ders' : 'Course'}
                                    </label>
                                    <input
                                        type="text"
                                        value={newAssignment.course}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                        placeholder={lang === 'tr' ? 'Matematik' : 'Calculus'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {lang === 'tr' ? 'Teslim Tarihi *' : 'Due Date *'}
                                    </label>
                                    <input
                                        type="date"
                                        value={newAssignment.dueDate}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Öncelik' : 'Priority'}
                                </label>
                                <div className="flex gap-2">
                                    {(['low', 'medium', 'high'] as const).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setNewAssignment({ ...newAssignment, priority: p })}
                                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${newAssignment.priority === p ? priorityColors[p] : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            {priorityLabels[p]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Açıklama' : 'Description'}
                                </label>
                                <textarea
                                    value={newAssignment.description}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white resize-none"
                                    placeholder={lang === 'tr' ? 'Detaylar...' : 'Details...'}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={addAssignment}
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

                {/* Assignments List */}
                {filteredAssignments.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {filter === 'completed'
                                ? (lang === 'tr' ? 'Tamamlanan ödev yok' : 'No completed assignments')
                                : (lang === 'tr' ? 'Henüz ödev eklenmemiş' : 'No assignments yet')}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'tr' ? 'Ödevlerinizi takip etmek için ekleyin' : 'Add assignments to track them'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredAssignments.map((assignment) => {
                            const daysUntil = getDaysUntilDue(assignment.dueDate);

                            return (
                                <div
                                    key={assignment.id}
                                    className={`p-5 rounded-2xl border transition-all ${getUrgencyColor(assignment.dueDate, assignment.status)}`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Status Toggle */}
                                        <button
                                            onClick={() => updateStatus(assignment.id, assignment.status === 'completed' ? 'pending' : 'completed')}
                                            className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${assignment.status === 'completed'
                                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                                                }`}
                                        >
                                            {assignment.status === 'completed' && <CheckCircle size={14} />}
                                        </button>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className={`font-semibold ${assignment.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                                                        {assignment.title}
                                                    </h3>
                                                    {assignment.course && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.course}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${priorityColors[assignment.priority]}`}>
                                                        {priorityLabels[assignment.priority]}
                                                    </span>
                                                    <button
                                                        onClick={() => deleteAssignment(assignment.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {assignment.description && (
                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {assignment.description}
                                                </p>
                                            )}

                                            {/* Due Date */}
                                            <div className="mt-3 flex items-center gap-4">
                                                <div className={`flex items-center gap-1.5 text-sm ${assignment.status === 'completed' ? 'text-gray-400' :
                                                    daysUntil < 0 ? 'text-red-600 dark:text-red-400' :
                                                        daysUntil <= 1 ? 'text-red-600 dark:text-red-400' :
                                                            daysUntil <= 3 ? 'text-amber-600 dark:text-amber-400' :
                                                                'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    <Calendar size={14} />
                                                    <span>
                                                        {new Date(assignment.dueDate).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                    {assignment.status !== 'completed' && (
                                                        <span className="font-medium">
                                                            {daysUntil < 0
                                                                ? `(${Math.abs(daysUntil)} ${lang === 'tr' ? 'gün geçti' : 'days overdue'})`
                                                                : daysUntil === 0
                                                                    ? (lang === 'tr' ? '(Bugün!)' : '(Today!)')
                                                                    : daysUntil === 1
                                                                        ? (lang === 'tr' ? '(Yarın)' : '(Tomorrow)')
                                                                        : `(${daysUntil} ${lang === 'tr' ? 'gün kaldı' : 'days left'})`
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Stats */}
                {assignments.length > 0 && (
                    <div className="mt-8 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {lang === 'tr' ? 'İstatistikler' : 'Statistics'}
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {assignments.filter(a => a.status === 'pending').length}
                                </div>
                                <div className="text-sm text-blue-600 dark:text-blue-400">
                                    {lang === 'tr' ? 'Bekleyen' : 'Pending'}
                                </div>
                            </div>
                            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                    {assignments.filter(a => getDaysUntilDue(a.dueDate) <= 3 && a.status !== 'completed').length}
                                </div>
                                <div className="text-sm text-amber-600 dark:text-amber-400">
                                    {lang === 'tr' ? 'Yaklaşan' : 'Due Soon'}
                                </div>
                            </div>
                            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {assignments.filter(a => a.status === 'completed').length}
                                </div>
                                <div className="text-sm text-emerald-600 dark:text-emerald-400">
                                    {lang === 'tr' ? 'Tamamlanan' : 'Completed'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Marketing Sections */}
            <ToolMarketingSections lang={lang} tool="assignments" />
        </div>
    );
}
