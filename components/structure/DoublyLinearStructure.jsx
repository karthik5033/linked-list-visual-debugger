'use client';

import { useState } from 'react';
import { useStepRunner } from '@/hooks/useStepRunner';
import CodePanel from '@/components/CodePanel';
import MemoryBoard from '@/components/MemoryBoard';

const OPERATION_TITLES = {
    visitPage: 'Visit Page',
    moveToPrev: 'Go Back',
    moveToNext: 'Go Forward'
};

const getCodeSnippet = (op) => {
    switch (op) {
        case 'visitPage': return [
            'Node* newNode = new Node(url);',
            'if (curr->next) {',
            '    deleteForwardHistory(curr->next);',
            '}',
            'newNode->prev = curr;',
            'newNode->next = nullptr;',
            'curr->next = newNode;',
            'curr = newNode;',
            '// Page Loaded'
        ];
        case 'moveToPrev': return [
            'if (curr->prev != nullptr) {',
            '    curr = curr->prev;',
            '}',
            '// Update Browser UI'
        ];
        case 'moveToNext': return [
            'if (curr->next != nullptr) {',
            '    curr = curr->next;',
            '}',
            '// Update Browser UI'
        ];
        default: return [];
    }
};

export default function DoublyLinearStructure({ engine }) {
    const [steps, setSteps] = useState([]);
    const [currentOperation, setCurrentOperation] = useState(null);
    const [inputValue, setInputValue] = useState('10');

    const {
        currentStep,
        currentStepIndex,
        nextStep,
        prevStep,
        start,
        reset: resetRunner,
        isRunning,
        hasNext,
        hasPrev,
        totalSteps
    } = useStepRunner(steps);

    const memoryState = currentStep?.memoryState || engine.getMemoryState();
    const highlightedNodes = currentStep?.memoryState?.highlights || [];
    const currentCode = currentOperation ? getCodeSnippet(currentOperation) : [];

    const handleOperation = (op, params = {}) => {
        resetRunner();
        setCurrentOperation(op);
        const newSteps = engine.executeOperation('doubly', op, params);
        setSteps(newSteps);
        setTimeout(start, 500);
    };

    const handleReset = () => {
        resetRunner();
        engine.reset();
        setSteps([]);
        setCurrentOperation(null);
    };

    return (
        <div className="grid grid-cols-12 gap-6 h-full pb-6">
            {/* LEFT COLUMN: Controls & Memory */}
            <div className="col-span-12 xl:col-span-7 flex flex-col gap-6">

                {/* Playback Controls Overlay */}
                <div className="bg-[#1f2937] p-4 rounded-xl border border-[#374151] flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={prevStep} disabled={!hasPrev}
                            className="p-2 rounded hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
                        >
                            ⏮️ Prev
                        </button>
                        <div className="text-gray-400 font-mono text-sm">
                            Step <span className="text-white font-bold">{currentStepIndex + 1}</span> / {totalSteps}
                        </div>
                        <button
                            onClick={nextStep} disabled={!hasNext}
                            className="p-2 rounded hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
                        >
                            Next ⏭️
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                            {isRunning ? 'Running' : 'Idle'}
                        </span>
                    </div>
                </div>

                {/* Memory Board */}
                <div className="flex-1 min-h-[300px]">
                    <MemoryBoard
                        memoryState={memoryState}
                        highlightedNodes={highlightedNodes}
                        type="doubly"
                        title="Doubly Linked List Memory"
                        icon="🔗"
                    />
                </div>

                {/* Control Panel (Inline) */}
                <div className="bg-[#1f2937] p-6 rounded-xl border border-[#374151] shadow-lg flex flex-col gap-4">
                    <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider">Structure Controls</h3>

                    <div className="flex gap-4">
                        <div className="flex gap-2 flex-1">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="bg-[#111827] text-white px-4 py-2 rounded-lg border border-[#374151] focus:border-purple-500 focus:outline-none flex-1 font-mono text-sm"
                                placeholder="Enter number (e.g., 10)..."
                            />
                            <button
                                onClick={() => handleOperation('visitPage', { value: inputValue })}
                                disabled={isRunning || !inputValue}
                                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                            >
                                Insert (Visit)
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => handleOperation('moveToPrev')}
                            disabled={isRunning}
                            className="flex-1 bg-[#374151] hover:bg-[#4b5563] text-white py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                        >
                            Move Prev (Back)
                        </button>
                        <button
                            onClick={() => handleOperation('moveToNext')}
                            disabled={isRunning}
                            className="flex-1 bg-[#374151] hover:bg-[#4b5563] text-white py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                        >
                            Move Next (Forward)
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={isRunning}
                            className="px-4 bg-red-900/50 text-red-400 hover:bg-red-900/80 hover:text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Code & Explanations */}
            <div className="col-span-12 xl:col-span-5 flex flex-col gap-6">
                <div className="flex-1 min-h-[400px]">
                    <CodePanel
                        code={currentCode}
                        activeLine={currentStep?.activeLine}
                        title={OPERATION_TITLES[currentOperation] || 'C++ Algorithm'}
                    />
                </div>

                <div className="bg-[#1f2937] p-6 rounded-xl border border-[#374151] min-h-[120px] shadow-lg">
                    <h4 className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">Debugger Log</h4>
                    <p className="font-mono text-sm text-gray-300 leading-relaxed">
                        {currentStep?.explanation || '> Ready to trace operations...'}
                    </p>
                </div>
            </div>
        </div>
    );
}
