'use client';

import { useState } from 'react';

export default function ControlPanel({
    onInsertHead,
    onInsertTail,
    onDeleteValue,
    onSearch,
    onReset,
    isRunning
}) {
    const [inputValue, setInputValue] = useState('');

    const handleAction = (action) => {
        if (!inputValue.trim()) return;
        action(inputValue);
        setInputValue('');
    };

    return (
        <div className="bg-[#1f2937] p-4 rounded-xl border border-[#374151] shadow-lg">
            <div className="flex flex-col gap-4">
                {/* Input Field */}
                <div className="relative">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter value..."
                        disabled={isRunning}
                        className="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAction(onInsertTail);
                        }}
                    />
                </div>

                {/* Operation Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => handleAction(onInsertHead)}
                        disabled={isRunning || !inputValue}
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>➕ Head</span>
                    </button>

                    <button
                        onClick={() => handleAction(onInsertTail)}
                        disabled={isRunning || !inputValue}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <span>➕ Tail</span>
                    </button>

                    <button
                        onClick={() => handleAction(onDeleteValue)}
                        disabled={isRunning || !inputValue}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>🗑️ Delete</span>
                    </button>

                    <button
                        onClick={() => handleAction(onSearch)}
                        disabled={isRunning || !inputValue}
                        className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>🔍 Search</span>
                    </button>
                </div>

                <div className="border-t border-[#374151] my-1"></div>

                <button
                    onClick={onReset}
                    disabled={isRunning}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                >
                    Reset Memory
                </button>
            </div>
        </div>
    );
}
