'use client';

import { useState, useEffect, useRef } from 'react';
import { useStepRunner } from '@/hooks/useStepRunner';
import MemoryBoard from '../MemoryBoard';
import CodePanel from '../CodePanel';

// Operations for CodePanel
const getCodeSnippet = (op) => {
    switch (op) {
        case 'addProcess': return [
            'Node* newSong = new Node(name);',
            'if (!head) {',
            '    head = tail = newSong;',
            '    tail->next = head;',
            '} else {',
            '    tail->next = newSong;',
            '    newSong->next = head;',
            '    tail = newSong;',
            '}'
        ];
        case 'moveToNext': return [
            '// Complexity: O(1)',
            'if (curr->next != nullptr) {',
            '    curr = curr->next;',
            '}',
            '// Wraps around automatically'
        ];
        case 'moveToPrev': return [
            '// Complexity: O(N) - Inefficient in Singly Link List',
            'Node* temp = curr;',
            'while (temp->next != curr) {',
            '    temp = temp->next;',
            '}',
            'curr = temp;'
        ];
        default: return [];
    }
};

const SAMPLE_SONGS = [
    { title: "Midnight City", artist: "M83", cover: "🌃" },
    { title: "Blinding Lights", artist: "The Weeknd", cover: "💡" },
    { title: "Levitating", artist: "Dua Lipa", cover: "✨" },
    { title: "Starboy", artist: "The Weeknd", cover: "⭐" },
    { title: "Heat Waves", artist: "Glass Animals", cover: "🔥" }
];

