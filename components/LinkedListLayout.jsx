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
        <div className="h-screen bg-[#0a0e1a] text-white flex flex-col overflow-hidden font-dm-sans selection:bg-blue-500/30">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getColorClasses(color)} z-50`}></div>

            {/* Header */}
            <header className="bg-[#111827] border-b border-[#1f2937] px-6 py-4 flex items-center justify-between z-20 shadow-lg">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        Back
                    </Link>
                    <div className="h-6 w-px bg-gray-700 mx-2"></div>
                    <h1 className={`text-xl font-bold bg-gradient-to-r ${getColorClasses(color)} bg-clip-text text-transparent flex items-center gap-2`}>
                        <span>{icon}</span> {title}
                    </h1>
                </div>

                <ModeTabs currentMode={currentMode} onModeChange={setCurrentMode} />
            </header>

            {/* Main App Area */}
            <main className="flex-1 overflow-hidden p-6 relative">
                <div className="absolute inset-0 bg-[#0a0e1a] bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>
                <div className="h-full max-w-[1920px] mx-auto z-10 relative">
                    {children ? children(currentMode, setCurrentMode) : renderContent()}
                </div>
            </main>
        </div>
    );
}
