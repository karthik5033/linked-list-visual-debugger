'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ModeTabs({ currentMode, onModeChange, isDark = true }) {
    const modes = [
        { id: 'concept', label: 'Documentation' },
        { id: 'structure', label: 'Visualizer' },
        { id: 'application', label: 'Real World' },
    ];

    return (
        <div className={`flex bg-transparent border-b w-full transition-colors duration-500 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            {modes.map((mode) => {
                const isActive = currentMode === mode.id;
                return (
                    <button
                        key={mode.id}
                        onClick={() => onModeChange(mode.id)}
                        className={`
              flex items-center gap-2 px-6 py-4 text-sm font-mono tracking-widest uppercase transition-all relative
              ${isActive
                                ? 'text-blue-400'
                                : isDark ? 'text-gray-500 hover:text-gray-200' : 'text-gray-500 hover:text-gray-900'
                            }
            `}
                    >
                        {mode.label}
                        
                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] w-full" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
