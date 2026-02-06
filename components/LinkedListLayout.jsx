'use client';

import { useState } from 'react';
import Link from 'next/link';
import ModeTabs from './ModeTabs';
import MemoryBackground from '../app/components/MemoryBackground';
import StatusBar from './StatusBar';
import { useTheme } from '@/app/context/ThemeContext';

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
    const [memoryState, setMemoryState] = useState(null);
    const { isDark, toggleTheme } = useTheme();

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
        <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <MemoryBackground isDark={isDark} />
            <StatusBar isDark={isDark} />

            {/* Header */}
            <header className={`border-b backdrop-blur-xl sticky top-0 z-50 transition-colors duration-500
                ${isDark ? 'border-white/5 bg-[#0a0a0a]/60' : 'border-gray-200 bg-white/80'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-105
                                ${isDark ? 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
                        >
                            ←
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center text-2xl font-bold text-${color}-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                                {icon}
                            </div>
                            <div>
                                <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
                                <p className="text-xs text-blue-400 font-mono tracking-wide uppercase">{subtitle}</p>
                            </div>
                        </div>
                    </div>

                    <div className="min-w-[400px]">
                        <ModeTabs currentMode={currentMode} onModeChange={setCurrentMode} isDark={isDark} />
                    </div>

                    <div className="w-24 text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-green-500 font-mono font-bold tracking-wider">ONLINE</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-6 pb-24">
                <div className={`backdrop-blur-md border rounded-2xl min-h-[calc(100vh-160px)] shadow-2xl overflow-hidden animate-fade-in-up transition-colors duration-500
                    ${isDark ? 'bg-[#0a0a0a]/40 border-white/10' : 'bg-white/60 border-gray-200 shadow-xl'}`}>

                    {children ? children(currentMode, setCurrentMode) : renderContent()}
                </div>
            </main>
        </div>
    );
}