export default function CircularSinglyApp({ engine }) {
    const [steps, setSteps] = useState([]);
    const [currentOperation, setCurrentOperation] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Engine State
    const {
        currentStep, // The step inside the operation (e.g. line 2 of insert)
        nextStep,
        prevStep,
        start,
        reset: resetRunner,
        isRunning,
        hasNext,
        hasPrev,
        currentStepIndex,
        totalSteps
    } = useStepRunner(steps);

    // Sync playing state with runner
    useEffect(() => {
        if (!isRunning && currentOperation === 'moveToNext' && isPlaying) {
             // Logic to auto-play next tracks could go here, but for visualizer we stop.
        }
    }, [isRunning]);

    const memoryState = currentStep?.memoryState || engine.getMemoryState();
    const highlightedNodes = currentStep?.memoryState?.highlights || [];
    const currentCode = currentOperation ? getCodeSnippet(currentOperation) : [];
    
    // Resolve current object from memory ID
    const currNodeId = memoryState.curr;
    const currNode = memoryState.nodes[currNodeId];
    
    // Format value (artist/title logic)
    // We stored just strings in engine. Let's assume input string "Title - Artist"
    const parseSong = (val) => {
        if (!val) return { title: "No Track", artist: "Select a song", cover: "🎵" };
        const parts = val.split(' - ');
        // Find metadata if we have it
        const meta = SAMPLE_SONGS.find(s => s.title === parts[0]);
        return {
            title: parts[0] || val,
            artist: parts[1] || "Unknown Artist",
            cover: meta?.cover || "🎵"
        };
    };

    const currentSong = parseSong(currNode?.value);

    const handleAddSong = (song) => {
        if (isRunning) return;
        setIsPlaying(false); // Pause when adding
        resetRunner();
        setCurrentOperation('addProcess');
        const val = `${song.title} - ${song.artist}`;
        const newSteps = engine.executeOperation('circular-singly', 'addProcess', { value: val, burstTime: 0 });
        setSteps(newSteps);
        setTimeout(start, 500);
    };

    const handleNext = () => {
        if (isRunning || !currNode) return;
        resetRunner();
        setCurrentOperation('moveToNext');
        const newSteps = engine.executeOperation('circular-singly', 'moveToNext', {});
        setSteps(newSteps);
        setTimeout(start, 500);
    };

    const handlePrev = () => {
        if (isRunning || !currNode) return;
        resetRunner();
        setCurrentOperation('moveToPrev');
        const newSteps = engine.executeOperation('circular-singly', 'moveToPrev', {});
        setSteps(newSteps);
        setTimeout(start, 500);
    };
    
    const handleTogglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        resetRunner();
        engine.reset();
        setSteps([]);
        setCurrentOperation(null);
        setIsPlaying(false);
    };

    // Initialize with a few songs if empty
    useEffect(() => {
        if (!memoryState.head && !isRunning && steps.length === 0) {
            // Pre-load songs sequentially
            const loadInitSongs = async () => {
                 for(let i=0; i<4; i++) {
                     const song = SAMPLE_SONGS[i];
                     const val = `${song.title} - ${song.artist}`;
                     engine.executeOperation('circular-singly', 'addProcess', { value: val, burstTime: 0 });
                 }
                 // Force refresh
                 setSteps([]); 
            };
            loadInitSongs();
        }
    }, []);

    // Auto-Play Logic
    useEffect(() => {
        let interval;
        if (isPlaying && !isRunning && currNode) {
            interval = setInterval(() => {
                handleNext();
            }, 3000); // Change song every 3 seconds
        }
        return () => clearInterval(interval);
    }, [isPlaying, isRunning, currNode]);

    return (
        <div className="flex flex-col xl:flex-row h-full gap-6 animate-fade-in-up pb-8">
            {/* LEFT PANEL: PLAYER UI */}
            <div className="flex-1 flex flex-col gap-6">
                <div className="bg-gradient-to-br from-[#1db954]/10 to-black rounded-3xl p-8 border border-[#1db954]/20 shadow-2xl relative overflow-hidden group">
                     {/* Background Glow */}
                     <div className="absolute top-0 right-0 w-64 h-64 bg-[#1db954]/20 blur-[100px] rounded-full group-hover:bg-[#1db954]/30 transition-all duration-1000"></div>

                     <div className="relative z-10 flex flex-col items-center text-center">
                         {/* Album Art */}
                         <div className={`w-48 h-48 rounded-2xl shadow-2xl flex items-center justify-center text-6xl mb-6 transition-all duration-500 transform ${isPlaying ? 'scale-105 shadow-[#1db954]/50' : 'scale-100'} ${isRunning ? 'animate-pulse' : ''} bg-[#121212] border border-white/10`}>
                             {currentSong.cover}
                         </div>

                         {/* Info */}
                         <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{currentSong.title}</h2>
                         <p className="text-gray-400 text-lg mb-8 font-medium">{currentSong.artist}</p>

                         {/* Progress Bar (Fake) */}
                         <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
                             <div className={`h-full bg-[#1db954] rounded-full ${isPlaying ? 'animate-[progress_30s_linear_infinite]' : 'w-1/3'}`}></div>
                         </div>

                         {/* Controls */}
                         <div className="flex items-center gap-8">
                             <button onClick={handlePrev} disabled={isRunning || !currNode} className="p-4 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30" title="Previous (O(N) Trauma)">
                                 <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                             </button>

                             <button 
                                onClick={handleTogglePlay}
                                className="w-16 h-16 rounded-full bg-[#1db954] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#1db954]/20"
                             >
                                 {isPlaying ? (
                                     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                 ) : (
                                     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                 )}
                             </button>

                             <button onClick={handleNext} disabled={isRunning || !currNode} className="p-4 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30">
                                 <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                             </button>
                         </div>
                     </div>
                </div>

                {/* Library / Add Songs */}
                <div className="bg-[#121212] rounded-xl border border-white/5 p-4 flex-1 overflow-hidden flex flex-col">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex justify-between items-center">
                        Library
                        <button onClick={handleReset} className="text-xs text-red-400 hover:text-red-300">Reset</button>
                    </h3>
                    <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                        {SAMPLE_SONGS.map((song, i) => (
                            <button
                                key={i}
                                onClick={() => handleAddSong(song)}
                                disabled={isRunning}
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left group disabled:opacity-50"
                            >
                                <span className="w-8 h-8 flex items-center justify-center bg-[#282828] rounded text-lg group-hover:scale-110 transition-transform">{song.cover}</span>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-200 group-hover:text-[#1db954] transition-colors">{song.title}</div>
                                    <div className="text-xs text-gray-500">{song.artist}</div>
                                </div>
                                <span className="text-xs text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100">+ Add</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: VISUALIZER & CODE */}
            <div className="flex-1 flex flex-col gap-6 min-w-[420px]">
                 {/* Visualizer */}
                 <div className="flex-1 bg-[#121212] rounded-xl border border-white/10 p-1 flex flex-col shadow-inner min-h-[400px] relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-20">
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded border border-green-500/20 shadow-lg backdrop-blur-md">
                            Circular Singly Linked List
                        </span>
                    </div>
                    <MemoryBoard
                        memoryState={memoryState}
                        highlightedNodes={highlightedNodes}
                        icon="🎵"
                        title="Spotify Backend Memory"
                        type="circular-singly"
                        valueFormatter={(val) => val.split('-')[0].trim()}
                    />
                </div>

                {/* Code Panel */}
                <div className="h-48 group relative">
                    <div className="absolute -top-3 left-4 px-2 bg-[#121212] border border-white/10 rounded text-[10px] font-bold text-gray-500 z-10 uppercase tracking-tighter group-hover:text-green-400 transition-colors">
                        Implementation Logic
                    </div>
                    <CodePanel
                        code={currentCode}
                        activeLine={currentStep?.activeLine}
                        title={currentOperation ? 'Processing...' : 'Idle'}
                    />
                </div>

                {/* Step Controls */}
                {steps.length > 0 && (
                    <div className="bg-[#121212] p-3 rounded-xl border border-white/10 flex justify-between items-center shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-mono text-xs">
                                {currentStepIndex + 1}
                            </div>
                            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                OF {totalSteps} Operations
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={prevStep} disabled={!hasPrev} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white text-xs disabled:opacity-30 transition-all font-bold">PREV</button>
                             <button onClick={nextStep} disabled={!hasNext} className="px-4 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-black text-xs disabled:opacity-30 transition-all font-bold shadow-[0_0_15px_rgba(29,185,84,0.4)]">NEXT</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
