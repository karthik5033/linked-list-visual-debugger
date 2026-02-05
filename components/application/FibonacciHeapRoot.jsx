'use client';

import { useState } from 'react';
import { useStepRunner } from '@/hooks/useStepRunner';
import MemoryBoard from '../MemoryBoard';
import CodePanel from '../CodePanel';

const getCodeSnippet = (op) => {
    switch (op) {
        case 'insertRoot': return [
            '// Insert Tree into Root List',
            'Node* tree = new Node(value);',
            'if (!head) {',
            '    head = tree;',
            '    tree->next = tree;',
            '    tree->prev = tree;',
            '} else {',
            '    tree->next = head;',
            '    tree->prev = head->prev;',
            '    head->prev->next = tree;',
            '    head->prev = tree;',
            '    if (tree->key < min->key) min = tree;',
            '}'
        ];
        case 'removeMin': return [
            '// Extract Min (Simple visual)',
            'Node* z = min;',
            'if (z) {',
            '    // Reconnect neighbors',
            '    z->prev->next = z->next;',
            '    z->next->prev = z->prev;',
            '    if (z == z->next) min = nullptr;',
            '    else min = z->next;',
            '    delete z;',
            '}'
        ];
        default: return [];
    }
};

export default function FibonacciHeapRoot({ engine }) {
    const [steps, setSteps] = useState([]);
    const [currentOperation, setCurrentOperation] = useState(null);

    // Inputs
    const [treeValue, setTreeValue] = useState(10);

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

    // Helper to extract min value logic usually needs traversal or tracking
    // For visualization, we just trust the engine's 'head' is the operational target for now

    const handleInsert = (e) => {
        e.preventDefault();
        resetRunner();
        setCurrentOperation('insertRoot');
        const newSteps = engine.executeOperation('circular-doubly', 'insertRoot', { value: treeValue });
        setSteps(newSteps);
        setTimeout(start, 500);
        setTreeValue(prev => prev + 5);
    };

    const handleRemoveMin = () => {
        resetRunner();
        setCurrentOperation('removeMin');
        const newSteps = engine.executeOperation('circular-doubly', 'removeMin', {});
        setSteps(newSteps);
        setTimeout(start, 500);
    };

    const handleReset = () => {
        resetRunner();
        engine.reset();
        setSteps([]);
        setCurrentOperation(null);
        setTreeValue(10);
    };

    return (
        <div className="flex flex-col xl:flex-row h-full gap-6 animate-fade-in-up">
            {/* LEFT PANEL: Controls */}
            <div className="flex-1 flex flex-col gap-6 max-w-md">
                <div className="bg-[#1f2937] p-6 rounded-xl border border-[#374151] shadow-lg flex flex-col gap-6">
                    <h3 className="text-lg font-bold text-gray-200 border-b border-gray-700 pb-2 flex items-center gap-2">
                        <span>🌲</span> Fibonacci Heap (Root List)
                    </h3>

                    {/* Add Tree Form */}
                    <form onSubmit={handleInsert} className="flex flex-col gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <label className="text-xs text-gray-500 block uppercase tracking-wider font-bold">New Tree</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={treeValue}
                                onChange={(e) => setTreeValue(parseInt(e.target.value) || 0)}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                placeholder="Value"
                                disabled={isRunning}
                            />
                            <button
                                type="submit"
                                disabled={isRunning}
                                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-4 py-2 rounded font-medium transition-colors"
                            >
                                Insert
                            </button>
                        </div>
                    </form>

                    {/* Operations */}
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 grid grid-cols-1 gap-3">
                        <label className="text-xs text-gray-500 block uppercase tracking-wider font-bold">Operations</label>
                        <button
                            onClick={handleRemoveMin}
                            disabled={isRunning || !memoryState.head}
                            className="bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors border border-red-500/50"
                        >
                            Extract Min (Head)
                        </button>
                    </div>

                    <button
                        onClick={handleReset}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors self-end"
                    >
                        Reset Heap
                    </button>

                    {/* Explanation */}
                    <div className="text-xs text-gray-500 p-2 bg-black/20 rounded">
                        <p>Visualizes the <strong>Root List</strong> of a Fibonacci Heap, which is a circular doubly linked list. Trees are inserted next to min/head. Deletion removes the node and reconnects neighbors.</p>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Visualizer */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Visualizer */}
                <div className="flex-1 bg-[#1f2937] rounded-xl border border-[#374151] p-1 flex flex-col shadow-inner min-h-[400px] relative">
                    <div className="absolute top-4 right-4 z-10">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded border border-purple-500/30">
                            Circular Doubly
                        </span>
                    </div>
                    <MemoryBoard
                        memoryState={memoryState}
                        highlightedNodes={highlightedNodes}
                        icon="🔗"
                        title="Root List"
                        type="circular-doubly"
                        valueFormatter={(val) => `Tr(${val})`}
                    />
                </div>

                {/* Code Panel */}
                <div className="h-48">
                    <CodePanel
                        code={currentCode}
                        activeLine={currentStep?.activeLine}
                        title={currentOperation ? 'Algorithm Logic' : 'Ready'}
                    />
                </div>

                {/* Step Controls */}
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
