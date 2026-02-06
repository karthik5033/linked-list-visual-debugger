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
    deleteHead: 'Delete Head',
    deleteTail: 'Delete Tail',
    search: 'Search Value',
};

const getCodeSnippet = (op) => {
    switch (op) {
        case 'insertHead': return [
            "Node* newNode = new Node(val);",
            "if (head == nullptr) {",
            "    head = tail = newNode;",
            "} else {",
            "    newNode->next = head;",
            "    head->prev = newNode;",
            "    head = newNode;",
            "}"
        ];
        case 'insertTail': return [
            "Node* newNode = new Node(val);",
            "if (tail == nullptr) {",
            "    head = tail = newNode;",
            "} else {",
            "    tail->next = newNode;",
            "    newNode->prev = tail;",
            "    tail = newNode;",
            "}"
        ];
        case 'deleteHead': return [
            "if (head == nullptr) return;",
            "Node* temp = head;",
            "head = head->next;",
            "if (head != nullptr) {",
            "    head->prev = nullptr;",
            "} else {",
            "    tail = nullptr;",
            "}",
            "delete temp;"
        ];
        case 'deleteTail': return [
            "if (tail == nullptr) return;",
            "Node* temp = tail;",
            "tail = tail->prev;",
            "if (tail != nullptr) {",
            "    tail->next = nullptr;",
            "} else {",
            "    head = nullptr;",
            "}",
            "delete temp;"
        ];
        case 'deleteValue': return [
            "Node* curr = head;",
            "while (curr != nullptr && curr->data != val) {",
            "    curr = curr->next;",
            "}",
            "if (curr == nullptr) return;",
            "if (curr->prev) curr->prev->next = curr->next;",
            "else head = curr->next;",
            "if (curr->next) curr->next->prev = curr->prev;",
            "else tail = curr->prev;",
            "delete curr;"
        ];
        case 'search': return [
            "Node* current = head;",
            "int index = 0;",
            "while (current != nullptr) {",
            "    if (current->data == val) return index;",
            "    current = current->next;",
            "    index++;",
            "}",
            "return -1;"
        ];
        default: return [];
    }
};

export default function DoublyLinearStructure({ engine }) {
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
        const newSteps = engine.executeOperation('doubly', op, { value: value });
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
            {/* LEFT COLUMN: Controls & Memory */}
            <div className="col-span-12 xl:col-span-7 flex flex-col gap-6">

                {/* Playback Controls Overlay */}
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
                    <MemoryBoard
                        memoryState={memoryState}
                        highlightedNodes={highlightedNodes}
                        type="doubly"
                    />
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
