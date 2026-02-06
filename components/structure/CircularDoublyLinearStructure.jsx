'use client';

import { useState } from 'react';
import { useStepRunner } from '@/hooks/useStepRunner';
import CodePanel from '@/components/CodePanel';
import MemoryBoard from '@/components/MemoryBoard';
import ControlPanel from '@/components/ControlPanel';
import { useTheme } from '@/app/context/ThemeContext';

const OPERATION_TITLES = {
    insertHead: 'Insert at Head',
    insertTail: 'Insert at Tail',
    deleteValue: 'Delete Value',
    deleteHead: 'Delete Head (O(1))',
    deleteTail: 'Delete Tail (O(1))'
};

const getCodeSnippet = (op) => {
    switch (op) {
        case 'insertHead': return [
            'Node* newNode = new Node(val);',
            'newNode->next = head; newNode->prev = tail;',
            'tail->next = newNode; head->prev = newNode;',
            'head = newNode;',
        ];
        case 'insertTail': return [
            'Node* newNode = new Node(val);',
            'newNode->next = head; newNode->prev = tail;',
            'tail->next = newNode; head->prev = newNode;',
            'tail = newNode;',
        ];
        case 'deleteHead': return [
            '// O(1) Deletion',
            'if (!head) return;',
            'if (head->next == head) {',
            '    delete head; head = tail = nullptr;',
            '} else {',
            '    head->next->prev = tail;',
            '    tail->next = head->next;',
            '    Node* temp = head;',
            '    head = head->next;',
            '    delete temp;',
            '}'
        ];
        case 'deleteTail': return [
            '// O(1) Deletion (vs O(N) in Singly)',
            'if (!head) return;',
            'if (head == tail) {',
            '    delete tail; head = tail = nullptr;',
            '} else {',
            '    tail->prev->next = head;',
            '    head->prev = tail->prev;',
            '    Node* temp = tail;',
            '    tail = tail->prev;',
            '    delete temp;',
            '}'
        ];
        case 'deleteValue': return [
            '// O(N) Traversal',
            'Node* curr = head;',
            'do {',
            '    if(curr->data == val) {',
            '         curr->prev->next = curr->next;',
            '         curr->next->prev = curr->prev;',
            '         if(curr == head) head = curr->next;',
            '         if(curr == tail) tail = curr->prev;',
            '         delete curr;',
            '         return;',
            '    }',
            '    curr = curr->next;',
            '} while(curr != head);'
        ];
        default: return [];
    }
};

export default function CircularDoublyLinearStructure({ engine }) {
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
        // Using 'circular-doubly' list type
        const newSteps = engine.executeOperation('circular-doubly', op, { value: parseInt(value) });
        setSteps(newSteps);
        setTimeout(start, 100);
    };

    const handleReset = () => {
        resetRunner();
        engine.reset();
        setSteps([]);
        setCurrentOperation(null);
    };

    return (
        <div className="grid grid-cols-12 gap-6 h-full pb-6">
            <div className="col-span-12 xl:col-span-7 flex flex-col gap-6">
                <div className={`p-4 rounded-xl border flex justify-between items-center shadow-lg transition-colors duration-500
                    ${isDark ? 'bg-[#1f2937] border-[#374151]' : 'bg-white border-gray-200'}`}>
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
                        <span className={`inline-block w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                        <span className={`text-xs uppercase tracking-wider font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {isRunning ? 'Running' : 'Idle'}
                        </span>
                    </div>
                </div>

                <div className="flex-1 min-h-[300px]">
                    <MemoryBoard
                        memoryState={memoryState}
                        highlightedNodes={highlightedNodes}
                        type="circular-doubly"
                    />
                </div>

                <ControlPanel
                    onInsertHead={(val) => handleOperation('insertHead', val)}
                    onInsertTail={(val) => handleOperation('insertTail', val)}
                    onDeleteValue={(val) => handleOperation('deleteValue', val)}
                    onDeleteHead={() => handleOperation('deleteHead')}
                    onDeleteTail={() => handleOperation('deleteTail')}
                    onReset={handleReset}
                    isRunning={isRunning}
                />
            </div>

            <div className="col-span-12 xl:col-span-5 flex flex-col gap-6">
                <div className="flex-1 min-h-[400px]">
                    <CodePanel
                        code={currentCode}
                        activeLine={currentStep?.activeLine}
                        title={OPERATION_TITLES[currentOperation] || 'C++ Algorithm'}
                    />
                </div>

                <div className={`p-6 rounded-xl border min-h-[120px] shadow-lg transition-colors duration-500
                    ${isDark ? 'bg-[#1f2937] border-[#374151]' : 'bg-white border-gray-200'}`}>
                    <h4 className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">Debugger Log</h4>
                    <p className={`font-mono text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {currentStep?.explanation || '> Waiting for operation...'}
                    </p>
                </div>
            </div>
        </div>
    );
}
