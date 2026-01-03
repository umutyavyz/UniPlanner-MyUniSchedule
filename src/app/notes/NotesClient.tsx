'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Search, Tag, FileText, Edit3, Save, X, ChevronRight, Hash } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import ToolMarketingSections from '@/components/ToolMarketingSections';

interface Note {
    id: string;
    title: string;
    content: string;
    course: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export default function NotesClient() {
    const [mounted, setMounted] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<string>('all');
    const [editForm, setEditForm] = useState({ title: '', content: '', course: '', tags: '' });

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('notes');
        if (saved) {
            const parsed = JSON.parse(saved);
            setNotes(parsed);
            if (parsed.length > 0) {
                setSelectedNote(parsed[0]);
            }
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('notes', JSON.stringify(notes));
        }
    }, [notes, mounted]);

    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('settings') : null;
    const lang = (savedSettings ? JSON.parse(savedSettings).language || 'tr' : 'tr') as 'tr' | 'en';

    const courses = [...new Set(notes.map(n => n.course).filter(Boolean))];
    const allTags = [...new Set(notes.flatMap(n => n.tags))];

    const filteredNotes = notes.filter(note => {
        const matchesSearch = searchQuery === '' ||
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCourse = selectedCourse === 'all' || note.course === selectedCourse;
        return matchesSearch && matchesCourse;
    });

    const createNote = () => {
        const note: Note = {
            id: Date.now().toString(),
            title: editForm.title || (lang === 'tr' ? 'Yeni Not' : 'New Note'),
            content: editForm.content,
            course: editForm.course,
            tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setNotes([note, ...notes]);
        setSelectedNote(note);
        setIsCreating(false);
        setEditForm({ title: '', content: '', course: '', tags: '' });
    };

    const updateNote = () => {
        if (!selectedNote) return;
        const updated: Note = {
            ...selectedNote,
            title: editForm.title,
            content: editForm.content,
            course: editForm.course,
            tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
            updatedAt: new Date().toISOString()
        };
        setNotes(notes.map(n => n.id === selectedNote.id ? updated : n));
        setSelectedNote(updated);
        setIsEditing(false);
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
        if (selectedNote?.id === id) {
            setSelectedNote(notes.find(n => n.id !== id) || null);
        }
    };

    const startEditing = () => {
        if (!selectedNote) return;
        setEditForm({
            title: selectedNote.title,
            content: selectedNote.content,
            course: selectedNote.course,
            tags: selectedNote.tags.join(', ')
        });
        setIsEditing(true);
    };

    const startCreating = () => {
        setEditForm({ title: '', content: '', course: '', tags: '' });
        setIsCreating(true);
        setSelectedNote(null);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {lang === 'tr' ? 'Ders Notları' : 'Course Notes'}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {notes.length} {lang === 'tr' ? 'not' : 'notes'}
                            </p>
                        </div>
                    </div>
                    <ModeToggle />
                </div>
            </header>

            <div className="flex-1 flex max-w-7xl mx-auto w-full">
                {/* Sidebar */}
                <aside className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
                    {/* Search */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={lang === 'tr' ? 'Notlarda ara...' : 'Search notes...'}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Course Filter */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                        >
                            <option value="all">{lang === 'tr' ? 'Tüm Dersler' : 'All Courses'}</option>
                            {courses.map(course => (
                                <option key={course} value={course}>{course}</option>
                            ))}
                        </select>
                    </div>

                    {/* New Note Button */}
                    <div className="p-4">
                        <button
                            onClick={startCreating}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            {lang === 'tr' ? 'Yeni Not' : 'New Note'}
                        </button>
                    </div>

                    {/* Notes List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredNotes.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                                {searchQuery ? (lang === 'tr' ? 'Sonuç bulunamadı' : 'No results found') : (lang === 'tr' ? 'Henüz not yok' : 'No notes yet')}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredNotes.map(note => (
                                    <button
                                        key={note.id}
                                        onClick={() => { setSelectedNote(note); setIsEditing(false); setIsCreating(false); }}
                                        className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedNote?.id === note.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white truncate">{note.title}</h3>
                                                {note.course && (
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{note.course}</p>
                                                )}
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                    {note.content.substring(0, 100)}
                                                </p>
                                                {note.tags.length > 0 && (
                                                    <div className="flex gap-1 mt-2 flex-wrap">
                                                        {note.tags.slice(0, 3).map(tag => (
                                                            <span key={tag} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <ChevronRight size={16} className="text-gray-400 flex-shrink-0 mt-1" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col bg-white dark:bg-gray-950">
                    {isCreating ? (
                        <div className="flex-1 p-6">
                            <div className="max-w-3xl mx-auto space-y-4">
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    placeholder={lang === 'tr' ? 'Not başlığı...' : 'Note title...'}
                                    className="w-full text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                                />
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={editForm.course}
                                        onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                                        placeholder={lang === 'tr' ? 'Ders adı' : 'Course name'}
                                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                    />
                                    <input
                                        type="text"
                                        value={editForm.tags}
                                        onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                                        placeholder={lang === 'tr' ? 'Etiketler (virgülle ayır)' : 'Tags (comma separated)'}
                                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                    />
                                </div>
                                <textarea
                                    value={editForm.content}
                                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                    placeholder={lang === 'tr' ? 'Notlarınızı buraya yazın...' : 'Write your notes here...'}
                                    className="w-full h-96 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={createNote}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                                    >
                                        <Save size={18} />
                                        {lang === 'tr' ? 'Kaydet' : 'Save'}
                                    </button>
                                    <button
                                        onClick={() => setIsCreating(false)}
                                        className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        {lang === 'tr' ? 'İptal' : 'Cancel'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : selectedNote ? (
                        <div className="flex-1 flex flex-col">
                            {/* Note Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                                <div className="flex items-start justify-between max-w-3xl mx-auto">
                                    <div>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                className="text-2xl font-bold bg-transparent border-b-2 border-blue-500 outline-none text-gray-900 dark:text-white w-full"
                                            />
                                        ) : (
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedNote.title}</h2>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            {selectedNote.course && (
                                                <span className="text-blue-600 dark:text-blue-400">{selectedNote.course}</span>
                                            )}
                                            <span>{new Date(selectedNote.updatedAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={updateNote}
                                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <Save size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={startEditing}
                                                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteNote(selectedNote.id)}
                                                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Note Content */}
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="max-w-3xl mx-auto">
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <input
                                                    type="text"
                                                    value={editForm.course}
                                                    onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                                                    placeholder={lang === 'tr' ? 'Ders adı' : 'Course name'}
                                                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm.tags}
                                                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                                                    placeholder={lang === 'tr' ? 'Etiketler' : 'Tags'}
                                                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            <textarea
                                                value={editForm.content}
                                                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                                className="w-full h-96 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            {selectedNote.tags.length > 0 && (
                                                <div className="flex gap-2 mb-4 flex-wrap">
                                                    {selectedNote.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-lg flex items-center gap-1">
                                                            <Hash size={12} />
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="prose dark:prose-invert max-w-none">
                                                <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {selectedNote.content || (lang === 'tr' ? 'Henüz içerik yok' : 'No content yet')}
                                                </pre>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    {lang === 'tr' ? 'Not seçin veya yeni oluşturun' : 'Select a note or create new'}
                                </h3>
                                <button
                                    onClick={startCreating}
                                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
                                >
                                    <Plus size={18} />
                                    {lang === 'tr' ? 'Yeni Not' : 'New Note'}
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Marketing Sections */}
            <ToolMarketingSections lang={lang} tool="notes" />
        </div>
    );
}
