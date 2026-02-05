'use client';

import { useState } from 'react';
import Link from 'next/link';
import ModeTabs from './ModeTabs';

export default function LinkedListLayout({
    title,
    subtitle,
    icon,
    color = 'blue',
    conceptContent,
    structureComponent,
    applicationComponent,
    children
}) {
    const [currentMode, setCurrentMode] = useState('concept');
    const [memoryState, setMemoryState] = useState(null); // Lifted state for persistence

    const getColorClasses = (c) => {
        const colors = {
            blue: 'from-blue-500 to-blue-600',
            purple: 'from-purple-500 to-purple-600',
            green: 'from-green-500 to-green-600',
            orange: 'from-orange-500 to-orange-600',
        };
        return colors[c] || colors.blue;
    };

    const renderContent = () => {
        switch (currentMode) {
            case 'concept':
                return conceptContent;
            case 'structure':
                return structureComponent; // We'll pass props to this later
            case 'application':
                return applicationComponent; // We'll pass props to this later
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col">
            {/* Header */}
            <header className="border-b border-[#1f2937] bg-[#0f1422]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="w-10 h-10 rounded-xl bg-[#1f2937] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#374151] transition-colors"
                        >
                            ←
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getColorClasses(color)} flex items-center justify-center text-xl font-bold shadow-lg`}>
                                {icon}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">{title}</h1>
                                <p className="text-xs text-gray-400">{subtitle}</p>
                            </div>
                        </div>
                    </div>

                    <div className="min-w-[500px]">
                        <ModeTabs currentMode={currentMode} onModeChange={setCurrentMode} />
                    </div>

                    <div className="w-24 text-right">
                        {/* Spacing placeholder */}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-6">
                <div className="bg-[#111827] border border-[#1f2937] rounded-2xl min-h-[calc(100vh-140px)] shadow-2xl overflow-hidden animate-fade-in-up">
                    {children ? children(currentMode, setCurrentMode) : renderContent()}
                </div>
            </main>
        </div>
    );
}
