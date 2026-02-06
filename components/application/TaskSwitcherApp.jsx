'use client';

import { useState, useEffect } from 'react';
import { useStepRunner } from '@/hooks/useStepRunner';
import MemoryBoard from '../MemoryBoard';
import CodePanel from '../CodePanel';
import { useTheme } from '@/app/context/ThemeContext'; // Import Theme Context

// Operations for CodePanel
const getCodeSnippet = (op) => {
    switch (op) {
        case 'insertApp': return [
            '// Insert new App at Head',
            'Node* newApp = new Node(name);',
            'if (!head) {',
            '    head = tail = newApp;',
            '    head->next = head; head->prev = head;',
            '} else {',
            '    newApp->next = head; newApp->prev = tail;',
            '    tail->next = newApp; head->prev = newApp;',
            '    head = newApp;',
            '}'
        ];
        case 'openApp': return [
            '// Check if App is running',
            'Node* target = findApp(name);',
            'if (target) {',
            '    curr = target; // Switch Focus',
            '} else {',
            '    insertApp(name); // Launch New',
            '}'
        ];
        case 'closeApp': return [
            '// Close Active App (Delete Curr) - O(1)',
            'if (!curr) return;',
            'Node* prev = curr->prev;',
            'Node* next = curr->next;',
            'prev->next = next;',
            'next->prev = prev;',
            'if (curr == head) head = next;',
            'delete curr;',
            'curr = next; // Switch focus'
        ];
        case 'moveToNext': return [
            '// Alt + Tab (Next App) - O(1)',
            'curr = curr->next;'
        ];
        case 'moveToPrev': return [
            '// Alt + Shift + Tab (Prev App) - O(1)',
            'curr = curr->prev;'
        ];
        default: return [];
    }
};

const SAMPLE_APPS = [
    { name: "VS Code", icon: "📝", desc: "Code Editor" },
    { name: "Chrome", icon: "🌐", desc: "Web Browser" },
    { name: "Spotify", icon: "🎵", desc: "Music" },
    { name: "Terminal", icon: "💻", desc: "Command Line" },
    { name: "Discord", icon: "💬", desc: "Chat" },
    { name: "Slack", icon: "💼", desc: "Work Chat" },
    { name: "Figma", icon: "🎨", desc: "Design" }
];

