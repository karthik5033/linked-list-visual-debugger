'use client';

import { useState } from 'react';
import { useStepRunner } from '@/hooks/useStepRunner';
import MemoryBoard from '../MemoryBoard';
import PlaylistControlPanel from './PlaylistControlPanel';

export default function MusicPlaylist({ engine }) {
    const [steps, setSteps] = useState([]);
    const [currentOperation, setCurrentOperation] = useState(null);
    const [playingSong, setPlayingSong] = useState(null);

    const {
        currentStep,
        nextStep,
        prevStep,
        start,
        reset: resetRunner,
        isRunning,
        hasNext,
        hasPrev,
    } = useStepRunner(steps);

    const memoryState = currentStep?.memoryState || engine.getMemoryState();
    const highlightedNodes = currentStep?.memoryState?.highlights || [];

    const handleOperation = (op, value) => {
        resetRunner();
        setCurrentOperation(op);

        // Check if list is empty before operation
        const wasEmpty = !engine.getMemoryState().head;

        if (op === 'deleteHead') {
            const currentHead = engine.getMemoryState().head;
            if (currentHead) {
                const songName = engine.getMemoryState().nodes[currentHead].value;
                setPlayingSong(songName);
            } else {
                setPlayingSong(null);
            }
        }

        const engineOp = op === 'deleteHead' ? 'deleteHead' : op;
        const newSteps = engine.executeOperation('singly', engineOp, { value });
        setSteps(newSteps);

        // If this was the first song added, set it as playing
        if (wasEmpty && op === 'insertTail' && value) {
            setTimeout(() => {
                setPlayingSong(value);
            }, 600);
        }

        setTimeout(start, 500);
    };

    const handleReset = () => {
        resetRunner();
        engine.reset();
        setSteps([]);
        setCurrentOperation(null);
        setPlayingSong(null);
    };

    return (
        <div className="grid grid-cols-2 gap-6 h-full pb-6">
            {/* LEFT COLUMN: Controls & Memory Visualization */}
            <div className="flex flex-col gap-6">
                {/* Playlist Controls */}
                <div className="bg-[#1f2937] rounded-xl border border-[#374151] overflow-hidden">
                    <PlaylistControlPanel
                        onAddSong={(name) => handleOperation('insertTail', name)}
                        onPlayNext={() => handleOperation('deleteHead', null)}
                        onRemove={(name) => handleOperation('deleteValue', name)}
                        onReset={handleReset}
                        isRunning={isRunning}
                    />
                </div>

                {/* Memory Board (Linked List Visualization) */}
                <div className="flex-1 flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2">🔗 Memory Structure</h3>
                    <div className="flex-1 bg-[#0f1422] rounded-xl border border-[#1f2937] p-1 overflow-hidden shadow-inner min-h-[300px]">
                        <MemoryBoard
                            memoryState={memoryState}
                            highlightedNodes={highlightedNodes}
                            title=""
                            icon=""
                            valueFormatter={(val) => `🎵 ${val}`}
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Now Playing & Queue List */}
            <div className="flex flex-col gap-6">
                {/* Now Playing Section */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl border border-indigo-500/30 shadow-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10">
                        <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">Now Playing</p>
                        <h1 className="text-3xl font-bold text-white mb-2 truncate">
                            {playingSong || "No Song Playing"}
                        </h1>
                        <p className="text-sm text-gray-400 mb-4">
                            {playingSong ? "From Your Playlist" : "Add songs to queue..."}
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-gray-700/50 rounded-full overflow-hidden mb-4">
                            <div className={`h-full bg-indigo-500 rounded-full transition-all ${playingSong ? 'w-1/3 animate-pulse' : 'w-0'}`}></div>
                        </div>

                        {/* Play Controls */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleOperation('deleteHead', null)}
                                className="bg-white text-indigo-900 hover:bg-indigo-50 px-6 py-2 rounded-full font-bold text-sm shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                <span>▶</span> Play Next
                            </button>
                            <button
                                onClick={handleReset}
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                title="Reset Playlist"
                            >
                                ↺
                            </button>
                            <div className="flex-1"></div>
                            <div className="text-xs font-mono text-gray-400">
                                {isRunning ? <span className="text-green-400 animate-pulse">● UPDATING</span> : <span>● READY</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Queue List */}
                <div className="flex-1 flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2">📜 Queue</h3>
                    <div className="flex-1 bg-[#1f2937] rounded-xl border border-[#374151] p-4 overflow-y-auto">
                        {memoryState.head ? (
                            <div className="space-y-2">
                                {(() => {
                                    const songs = [];
                                    let current = memoryState.head;
                                    let index = 1;
                                    while (current && memoryState.nodes[current]) {
                                        songs.push(
                                            <div
                                                key={current}
                                                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${highlightedNodes.includes(current)
                                                    ? 'bg-blue-600/20 border border-blue-500/50'
                                                    : 'bg-[#111827] hover:bg-[#1f2937]'
                                                    }`}
                                            >
                                                <span className="text-gray-500 font-mono text-sm w-6">{index}</span>
                                                <span className="text-xl">🎵</span>
                                                <span className="flex-1 text-white font-medium truncate">
                                                    {memoryState.nodes[current].value}
                                                </span>
                                            </div>
                                        );
                                        current = memoryState.nodes[current].next;
                                        index++;
                                    }
                                    return songs;
                                })()}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 italic">
                                <div className="text-4xl mb-2">🎵</div>
                                <p>Queue is empty</p>
                                <p className="text-xs mt-1">Add songs to get started</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
