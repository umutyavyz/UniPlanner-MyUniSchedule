'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcutsProps {
    onShowSearch?: () => void;
}

const shortcuts = [
    { key: '1', path: '/planner', label: 'Ders Programı' },
    { key: '2', path: '/pomodoro', label: 'Pomodoro' },
    { key: '3', path: '/gpa-calculator', label: 'GPA' },
    { key: '4', path: '/assignments', label: 'Ödevler' },
    { key: '5', path: '/exams', label: 'Sınavlar' },
    { key: '6', path: '/notes', label: 'Notlar' },
    { key: '7', path: '/goals', label: 'Hedefler' },
    { key: '8', path: '/flashcards', label: 'Kartlar' },
    { key: '9', path: '/budget', label: 'Bütçe' },
    { key: '0', path: '/', label: 'Ana Sayfa' },
];

export default function KeyboardShortcuts({ onShowSearch }: KeyboardShortcutsProps) {
    const router = useRouter();
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLSelectElement
            ) {
                return;
            }

            // Cmd/Ctrl + K for search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                onShowSearch?.();
                return;
            }

            // Cmd/Ctrl + / for help
            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault();
                setShowHelp(prev => !prev);
                return;
            }

            // Escape to close modals
            if (e.key === 'Escape') {
                setShowHelp(false);
                return;
            }

            // Number shortcuts for navigation (Cmd/Ctrl + number)
            if (e.metaKey || e.ctrlKey) {
                const shortcut = shortcuts.find(s => s.key === e.key);
                if (shortcut) {
                    e.preventDefault();
                    router.push(shortcut.path);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router, onShowSearch]);

    if (!showHelp) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Klavye Kısayolları
                </h2>

                <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">Yardımı aç/kapat</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">⌘ /</kbd>
                    </div>

                    {shortcuts.map((shortcut) => (
                        <div key={shortcut.key} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-gray-600 dark:text-gray-400">{shortcut.label}</span>
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">⌘ {shortcut.key}</kbd>
                        </div>
                    ))}
                </div>

                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Windows/Linux için Ctrl tuşunu kullanın
                </p>
            </div>
        </div>
    );
}
