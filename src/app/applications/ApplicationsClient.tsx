'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Briefcase, Building2, Calendar, ExternalLink, FileText, Clock, CheckCircle, XCircle, MessageSquare, Send } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

interface Application {
    id: string;
    company: string;
    position: string;
    type: 'internship' | 'parttime' | 'fulltime';
    status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
    appliedDate: string;
    link: string;
    notes: string;
    nextStep?: string;
    nextStepDate?: string;
}

export default function ApplicationsClient() {
    const [mounted, setMounted] = useState(false);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [newApplication, setNewApplication] = useState({
        company: '',
        position: '',
        type: 'internship' as Application['type'],
        link: '',
        notes: ''
    });

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('applications');
        if (saved) {
            setApplications(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('applications', JSON.stringify(applications));
        }
    }, [applications, mounted]);

    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('settings') : null;
    const lang = (savedSettings ? JSON.parse(savedSettings).language || 'tr' : 'tr') as 'tr' | 'en';

    const addApplication = () => {
        if (!newApplication.company.trim() || !newApplication.position.trim()) return;
        const application: Application = {
            id: Date.now().toString(),
            ...newApplication,
            status: 'applied',
            appliedDate: new Date().toISOString().split('T')[0]
        };
        setApplications([application, ...applications]);
        setNewApplication({ company: '', position: '', type: 'internship', link: '', notes: '' });
        setIsAdding(false);
    };

    const updateStatus = (id: string, status: Application['status']) => {
        setApplications(applications.map(a => a.id === id ? { ...a, status } : a));
    };

    const deleteApplication = (id: string) => {
        setApplications(applications.filter(a => a.id !== id));
    };

    const typeLabels = {
        internship: { tr: 'Staj', en: 'Internship' },
        parttime: { tr: 'Part-time', en: 'Part-time' },
        fulltime: { tr: 'Tam Zamanlı', en: 'Full-time' }
    };

    const statusLabels = {
        applied: { tr: 'Başvuruldu', en: 'Applied', icon: Send, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
        screening: { tr: 'İnceleniyor', en: 'Screening', icon: FileText, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        interview: { tr: 'Mülakat', en: 'Interview', icon: MessageSquare, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
        offer: { tr: 'Teklif Aldım', en: 'Offer', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
        rejected: { tr: 'Reddedildi', en: 'Rejected', icon: XCircle, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
        withdrawn: { tr: 'Vazgeçtim', en: 'Withdrawn', icon: XCircle, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' }
    };

    const filteredApplications = applications.filter(a => {
        if (filter === 'active') return !['rejected', 'withdrawn', 'offer'].includes(a.status);
        if (filter === 'closed') return ['rejected', 'withdrawn', 'offer'].includes(a.status);
        return true;
    }).sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());

    const stats = {
        total: applications.length,
        active: applications.filter(a => !['rejected', 'withdrawn', 'offer'].includes(a.status)).length,
        interviews: applications.filter(a => a.status === 'interview').length,
        offers: applications.filter(a => a.status === 'offer').length
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {lang === 'tr' ? 'Staj & İş Başvuruları' : 'Job Applications'}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {lang === 'tr' ? 'Başvurularınızı takip edin' : 'Track your applications'}
                            </p>
                        </div>
                    </div>
                    <ModeToggle />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'tr' ? 'Toplam' : 'Total'}</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'tr' ? 'Aktif' : 'Active'}</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.interviews}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'tr' ? 'Mülakat' : 'Interview'}</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.offers}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'tr' ? 'Teklif' : 'Offer'}</div>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex gap-2 mb-6">
                    {(['all', 'active', 'closed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            {f === 'all' && (lang === 'tr' ? 'Tümü' : 'All')}
                            {f === 'active' && (lang === 'tr' ? 'Aktif' : 'Active')}
                            {f === 'closed' && (lang === 'tr' ? 'Kapanmış' : 'Closed')}
                        </button>
                    ))}
                </div>

                {/* Add Application */}
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        {lang === 'tr' ? 'Başvuru Ekle' : 'Add Application'}
                    </button>
                ) : (
                    <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {lang === 'tr' ? 'Şirket *' : 'Company *'}
                                    </label>
                                    <input
                                        type="text"
                                        value={newApplication.company}
                                        onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                        placeholder={lang === 'tr' ? 'Şirket adı' : 'Company name'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {lang === 'tr' ? 'Pozisyon *' : 'Position *'}
                                    </label>
                                    <input
                                        type="text"
                                        value={newApplication.position}
                                        onChange={(e) => setNewApplication({ ...newApplication, position: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                        placeholder={lang === 'tr' ? 'Pozisyon' : 'Position'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {lang === 'tr' ? 'Tür' : 'Type'}
                                </label>
                                <div className="flex gap-2">
                                    {(['internship', 'parttime', 'fulltime'] as const).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setNewApplication({ ...newApplication, type })}
                                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${newApplication.type === type
                                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            {typeLabels[type][lang]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Başvuru Linki' : 'Application Link'}
                                </label>
                                <input
                                    type="url"
                                    value={newApplication.link}
                                    onChange={(e) => setNewApplication({ ...newApplication, link: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Notlar' : 'Notes'}
                                </label>
                                <textarea
                                    value={newApplication.notes}
                                    onChange={(e) => setNewApplication({ ...newApplication, notes: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white resize-none"
                                    placeholder={lang === 'tr' ? 'İletişim bilgileri, notlar...' : 'Contact info, notes...'}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button onClick={addApplication} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                                    {lang === 'tr' ? 'Ekle' : 'Add'}
                                </button>
                                <button onClick={() => setIsAdding(false)} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    {lang === 'tr' ? 'İptal' : 'Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Applications List */}
                {filteredApplications.length > 0 ? (
                    <div className="space-y-4">
                        {filteredApplications.map((app) => {
                            const statusInfo = statusLabels[app.status];
                            const StatusIcon = statusInfo.icon;
                            const isExpanded = expandedId === app.id;

                            return (
                                <div
                                    key={app.id}
                                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                                >
                                    <div
                                        className="p-5 cursor-pointer"
                                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                                    <Building2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">{app.company}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{app.position}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${statusInfo.color}`}>
                                                            {statusInfo[lang as 'tr' | 'en']}
                                                        </span>
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {new Date(app.appliedDate).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteApplication(app.id); }}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4">
                                            {/* Status Update */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {lang === 'tr' ? 'Durumu Güncelle' : 'Update Status'}
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {(Object.keys(statusLabels) as Application['status'][]).map((status) => {
                                                        const info = statusLabels[status];
                                                        const Icon = info.icon;
                                                        return (
                                                            <button
                                                                key={status}
                                                                onClick={() => updateStatus(app.id, status)}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${app.status === status ? info.color : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                                    }`}
                                                            >
                                                                <Icon size={12} />
                                                                {info[lang as 'tr' | 'en']}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {app.link && (
                                                <a
                                                    href={app.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-3"
                                                >
                                                    <ExternalLink size={14} />
                                                    {lang === 'tr' ? 'Başvuru Sayfası' : 'Application Page'}
                                                </a>
                                            )}

                                            {app.notes && (
                                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-400">
                                                    {app.notes}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {filter === 'active'
                                ? (lang === 'tr' ? 'Aktif başvuru yok' : 'No active applications')
                                : (lang === 'tr' ? 'Henüz başvuru eklenmemiş' : 'No applications yet')}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'tr' ? 'Staj ve iş başvurularınızı takip edin' : 'Track your internship and job applications'}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
