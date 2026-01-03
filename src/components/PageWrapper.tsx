'use client';

import React from 'react';

interface PageWrapperProps {
    children: React.ReactNode;
    showGradients?: boolean;
}

export default function PageWrapper({ children, showGradients = true }: PageWrapperProps) {
    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0f] transition-colors">
            {/* Subtle Gradient Background */}
            {showGradients && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" />
                </div>
            )}

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
