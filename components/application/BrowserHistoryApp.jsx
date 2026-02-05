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

const getSiteBrand = (url) => {
    const s = url.toLowerCase();
    if (s.includes('google')) return { name: 'Google', icon: '🔍', color: '#4285F4' };
    if (s.includes('youtube')) return { name: 'YouTube', icon: '📺', color: '#FF0000' };
    if (s.includes('github')) return { name: 'GitHub', icon: '💻', color: '#6e5494' };
    if (s.includes('reddit')) return { name: 'Reddit', icon: '🤖', color: '#FF4500' };
    if (s.includes('twitter') || s.includes(' x ')) return { name: 'X / Twitter', icon: '🐦', color: '#1DA1F2' };
    if (s.includes('netflix')) return { name: 'Netflix', icon: '🍿', color: '#E50914' };
    return { name: url, icon: '🌐', color: '#888' };
};

export default function BrowserHistoryApp({ engine }) {
    const [steps, setSteps] = useState([]);
    const [currentOperation, setCurrentOperation] = useState(null);
    const [isThinking, setIsThinking] = useState(false);
    const [searchResult, setSearchResult] = useState(null); // 'found' | 'not-found' | null

    // Browser State
    const [urlInput, setUrlInput] = useState('google.com');
    const [currentUrl, setCurrentUrl] = useState('New Tab');
    const [isSearchMode, setIsSearchMode] = useState(false);
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
        if (engine) engine.reset();
        if (inputRef.current) inputRef.current.focus();

        // Keyboard Shortcuts
        const handleKeyDown = (e) => {
            if (e.altKey && e.key === 'ArrowLeft') handleBack();
            if (e.altKey && e.key === 'ArrowRight') handleForward();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [engine]);

    const lastSyncedNodeId = useRef(null);

    const memoryState = currentStep?.memoryState || engine.getMemoryState();
    const highlightedNodes = currentStep?.memoryState?.highlights || [];
    const currentCode = currentOperation ? getCodeSnippet(currentOperation) : [];

    const currNodeId = memoryState.curr;
    const currNode = memoryState.nodes[currNodeId];

    useEffect(() => {
        // Sync the Browser UI with the engine state
        if (currNode && !isSearchMode) {
            setCurrentUrl(currNode.value);
            
            // Only update the input if we actually moved to a DIFFERENT node ID
            // This prevents the input from resetting back to the node value while the user is typing a new route
            if (currNodeId !== lastSyncedNodeId.current) {
                setUrlInput(currNode.value);
                lastSyncedNodeId.current = currNodeId;
            }
            setSearchResult(null);
        } else if (!currNode) {
             setCurrentUrl('New Tab');
             if (!isSearchMode && lastSyncedNodeId.current !== null) {
                 setUrlInput('google.com'); 
                 lastSyncedNodeId.current = null;
             }
        }
    }, [currNodeId, isSearchMode, currNode]); // Removed currNode?.value to rely on object identity or ID stability

    const canGoBack = currNode?.prev !== null && currNode?.prev !== undefined;
    const canGoForward = currNode?.next !== null && currNode?.next !== undefined;

    const brand = getSiteBrand(currentUrl);

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
        setSearchResult(null);

        const formattedUrl = formatUrl(urlInput);
        
        if (isSearchMode) {
            setCurrentOperation('searchHistory');
             setTimeout(() => {
                 const newSteps = engine.executeOperation('doubly', 'search', { value: formattedUrl });
                 setSteps(newSteps);
                 setIsThinking(false);
                 
                 // Check if last step indicates found
                 const finalState = newSteps[newSteps.length - 1]?.memoryState;
                 const isFound = finalState?.highlights?.length > 0;
                 setSearchResult(isFound ? 'found' : 'not-found');
                 
                 setTimeout(start, 500);
            }, 600);
        } else {
            setCurrentOperation('visitPage');
            setUrlInput(formattedUrl);
            setTimeout(() => {
                 const newSteps = engine.executeOperation('doubly', 'visitPage', { value: formattedUrl });
                 setSteps(newSteps);
                 setIsThinking(false);
                 setTimeout(start, 500);
            }, 600);
        }
    };

    const handleJumpToPage = (nodeId) => {
        if (isRunning || isThinking || nodeId === currNodeId) return;
        
        resetRunner();
        setIsThinking(true);
        setCurrentOperation(null);

        // Find how many steps to move
        // For simplicity, we just set the engine state directly or execute visit if we want branching
        // But the pro way is to "Jump'
        engine.memory.setCurr(nodeId);
        setSteps([]);
        setTimeout(() => setIsThinking(false), 400);
    };

    const handleBack = () => {
        if (!canGoBack || isRunning || isThinking) return;
        resetRunner();
        setCurrentOperation('moveToPrev');
        const newSteps = engine.executeOperation('doubly', 'moveToPrev', {});
        setSteps(newSteps);
        setTimeout(start, 500);
    };

    const handleForward = () => {
        if (!canGoForward || isRunning || isThinking) return;
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
        setSearchResult(null);
        setCurrentOperation(null);
        setUrlInput('google.com');
        setCurrentUrl('New Tab');
        if (inputRef.current) inputRef.current.focus();
    };

    return (
        <div className="flex flex-col xl:flex-row h-full gap-6 animate-fade-in-up pb-8">
            {/* LEFT PANEL: BROWSER SIMULATION */}
            <div className={`flex-1 flex flex-col gap-6 transition-all duration-500`}>
                <div className={`rounded-xl overflow-hidden shadow-2xl border flex flex-col h-[500px] relative transition-all duration-500 ${isIncognito ? 'bg-[#1a1a1a] border-gray-700' : 'bg-[#121212] border-white/10'}`}>
                    
                    {/* Fake Chrome Toolbar */}
                    <div className={`p-3 flex items-center gap-3 border-b z-20 relative transition-colors duration-500 ${isIncognito ? 'bg-[#2b2b2b] border-gray-700' : 'bg-[#1e1e1e] border-white/5'}`}>
                        {/* Controls */}
                        <div className="flex items-center gap-2 text-gray-400">
                            <button
                                onClick={handleBack}
                                disabled={!canGoBack || isRunning || isThinking}
                                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${(!canGoBack || isRunning || isThinking) ? 'opacity-30' : 'text-white'}`}
                                title="Back (Alt+Left)"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={handleForward}
                                disabled={!canGoForward || isRunning || isThinking}
                                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${(!canGoForward || isRunning || isThinking) ? 'opacity-30' : 'text-white'}`}
                                title="Forward (Alt+Right)"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                            <button
                                onClick={handleReset}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors hover:text-white"
                                title="Reset History"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                            </button>
                        </div>

                        {/* Address Bar */}
                        <form onSubmit={handleSubmit} className="flex-1 group">
                            <div className={`border rounded-full px-4 py-2 flex items-center text-sm shadow-inner transition-all duration-300 ${
                                isIncognito 
                                    ? 'bg-[#3b3b3b] border-gray-600 focus-within:ring-white/20' 
                                    : `bg-[#2a2a2a] ${isThinking ? 'border-purple-500/50' : 'border-white/5'} focus-within:ring-purple-500/50`
                            } focus-within:ring-1`}>
                                {/* Search Mode Toggle */}
                                <button 
                                    type="button"
                                    onClick={() => { setIsSearchMode(!isSearchMode); setSearchResult(null); }}
                                    className={`mr-2 transition-colors hover:text-white ${isSearchMode ? 'text-purple-400' : 'text-gray-500'}`}
                                    title={isSearchMode ? "Switch to Visit Mode" : "Switch to Search Mode"}
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
                                    placeholder={isSearchMode ? "Search history..." : "Visit URL..."}
                                    disabled={isRunning}
                                />
                                
                                {/* Search Result Badge */}
                                {searchResult && !isThinking && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ml-2 uppercase tracking-tighter ${searchResult === 'found' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {searchResult === 'found' ? 'Found' : 'Missing'}
                                    </span>
                                )}

                                {isThinking && <div className="text-xs text-purple-400 animate-pulse font-mono ml-2">...</div>}
                            </div>
                        </form>

                        {/* Incognito Toggle */}
                        <button 
                            onClick={() => setIsIncognito(!isIncognito)}
                            className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-90 ${isIncognito ? 'bg-gray-700 text-white' : 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}
                            title="Incognito Mode"
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
                    <div className={`flex-1 relative overflow-hidden group transition-all duration-500 ${isIncognito ? 'bg-[#121212]' : 'bg-[#0a0a0a]'}`}>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 select-none pointer-events-none transition-all duration-500">
                            <div 
                                className={`text-9xl opacity-10 transition-all duration-700 transform flex items-center justify-center ${isThinking ? 'scale-90 blur-sm' : 'scale-100 blur-0'}`}
                                style={{ color: isIncognito ? '#444' : brand.color }}
                            >
                                {isIncognito ? '🕵️' : brand.icon}
                            </div>
                            <h1 className={`text-4xl font-bold mt-4 tracking-tight transition-colors duration-500 ${isIncognito ? 'text-gray-600' : 'text-gray-400'}`}>
                                {isIncognito ? 'Private Window' : brand.name}
                            </h1>
                            <p className="text-gray-700 mt-2 font-mono text-xs uppercase tracking-widest opacity-50">
                                {currentUrl === 'New Tab' ? 'Awaiting Input' : 'Status: 200 OK'}
                            </p>
                        </div>
                        
                        {/* History Side Panel */}
                         <div className="absolute top-4 right-4 w-48 bg-[#1e1e1e]/80 backdrop-blur-xl border border-white/10 rounded-xl p-3 transform transition-all duration-300 translate-x-[110%] group-hover:translate-x-0 shadow-2xl">
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 tracking-widest flex items-center justify-between">
                                    Recent History
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                </h4>
                                <div className="space-y-1.5">
                                    {Object.values(memoryState.nodes).reverse().slice(0, 6).map(node => (
                                         <button 
                                            key={node.id} 
                                            onClick={() => handleJumpToPage(node.id)}
                                            className={`w-full text-left text-xs px-2 py-1.5 rounded-lg truncate transition-all ${node.id === currNodeId ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                         >
                                             {getSiteBrand(node.value).icon} {node.value}
                                         </button>
                                    ))}
                                    {Object.keys(memoryState.nodes).length === 0 && <div className="text-xs text-gray-600 italic py-4 text-center">No history yet</div>}
                                </div>
                         </div>
                    </div>
                </div>

                {/* Explanation Card */}
                <div className="bg-[#0a0a0a]/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group">
                    <div className="absolute -bottom-2 -right-2 p-4 opacity-5 font-black text-8xl text-purple-500 select-none group-hover:opacity-10 transition-opacity">DLL</div>
                    <h4 className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                         Pro Developer Analysis
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <ul className="text-[12px] text-gray-400 space-y-2 font-medium">
                            <li><span className="text-white">Visit Page</span>: Tail Insertion + Branch Pruning</li>
                            <li><span className="text-white">Navigation</span>: Bidirectional Cursor Movement</li>
                        </ul>
                        <ul className="text-[12px] text-gray-400 space-y-2 font-medium">
                            <li><span className="text-white">Search</span>: Linear O(N) Head-to-Tail Scans</li>
                            <li><span className="text-white">Storage</span>: Heap Allocation (Simulated)</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: DEBUGGER */}
            <div className="flex-1 flex flex-col gap-6 min-w-[420px]">
                {/* Visualizer */}
                <div className="flex-1 bg-[#0a0a0a]/40 backdrop-blur-md rounded-xl border border-white/10 p-1 flex flex-col shadow-inner min-h-[400px] relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-20">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded border border-purple-500/20 shadow-lg backdrop-blur-md">
                                Doubly Linked List
                            </span>
                        </div>
                    </div>
                    <MemoryBoard
                        memoryState={memoryState}
                        highlightedNodes={highlightedNodes}
                        icon="🔗"
                        title="Memory Address Space"
                        type="doubly"
                        onNodeClick={handleJumpToPage}
                    />
                </div>

                {/* Code Panel */}
                <div className="h-48 group relative">
                    <div className="absolute -top-3 left-4 px-2 bg-[#0a0a0a] border border-white/10 rounded text-[10px] font-bold text-gray-500 z-10 uppercase tracking-tighter group-hover:text-purple-400 transition-colors">
                        Implementation Logic
                    </div>
                    <CodePanel
                        code={currentCode}
                        activeLine={currentStep?.activeLine}
                        title={currentOperation ? 'Executing Operation...' : 'Idle'}
                    />
                </div>

                {/* Step Controls (Mini) */}
                {steps.length > 0 && (
                    <div className="bg-[#0a0a0a] p-3 rounded-xl border border-white/10 flex justify-between items-center shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-xs">
                                {currentStepIndex + 1}
                            </div>
                            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                OF {totalSteps} Operations
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={prevStep} disabled={!hasPrev} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white text-xs disabled:opacity-30 transition-all font-bold">PREV</button>
                            <button onClick={nextStep} disabled={!hasNext} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs disabled:opacity-30 transition-all font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)]">NEXT</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