export default function TaskSwitcherApp({ engine }) {
    const [steps, setSteps] = useState([]);
    const [currentOperation, setCurrentOperation] = useState(null);
    const { isDark } = useTheme(); // Consume Theme

    const {
        currentStep,
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

    const memoryState = currentStep?.memoryState || engine.getMemoryState();
    const highlightedNodes = currentStep?.memoryState?.highlights || [];
    const currentCode = currentOperation ? getCodeSnippet(currentOperation) : [];

    const currNodeId = memoryState.curr;
    const currNode = memoryState.nodes[currNodeId];

    // Parse value logic
    const parseApp = (val) => {
        if (!val) return { name: "No Apps Open", icon: "🖥️", desc: "Desktop" };
        const parts = val.split(' - ');
        return {
            name: parts[0],
            desc: parts[1] || "Application",
            icon: SAMPLE_APPS.find(a => a.name === parts[0])?.icon || "📱"
        };
    };

    const currentApp = parseApp(currNode?.value);

    // Handlers
    const handleLaunchApp = (app) => {
        if (isRunning) return;
        resetRunner();
        setCurrentOperation('openApp');
        const val = `${app.name} - ${app.desc}`;
        const newSteps = engine.executeOperation('circular-doubly', 'openApp', { value: val });
        setSteps(newSteps);
        setTimeout(start, 500);
    };

    const handleCloseApp = () => {
        if (isRunning || !currNode) return;
        resetRunner();
        setCurrentOperation('closeApp');
        const newSteps = engine.executeOperation('circular-doubly', 'closeApp', {});
        setSteps(newSteps);
        setTimeout(start, 500);
    };

    const handleNext = () => {
        if (isRunning || !currNode) return;
        resetRunner();
        setCurrentOperation('moveToNext');
        const newSteps = engine.executeOperation('circular-doubly', 'moveToNext', {});
        setSteps(newSteps);
        setTimeout(start, 300);
    };

    const handlePrev = () => {
        if (isRunning || !currNode) return;
        resetRunner();
        setCurrentOperation('moveToPrev');
        const newSteps = engine.executeOperation('circular-doubly', 'moveToPrev', {});
        setSteps(newSteps);
        setTimeout(start, 300);
    };

    const handleReset = () => {
        resetRunner();
        engine.reset();
        setSteps([]);
        setCurrentOperation(null);
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isRunning) return;
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                if (e.shiftKey) handlePrev();
                else handleNext();
            }
            if (e.key === 'Delete' || e.key === 'w' && e.ctrlKey) {
                handleCloseApp();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isRunning, currNode]);

    // Initial Load
    useEffect(() => {
        if (!memoryState.head && !isRunning && steps.length === 0) {
            const loadInitApps = async () => {
                for (let i = 0; i < 3; i++) {
                    const app = SAMPLE_APPS[i];
                    const val = `${app.name} - ${app.desc}`;
                    engine.executeOperation('circular-doubly', 'insertApp', { value: val });
                }
                setSteps([]);
            };
            loadInitApps();
        }
    }, []);

    return (
        <div className="flex flex-col xl:flex-row h-full gap-6 animate-fade-in-up pb-8">
            {/* LEFT PANEL: OS UI */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Active Window Preview */}
                <div className={`rounded-3xl p-4 border shadow-2xl relative overflow-hidden group flex-1 min-h-[250px] flex items-center justify-center transition-colors duration-500
                    ${isDark ? 'bg-gradient-to-br from-blue-900/30 to-black border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-white border-blue-200'}`}>

                    <div className={`absolute inset-0 bg-grid-[size:20px_20px] ${isDark ? 'bg-grid-white/[0.05]' : 'bg-grid-black/[0.05]'}`}></div>

                    {/* Window Card */}
                    {currNode ? (
                        <div className={`relative z-10 w-full max-w-xs aspect-video rounded-lg shadow-2xl border flex flex-col transform transition-all duration-300 hover:scale-105
                            ${isDark ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>

                            {/* Title Bar */}
                            <div className={`h-8 rounded-t-lg flex items-center px-3 gap-2 transition-colors
                                ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-100'}`}>
                                <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400" onClick={handleCloseApp}></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <div className="ml-4 text-xs text-gray-400 font-medium truncate">{currentApp.name}</div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
                                <div className="text-6xl filter drop-shadow-lg animate-bounce-slow">{currentApp.icon}</div>
                                <div className="text-center">
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentApp.name}</h2>
                                    <p className="text-blue-400 text-sm">{currentApp.desc}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center">
                            <div className="text-6xl mb-4">🖥️</div>
                            <p>Desktop Empty</p>
                            <p className="text-xs mt-2">Open an app below</p>
                        </div>
                    )}

                    {/* Switcher Overlay (Alt-Tab Style) */}
                    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 rounded-2xl border shadow-2xl backdrop-blur-xl transition-colors
                        ${isDark ? 'bg-[#2d2d2d]/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
                        <button onClick={handlePrev} className={`p-3 rounded-xl transition-colors ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'}`} title="Prev (Alt+Shift+Tab)">
                            ◀
                        </button>
                        <div className="flex gap-2">
                            {/* Dots indicating list */}
                            <div className="text-xs text-blue-400 font-mono font-bold tracking-widest">TASK SWITCHER</div>
                        </div>
                        <button onClick={handleNext} className={`p-3 rounded-xl transition-colors ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'}`} title="Next (Alt+Tab)">
                            ▶
                        </button>
                    </div>
                </div>

                {/* Dock / Launcher */}
                <div className={`backdrop-blur rounded-2xl border p-4 flex gap-4 overflow-x-auto justify-center transition-colors
                    ${isDark ? 'bg-[#1e1e1e]/80 border-white/5' : 'bg-white/80 border-gray-200 shadow-xl'}`}>
                    {SAMPLE_APPS.map((app, i) => (
                        <button
                            key={i}
                            onClick={() => handleLaunchApp(app)}
                            disabled={isRunning}
                            className="group relative flex flex-col items-center gap-2 p-2 hover:-translate-y-2 transition-transform duration-300"
                            title={`Launch ${app.name}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border transition-colors group-hover:bg-blue-600 group-hover:text-white
                                ${isDark ? 'bg-[#2d2d2d] border-white/5 text-gray-200' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                                {app.icon}
                            </div>
                            <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 whitespace-nowrap bg-black px-2 py-0.5 rounded">
                                {app.name}
                            </span>
                        </button>
                    ))}
                    <div className={`w-px mx-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                    <button onClick={handleReset} className="flex flex-col items-center gap-2 p-2 hover:-translate-y-2 transition-transform duration-300 text-red-400">
                        <div className="w-12 h-12 bg-red-900/20 rounded-2xl flex items-center justify-center text-xl border border-red-500/20">
                            🗑️
                        </div>
                    </button>
                </div>
            </div>

            {/* RIGHT PANEL: VISUALIZER */}
            <div className="flex-1 flex flex-col gap-6 min-w-[420px]">
                <div className={`flex-1 rounded-xl border p-1 flex flex-col shadow-inner min-h-[500px] relative overflow-hidden transition-colors duration-500
                    ${isDark ? 'bg-[#0a0e1a] border-blue-500/20' : 'bg-blue-50/50 border-blue-100'}`}>
                    <div className="absolute top-4 right-4 z-20">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded border border-blue-500/20 shadow-lg backdrop-blur-md">
                            Kernel Process Ring
                        </span>
                    </div>
                    {/* Scaled Wrapper for Larger View */}
                    <div className="w-full h-full transform scale-110 origin-center p-4">
                        <MemoryBoard
                            key={memoryState.curr || 'empty'}
                            memoryState={memoryState}
                            highlightedNodes={highlightedNodes}
                            icon="⚙️"
                            title="Process Cycle"
                            type="circular-doubly"
                            valueFormatter={(val) => val.split(' - ')[0]}
                        />
                    </div>
                </div>

                <CodePanel
                    code={currentCode}
                    activeLine={currentStep?.activeLine}
                    title={currentOperation ? 'Kernel Operation' : 'Idle'}
                />
            </div>
        </div>
    );
}
