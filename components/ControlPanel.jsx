'use client';

import { useState } from 'react';
import { useTheme } from '@/app/context/ThemeContext';

export default function ControlPanel({
    onInsertHead,
    onInsertTail,
    onDeleteHead,
    onDeleteTail,
    onDeleteValue,
    onSearch,
    onReset,
    isRunning
}) {
    const [inputValue, setInputValue] = useState('');
    const { isDark } = useTheme();

    const handleAction = (action) => {
        // PRO FEATURE: If input is empty for insertions, generate random value
        let val = inputValue;
        
        // Handle whitespace
        if (typeof val === 'string') {
            val = val.trim();
        }

        if (!val && (action === onInsertHead || action === onInsertTail)) {
            val = Math.floor(Math.random() * 99) + 1;
            setInputValue(val); // Update UI with generated value
        }

        if (!val && val !== 0) {
            // Shake or show error could go here, but for now just return
            return;
        }

        // Convert to number if it's a valid number string (matches dsaEngine behavior)
        if (!isNaN(val) && val !== '') {
            val = Number(val);
        }

        action(val);
        setInputValue('');
    };

    const buttonBaseClass = `group relative flex items-center justify-center gap-3 py-4 rounded-sm transition-all border
        ${isDark 
            ? 'bg-[#0a0a0a] border-white/10' 
            : 'bg-white border-gray-200 shadow-sm'}`;
            
    const textClass = `font-mono text-sm font-bold uppercase tracking-wider transition-colors
        ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

    return (
        <div className="flex flex-col gap-4">
            {/* Input Section */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-mono text-lg">{'>'}</span>
                </div>
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="ENTER_VALUE"
                    className={`w-full rounded-sm py-4 pl-10 pr-4 text-lg font-mono placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all
                        ${isDark 
                            ? 'bg-[#050505] border border-white/10 text-white focus:bg-blue-900/5' 
                            : 'bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white'}`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAction(onInsertTail);
                    }}
                />
            </div>

            {/* Operations Grid */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => handleAction(onInsertHead)}
                    className={`${buttonBaseClass} hover:border-blue-500/50 ${isDark ? 'hover:bg-blue-900/10' : 'hover:bg-blue-50'}`}
                >
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className={`${textClass} group-hover:text-blue-500`}>Push Head</span>
                </button>

                <button
                    onClick={() => handleAction(onInsertTail)}
                    className={`${buttonBaseClass} hover:border-blue-500/50 ${isDark ? 'hover:bg-blue-900/10' : 'hover:bg-blue-50'}`}
                >
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className={`${textClass} group-hover:text-blue-500`}>Push Tail</span>
                </button>

                <button
                    onClick={onDeleteHead}
                    className={`${buttonBaseClass} hover:border-red-500/50 ${isDark ? 'hover:bg-red-900/10' : 'hover:bg-red-50'}`}
                >
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" transform="rotate(180 12 12)" />
                    </svg>
                    <span className={`${textClass} group-hover:text-red-500`}>Pop Head</span>
                </button>

                <button
                    onClick={onDeleteTail}
                    className={`${buttonBaseClass} hover:border-red-500/50 ${isDark ? 'hover:bg-red-900/10' : 'hover:bg-red-50'}`}
                >
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" transform="rotate(180 12 12)" />
                    </svg>
                    <span className={`${textClass} group-hover:text-red-500`}>Pop Tail</span>
                </button>

                <button
                    onClick={() => handleAction(onDeleteValue)}
                    className={`col-span-2 ${buttonBaseClass} hover:border-red-500/50 ${isDark ? 'hover:bg-red-900/10' : 'hover:bg-red-50'}`}
                >
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className={`${textClass} group-hover:text-red-500`}>Delete Value</span>
                </button>

                <button
                    onClick={() => handleAction(onSearch)}
                    className={`col-span-2 ${buttonBaseClass} hover:border-purple-500/50 ${isDark ? 'hover:bg-purple-900/10' : 'hover:bg-purple-50'}`}
                >
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className={`${textClass} group-hover:text-purple-500`}>Search Value</span>
                </button>
            </div>

            <button
                onClick={onReset}
                disabled={isRunning}
                className={`w-full border py-3 rounded-sm text-xs font-mono font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
                    ${isDark 
                        ? 'bg-[#0a0a0a] hover:bg-red-900/20 border-white/5 hover:border-red-500/30 text-gray-500 hover:text-red-400' 
                        : 'bg-white hover:bg-red-50 border-gray-200 hover:border-red-500/30 text-gray-500 hover:text-red-600 shadow-sm'}`}
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                System Reset
            </button>
        </div>
    );
}
