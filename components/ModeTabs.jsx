'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ModeTabs({ currentMode, onModeChange }) {
    const modes = [
        { id: 'concept', label: 'Concept', icon: '💡' },
        { id: 'structure', label: 'Visualization', icon: '🛠️' },
        { id: 'application', label: 'Application', icon: '📱' },
    ];

    return (
        <div className="flex items-center gap-1 bg-[#111827] p-1 rounded-xl border border-[#2d3548]">
            {modes.map((mode) => {
                const isActive = currentMode === mode.id;
                return (
                    <button
                        key={mode.id}
                        onClick={() => onModeChange(mode.id)}
                        className={`
              flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap
              ${isActive
                                ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/25'
                                : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'
                            }
            `}
                    >
                        <span className="text-lg">{mode.icon}</span>
                        {mode.label}
                    </button>
                );
            })}
        </div>
    );
}
