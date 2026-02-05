'use client';

import { useState } from 'react';
import { useStepRunner } from '@/hooks/useStepRunner';
import CodePanel from '@/components/CodePanel';
import MemoryBoard from '@/components/MemoryBoard';
import ControlPanel from '@/components/ControlPanel';

const OPERATION_TITLES = {
    insertHead: 'Insert at Head',
    insertTail: 'Insert at Tail',
    deleteValue: 'Delete Value',
    deleteHead: 'Delete Head',
    deleteTail: 'Delete Tail'
};

const getCodeSnippet = (op) => {
    switch (op) {
        case 'insertHead': return [
            'Node* newNode = new Node(val);',
            'if (head == nullptr) {',
            '    head = tail = newNode; tail->next = head;',
            '} else {',
            '    newNode->next = head;',
            '    tail->next = newNode;',
            '    head = newNode;',
            '}'
        ];
        case 'insertTail': return [
            'Node* newNode = new Node(val);',
            'if (head == nullptr) {',
            '    head = tail = newNode; tail->next = head;',
            '} else {',
            '    tail->next = newNode;',
            '    newNode->next = head;',
            '    tail = newNode;',
            '}'
        ];
        case 'deleteHead': return [
            'if (head == nullptr) return;',
            'if (head->next == head) {',
            '    delete head; head = tail = nullptr;',
            '} else {',
            '    Node* temp = head;',
            '    tail->next = head->next;',
            '    head = head->next;',
            '    delete temp;',
            '}'
        ];
        case 'deleteTail': return [
            'if (head == nullptr) return;',
            'if (head == tail) {',
            '    delete head; head = tail = nullptr;',
            '} else {',
            '    Node* curr = head;',
            '    while(curr->next != tail) curr = curr->next;',
            '    curr->next = head;',
            '    delete tail;',
            '    tail = curr;',
            '}'
        ];
        case 'deleteValue': return [
            'if (head == nullptr) return;',
            'if (head->data == val) {',
            '    // Delete Head Logic',
            '} else {',
            '    Node* curr = head;',
            '    while(curr->next != head) {',
            '        if(curr->next->data == val) {',
            '             Node* temp = curr->next;',
            '             curr->next = temp->next;',
            '             if(temp == tail) tail = curr;',
            '             delete temp;',
            '             return;',
            '        }',
            '        curr = curr->next;',
            '    }',
            '}'
        ];
        default: return [];
    }
};

export default function CircularLinearStructure({ engine }) {
    const [steps, setSteps] = useState([]);
    const [currentOperation, setCurrentOperation] = useState(null);

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
        // Using 'circular-singly' list type
        const newSteps = engine.executeOperation('circular-singly', op, { value: parseInt(value) });
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

                <div className="flex-1 min-h-[300px]">
                    <MemoryBoard
                        memoryState={memoryState}
                        highlightedNodes={highlightedNodes}
                        type="circular-singly"
                    />
                </div>

                <ControlPanel
                    onInsertHead={(val) => handleOperation('insertHead', val)}
                    onInsertTail={(val) => handleOperation('insertTail', val)}
                    onDeleteValue={(val) => handleOperation('deleteValue', val)}
                    onDeleteHead={() => handleOperation('deleteHead')}
                    onDeleteTail={() => handleOperation('deleteTail')}
                    // Search not implemented for generic circular yet
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

                <div className="bg-[#1f2937] p-6 rounded-xl border border-[#374151] min-h-[120px] shadow-lg">
                    <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Debugger Log</h4>
                    <p className="font-mono text-sm text-green-400 leading-relaxed">
                        {currentStep?.explanation || '> Waiting for operation...'}
                    </p>
                </div>
            </div>
        </div>
    );
}
