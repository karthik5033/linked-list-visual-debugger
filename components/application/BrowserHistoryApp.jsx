'use client';

import { useState, useEffect, useRef } from 'react';
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
        case 'searchHistory': return [
            'Node* temp = head;',
            'while (temp != nullptr) {',
            '    if (temp->url == searchUrl) {',
            '        return "Found!";',
            '    }',
            '    temp = temp->next;',
            '}',
            'return "Not Found";'
        ];
        default: return [];
    }
};

export default function BrowserHistoryApp({ engine }) {
    const [steps, setSteps] = useState([]);
    const [currentOperation, setCurrentOperation] = useState(null);
    const [isThinking, setIsThinking] = useState(false);

    // Browser State
    const [urlInput, setUrlInput] = useState('google.com');
    const [currentUrl, setCurrentUrl] = useState('New Tab');
    const [isSearchMode, setIsSearchMode] = useState(false); // Toggle for search vs visit
    const [isIncognito, setIsIncognito] = useState(false);
    const inputRef = useRef(null);

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

    useEffect(() => {
        // Reset engine on mount to ensure clean state
        if (engine) engine.reset();
        
        // Auto-focus input
        if (inputRef.current) inputRef.current.focus();
    }, [engine]);

    const memoryState = currentStep?.memoryState || engine.getMemoryState();
    const highlightedNodes = currentStep?.memoryState?.highlights || [];
    const currentCode = currentOperation ? getCodeSnippet(currentOperation) : [];

    // Derived Browser State from Memory Logic
    const currNodeId = memoryState.curr;
    const currNode = memoryState.nodes[currNodeId];

    useEffect(() => {
        if (currNode && !isSearchMode) {
            setCurrentUrl(currNode.value);
            // Only update input if it's not the one we just typed (to avoid jumping cursor)
            if (currNode.value !== urlInput) {
                 setUrlInput(currNode.value);
            }
        } else if (!currNode) {
             // If reset to empty
             setCurrentUrl('New Tab');
        }
    }, [currNodeId, currNode, isSearchMode]);

    const canGoBack = currNode?.prev !== null && currNode?.prev !== undefined;
    const canGoForward = currNode?.next !== null && currNode?.next !== undefined;

    const formatUrl = (input) => {
        let url = input.trim().toLowerCase();
        if (!url.includes('.') && url !== 'localhost' && !isSearchMode) {
            return url + '.com';
        }
        return url;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!urlInput.trim()) return;

        resetRunner();
        setIsThinking(true);

        const formattedUrl = formatUrl(urlInput);
        
        if (isSearchMode) {
            setCurrentOperation('searchHistory');
            // Execute Search
             setTimeout(() => {
                 const newSteps = engine.executeOperation('doubly', 'search', { value: formattedUrl });
                 setSteps(newSteps);
                 setIsThinking(false);
                 setTimeout(start, 500);
            }, 600);
        } else {
            setCurrentOperation('visitPage');
            setUrlInput(formattedUrl);
            
            // Execute Visit
            setTimeout(() => {
                 const newSteps = engine.executeOperation('doubly', 'visitPage', { value: formattedUrl });
                 setSteps(newSteps);
                 setIsThinking(false);
                 setTimeout(start, 500);
            }, 600);
        }
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
        if (inputRef.current) inputRef.current.focus();
    };

    return (
        <div className="flex flex-col xl:flex-row h-full gap-6 animate-fade-in-up pb-8">
            {/* LEFT PANEL: BROWSER SIMULATION */}
            <div className={`flex-1 flex flex-col gap-6 transition-colors duration-500`}>
                <div className={`rounded-xl overflow-hidden shadow-2xl border flex flex-col h-[500px] relative transition-colors duration-500 ${isIncognito ? 'bg-[#1a1a1a] border-gray-700' : 'bg-[#121212] border-white/10'}`}>
                    
                    {/* Fake Chrome Toolbar */}
                    <div className={`p-3 flex items-center gap-3 border-b z-20 relative transition-colors duration-500 ${isIncognito ? 'bg-[#2b2b2b] border-gray-700' : 'bg-[#1e1e1e] border-white/5'}`}>
                        {/* Controls */}
                        <div className="flex items-center gap-2 text-gray-400">
                            <button
                                onClick={handleBack}
                                disabled={!canGoBack || isRunning || isThinking}
                                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${(!canGoBack || isRunning || isThinking) ? 'opacity-30 cursor-not-allowed' : 'text-white'}`}
                                title="Back"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={handleForward}
                                disabled={!canGoForward || isRunning || isThinking}
                                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${(!canGoForward || isRunning || isThinking) ? 'opacity-30 cursor-not-allowed' : 'text-white'}`}
                                title="Forward"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                            <button
                                onClick={handleReset}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors hover:text-white"
                                title="Refresh / Reset"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                            </button>
                        </div>

                        {/* Address Bar */}
                        <form onSubmit={handleSubmit} className="flex-1">
                            <div className={`border rounded-full px-4 py-2 flex items-center text-sm shadow-inner transition-all duration-300 ${
                                isIncognito 
                                    ? 'bg-[#3b3b3b] border-gray-600 focus-within:ring-white/20' 
                                    : `bg-[#2a2a2a] ${isThinking ? 'border-purple-500/50' : 'border-white/5'} focus-within:ring-purple-500/50`
                            } focus-within:ring-1`}>
                                {/* Search Mode Toggle */}
                                <button 
                                    type="button"
                                    onClick={() => setIsSearchMode(!isSearchMode)}
                                    className={`mr-2 transition-colors hover:text-white ${isSearchMode ? 'text-purple-400' : 'text-gray-500'}`}
                                    title={isSearchMode ? "Switch to Navigation" : "Switch to Search History"}
                                >
                                    {isThinking ? '✨' : isSearchMode ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                                    ) : (
                                        isIncognito ? '🕶️' : (urlInput.startsWith('https') ? '🔒' : '🌐')
                                    )}
                                </button>
                                
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-gray-200 font-medium placeholder-gray-500 font-mono"
                                    placeholder={isSearchMode ? "Search History..." : "Enter URL (e.g. google)"}
                                    disabled={isRunning}
                                />
                                {isThinking && <div className="text-xs text-purple-400 animate-pulse font-mono">{isSearchMode ? 'Searching...' : 'Loading...'}</div>}
                            </div>
                        </form>

                        {/* Incognito Toggle */}
                        <button 
                            onClick={() => setIsIncognito(!isIncognito)}
                            className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all hover:scale-110 ${isIncognito ? 'bg-gray-700 text-white shadow-inner' : 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}
                            title="Toggle Incognito Mode"
                        >
                            {isIncognito ? '🕵️' : ''}
                        </button>
                    </div>

                    {/* Pro Loading Bar */}
                    {isThinking && (
                         <div className="h-0.5 w-full bg-[#1e1e1e] relative z-10">
                            <div className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7] animate-[pan_1s_infinite_linear]" style={{ width: '40%' }}></div>
                         </div>
                    )}

                    {/* Browser Content */}
                    <div className={`flex-1 relative overflow-hidden group transition-colors duration-500 ${isIncognito ? 'bg-[#121212]' : 'bg-[#0a0a0a]'}`}>
                        {/* Tab Content Mockup */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 select-none pointer-events-none">
                            <div className={`text-9xl opacity-10 transition-all duration-700 transform ${isThinking ? 'scale-90 blur-sm' : 'scale-100 blur-0'}`}>
                                {isIncognito ? '🕵️' : (currentUrl === 'New Tab' ? '➕' : '🌐')}
                            </div>
                            <h1 className="text-4xl font-bold mt-4 text-gray-500 tracking-tight">{currentUrl}</h1>
                            <p className="text-gray-700 mt-2 font-mono text-sm uppercase tracking-widest">
                                {isIncognito ? 'Incognito Mode' : (currentUrl === 'New Tab' ? 'Wait for input...' : 'Page Loaded')}
                            </p>
                        </div>
                        
                        {/* History Side Panel (New Feature) */}
                         <div className="absolute top-4 right-4 w-48 bg-[#1e1e1e]/90 backdrop-blur-md border border-white/10 rounded-lg p-3 transform transition-transform duration-300 translate-x-full group-hover:translate-x-0">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">History</h4>
                                <div className="space-y-1">
                                    {/* Reverse iterate manually to show recent first */}
                                    {Object.values(memoryState.nodes).reverse().slice(0, 5).map(node => (
                                         <div key={node.id} className={`text-xs px-2 py-1 rounded truncate ${node.id === currNodeId ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400'}`}>
                                             {node.value}
                                         </div>
                                    ))}
                                    {Object.keys(memoryState.nodes).length === 0 && <div className="text-xs text-gray-600 italic">Empty</div>}
                                </div>
                         </div>
                    </div>
                </div>

                {/* Explanation Card */}
                <div className="bg-[#0a0a0a]/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-purple-500 select-none">-&gt;</div>
                    <h4 className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                         Engine Logic
                    </h4>
                    <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside font-medium">
                        <li>Each page visit creates a <span className="text-white">New Node</span>.</li>
                        <li>Back/Forward moves the <span className="text-purple-400">curr</span> pointer.</li>
                        <li>Search traverses history <span className="text-blue-400">O(N)</span>.</li>
                    </ul>
                </div>
            </div>

            {/* RIGHT PANEL: DEBUGGER */}
            <div className="flex-1 flex flex-col gap-6 min-w-[400px]">
                {/* Visualizer */}
                <div className="flex-1 bg-[#0a0a0a]/40 backdrop-blur-md rounded-xl border border-white/10 p-1 flex flex-col shadow-inner min-h-[400px]">
                    <div className="absolute top-4 right-4 z-10">
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold rounded border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                            Doubly Linked List
                        </span>
                    </div>
                    <MemoryBoard
                        memoryState={memoryState}
                        highlightedNodes={highlightedNodes}
                        icon="🔗"
                        title="History Stack"
                        type="doubly"
                        valueFormatter={(val) => val.replace('https://', '')}
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
                    <div className="bg-[#0a0a0a] p-3 rounded-lg border border-white/10 flex justify-between items-center animate-fade-in-up">
                        <div className="text-gray-400 text-xs font-mono">
                            Step {currentStepIndex + 1}/{totalSteps}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={prevStep} disabled={!hasPrev} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white text-xs disabled:opacity-50 transition-colors">Prev</button>
                            <button onClick={nextStep} disabled={!hasNext} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white text-xs disabled:opacity-50 transition-colors">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
