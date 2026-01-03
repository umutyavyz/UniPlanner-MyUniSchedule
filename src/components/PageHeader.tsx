'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconGradient?: string;
    actions?: React.ReactNode;
    backHref?: string;
}

export default function PageHeader({
    title,
    subtitle,
    icon: Icon,
    iconGradient = 'from-blue-600 to-indigo-600',
    actions,
    backHref = '/'
}: PageHeaderProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-[#0a0a0f]/80 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href={backHref}
                        className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    {Icon && (
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${iconGradient} text-white shadow-lg`}>
                            <Icon size={18} />
                        </div>
                    )}

                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {actions}
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
