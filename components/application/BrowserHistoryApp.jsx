'use client';

import { useState, useEffect } from 'react';
import { useStepRunner } from '@/hooks/useStepRunner';
import MemoryBoard from '../MemoryBoard';
import CodePanel from '../CodePanel';

// Operations for CodePanel
const getCodeSnippet = (op) => {
    switch (op) {
        case 'visitPage': return [
            '// 1. Clear forward history',
            'if (curr->next) {',
            '    deleteForwardHistory(curr->next);',
            '}',
            '// 2. Create and link new node',
            'Node* newNode = new Node(url);',
            'newNode->prev = curr;',
            'if (curr) curr->next = newNode;',
            'curr = newNode;'
        ];
        case 'moveToPrev': return [
            'if (curr->prev != nullptr) {',
            '    curr = curr->prev;',
            '}',
            '// Update Browser UI to curr->url'
        ];
        case 'moveToNext': return [
            'if (curr->next != nullptr) {',
            '    curr = curr->next;',
            '}',
            '// Update Browser UI to curr->url'
        ];
        default: return [];
    }
};

export default function BrowserHistoryApp({ engine }) {
    const [steps, setSteps] = useState([]);
    const [currentOperation, setCurrentOperation] = useState(null);

    // Browser State
    const [urlInput, setUrlInput] = useState('google.com');
    const [currentUrl, setCurrentUrl] = useState('New Tab');

    const {
        currentStep,
        nextStep,
        prevStep,
        start,
        reset: resetRunner,
        isRunning,
        hasNext,
        hasPrev,
        totalSteps,
        currentStepIndex
    } = useStepRunner(steps);

    const memoryState = currentStep?.memoryState || engine.getMemoryState();
    const highlightedNodes = currentStep?.memoryState?.highlights || [];
    const currentCode = currentOperation ? getCodeSnippet(currentOperation) : [];

    // Derived Browser State from Memory Logic
    const currNodeId = memoryState.curr;
    const currNode = memoryState.nodes[currNodeId];

    useEffect(() => {
        if (currNode) {
            setCurrentUrl(currNode.value);
            setUrlInput(currNode.value);
        }
    }, [currNodeId, currNode]);

    const canGoBack = currNode?.prev !== null && currNode?.prev !== undefined;
    const canGoForward = currNode?.next !== null && currNode?.next !== undefined;

    const handleVisit = (e) => {
        e.preventDefault();
        if (!urlInput.trim()) return;

        resetRunner();
        setCurrentOperation('visitPage');
        const newSteps = engine.executeOperation('doubly', 'visitPage', { value: urlInput });
        setSteps(newSteps);
        setTimeout(start, 500);
    };

    const handleBack = () => {
        if (!canGoBack) return;
        resetRunner();
        setCurrentOperation('moveToPrev');
        const newSteps = engine.executeOperation('doubly', 'moveToPrev', {});
        setSteps(newSteps);
        setTimeout(start, 500);
    };

    const handleForward = () => {
        if (!canGoForward) return;
        resetRunner();
        setCurrentOperation('moveToNext');
        const newSteps = engine.executeOperation('doubly', 'moveToNext', {});
        setSteps(newSteps);
        setTimeout(start, 500);
    };

    const handleReset = () => {
        resetRunner();
        engine.reset();
        setSteps([]);
        setCurrentOperation(null);
        setUrlInput('google.com');
        setCurrentUrl('New Tab');
    };

    return (
        <div className="flex flex-col xl:flex-row h-full gap-6 animate-fade-in-up">
            {/* LEFT PANEL: BROWSER SIMULATION */}
            <div className="flex-1 flex flex-col gap-6">
                <div className="bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col h-[500px]">
                    {/* Fake Chrome Toolbar */}
                    <div className="bg-[#f3f4f6] p-3 flex items-center gap-3 border-b border-gray-300">
                        {/* Controls */}
                        <div className="flex items-center gap-2 text-gray-600">
                            <button
                                onClick={handleBack}
                                disabled={!canGoBack || isRunning}
                                className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors ${(!canGoBack || isRunning) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                title="Back"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={handleForward}
                                disabled={!canGoForward || isRunning}
                                className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors ${(!canGoForward || isRunning) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                title="Forward"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                            <button
                                onClick={handleReset}
                                className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                                title="Refresh / Reset"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                            </button>
                        </div>

                        {/* Address Bar */}
                        <form onSubmit={handleVisit} className="flex-1">
                            <div className="bg-white border border-gray-300 rounded-full px-4 py-1.5 flex items-center text-sm shadow-sm focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
                                <span className="text-gray-400 mr-2">🔒</span>
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    className="flex-1 outline-none text-gray-700 font-medium placeholder-gray-400"
                                    placeholder="Enter URL..."
                                    disabled={isRunning}
                                />
                            </div>
                        </form>

                        {/* User Profile (Deco) */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500"></div>
                    </div>

                    {/* Browser Content */}
                    <div className="flex-1 bg-white relative overflow-hidden group">
                        {/* Tab Content Mockup */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 select-none pointer-events-none">
                            <div className="text-9xl opacity-10">🌐</div>
                            <h1 className="text-4xl font-bold mt-4 text-gray-800">{currentUrl}</h1>
                            <p className="text-gray-400 mt-2">Browser History Simulation</p>
                        </div>
                    </div>
                </div>

                {/* Explanation Card */}
                <div className="bg-[#1f2937] p-6 rounded-xl border border-[#374151] shadow-lg">
                    <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">How it works</h4>
                    <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                        <li>Each page visit creates a <span className="text-white font-bold">New Node</span>.</li>
                        <li>Back/Forward moves the <span className="text-purple-400 font-bold">curr</span> pointer.</li>
                        <li>Visiting a new page from the middle of history <span className="text-red-400 font-bold">deletes</span> all forward history (branches).</li>
                    </ul>
                </div>
            </div>

            {/* RIGHT PANEL: DEBUGGER */}
            <div className="flex-1 flex flex-col gap-6 min-w-[400px]">
                {/* Visualizer */}
                <div className="flex-1 bg-[#1f2937] rounded-xl border border-[#374151] p-1 flex flex-col shadow-inner min-h-[400px]">
                    <div className="absolute top-4 right-4 z-10">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded border border-purple-500/30">
                            Doubly Linked List
                        </span>
                    </div>
                    <MemoryBoard
                        memoryState={memoryState}
                        highlightedNodes={highlightedNodes}
                        icon="🔗"
                        title="History Stack"
                        type="doubly"
                    />
                </div>

                {/* Code Panel */}
                <div className="h-48">
                    <CodePanel
                        code={currentCode}
                        activeLine={currentStep?.activeLine}
                        title={currentOperation ? 'Underlying Logic' : 'Ready'}
                    />
                </div>

                {/* Step Controls (Mini) */}
                {steps.length > 0 && (
                    <div className="bg-[#111827] p-3 rounded-lg border border-[#374151] flex justify-between items-center animate-fade-in-up">
                        <div className="text-gray-400 text-xs font-mono">
                            Step {currentStepIndex + 1}/{totalSteps}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={prevStep} disabled={!hasPrev} className="px-3 py-1 bg-[#1f2937] hover:bg-[#374151] rounded text-white text-xs disabled:opacity-50">Prev</button>
                            <button onClick={nextStep} disabled={!hasNext} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white text-xs disabled:opacity-50">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
