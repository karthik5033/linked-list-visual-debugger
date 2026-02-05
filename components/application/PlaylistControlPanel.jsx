'use client';

import { useState } from 'react';

export default function PlaylistControlPanel({
    onAddSong,
    onPlayNext,
    onRemove,
    onReset,
    isRunning
}) {
    const [songName, setSongName] = useState('');

    const handleAction = (action) => {
        if (!songName.trim()) return;
        action(songName);
        setSongName('');
    };

    return (
        <div className="bg-[#1f2937] p-6 rounded-xl border border-[#374151] shadow-lg">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                🎵 Playlist Controls
            </h3>

            <div className="flex flex-col gap-4">
                {/* Input Field */}
                <div className="relative">
                    <input
                        type="text"
                        value={songName}
                        onChange={(e) => setSongName(e.target.value)}
                        placeholder="Enter song name..."
                        disabled={isRunning}
                        className="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-sans"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAction(onAddSong);
                        }}
                    />
                </div>

                {/* Operation Buttons */}
                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={() => handleAction(onAddSong)}
                        disabled={isRunning || !songName}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                    >
                        <span>➕ Add Song to Queue</span>
                    </button>

                    <button
                        onClick={onPlayNext}
                        disabled={isRunning}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>▶️ Play Next (Delete Head)</span>
                    </button>

                    <button
                        onClick={() => handleAction(onRemove)}
                        disabled={isRunning || !songName}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-4 py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>🗑️ Remove Specific Song</span>
                    </button>
                </div>

                <div className="border-t border-[#374151] my-2"></div>

                <button
                    onClick={onReset}
                    disabled={isRunning}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                >
                    Reset Playlist
                </button>
            </div>
        </div>
    );
}
