'use client';

import { useState, useEffect } from 'react';
import { useStepRunner } from '@/hooks/useStepRunner';
import { DSAEngine } from '@/engine/dsaEngine';
import CodePanel from '@/components/CodePanel';
import MemoryBoard from '@/components/MemoryBoard';
import ControlPanel from '@/components/ControlPanel';
import { useTheme } from '@/app/context/ThemeContext';

// Code Templates (Moved here or logic in dsaEngine, keeping simple maps here for display title)
const OPERATION_TITLES = {
    insertHead: 'Insert at Head',
    insertTail: 'Insert at Tail',
    deleteValue: 'Delete Value',
    deleteHead: 'Delete Head',
    deleteTail: 'Delete Tail',
    search: 'Search Value',
};

// Code Snippets (Array of strings) - Ideally this comes from engine or separate map
const getCodeSnippet = (op) => {
    switch (op) {
        case 'insertHead': return [
            'Node* newNode = new Node(val);',
            'newNode->next = head;',
            'head = newNode;',
        ];
        case 'insertTail': return [
            'Node* newNode = new Node(val);',
            'if (head == nullptr) {',
            '    head = tail = newNode;',
            '} else {',
            '    tail->next = newNode;',
            '    tail = newNode;',
            '}'
        ];
        case 'deleteValue': return [
            'if (head == nullptr) return;',
            'if (head->data == val) {',
            '    Node* temp = head; head = head->next; delete temp;',
            '    return;',
            '}',
            'Node* curr = head;',
            'while (curr->next && curr->next->data != val)',
            '    curr = curr->next;',
            'if (curr->next) {',
            '    Node* temp = curr->next;',
            '    curr->next = temp->next;',
            '    delete temp;',
            '}'
        ];
        case 'deleteHead': return [
            'if (head == nullptr) return;',
            'Node* temp = head;',
            'head = head->next;',
            'delete temp;'
        ];
        case 'deleteTail': return [
            'if (head == nullptr) return;',
            'if (head == tail) { delete head; head = tail = nullptr; return; }',
            'Node* temp = head;',
            'while (temp->next != tail) temp = temp->next;',
            'delete tail;',
            'tail = temp;',
            'tail->next = nullptr;'
        ];
        case 'search': return [
            'Node* current = head;',
            'int index = 0;',
            'while (current) {',
            '    if (current->val == val) return index;',
            '    current = current->next;',
            '    index++;',
            '}',
            'return -1;'
        ];
        default: return [];
    }
}

export default function LinearStructure({ engine }) {
    // engine is now passed as a prop for persistence
    const [steps, setSteps] = useState([]);
    const [currentOperation, setCurrentOperation] = useState(null);
    const { isDark } = useTheme();

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

    const handleOperation = (op, value) => {
        resetRunner();
        setCurrentOperation(op);
        // Removed parseInt to allow string values if needed (engine handles loose equality)
        const newSteps = engine.executeOperation('singly', op, { value: value });
        setSteps(newSteps);
        setTimeout(start, 100); // Auto-start
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

                {/* Playback Controls Overlay (Debug style) */}
                <div className={`backdrop-blur-md p-4 rounded-xl border flex justify-between items-center shadow-lg transition-colors duration-500
                    ${isDark ? 'bg-[#0a0a0a]/60 border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={prevStep} disabled={!hasPrev}
                            className={`p-2 rounded hover:bg-opacity-10 disabled:opacity-30 transition-colors
                                ${isDark ? 'text-white hover:bg-white' : 'text-gray-700 hover:bg-black'}`}
                        >
                            ⏮️ Prev
                        </button>
                        <div className={`font-mono text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Step <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentStepIndex + 1}</span> / {totalSteps}
                        </div>
                        <button
                            onClick={nextStep} disabled={!hasNext}
                            className={`p-2 rounded hover:bg-opacity-10 disabled:opacity-30 transition-colors
                                ${isDark ? 'text-white hover:bg-white' : 'text-gray-700 hover:bg-black'}`}
                        >
                            Next ⏭️
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${isRunning ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></span>
                        <span className={`text-xs uppercase tracking-wider font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {isRunning ? 'Running' : 'Idle'}
                        </span>
                    </div>
                </div>

                {/* Memory Board */}
                <div className="flex-1 min-h-[300px]">
                    <MemoryBoard memoryState={memoryState} highlightedNodes={highlightedNodes} />
                </div>

                {/* Control Panel */}
                <ControlPanel
                    onInsertHead={(val) => handleOperation('insertHead', val)}
                    onInsertTail={(val) => handleOperation('insertTail', val)}
                    onDeleteHead={() => handleOperation('deleteHead')}
                    onDeleteTail={() => handleOperation('deleteTail')}
                    onDeleteValue={(val) => handleOperation('deleteValue', val)}
                    onSearch={(val) => handleOperation('search', val)}
                    onReset={handleReset}
                    isRunning={isRunning}
                />
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

                {/* Step Description */}
                <div className={`backdrop-blur-md p-6 rounded-xl border min-h-[120px] shadow-lg transition-colors duration-500
                    ${isDark ? 'bg-[#0a0a0a]/60 border-white/10' : 'bg-white border-gray-200'}`}>
                    <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Debugger Log</h4>
                    <p className={`font-mono text-sm leading-relaxed ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {currentStep?.explanation || '> Waiting for operation...'}
                    </p>
                </div>
            </div>
        </div>
    );
}
