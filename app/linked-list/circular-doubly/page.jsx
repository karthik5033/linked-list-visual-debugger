'use client';

import { useRef } from 'react';
import { DSAEngine } from '@/engine/dsaEngine';
import LinkedListLayout from '@/components/LinkedListLayout';
import CircularDoublyConcept from '@/components/concept/CircularDoublyConcept';
import CircularDoublyLinearStructure from '@/components/structure/CircularDoublyLinearStructure';
import TaskSwitcherApp from '@/components/application/TaskSwitcherApp';
import FibonacciHeapRoot from '@/components/application/FibonacciHeapRoot';

export default function CircularDoublyLinkedListPage() {
    // Separate engines for separate contexts
    const visualizerEngine = useRef(null);
    if (!visualizerEngine.current) visualizerEngine.current = new DSAEngine();

    const osEngine = useRef(null);
    if (!osEngine.current) osEngine.current = new DSAEngine();

    const fibHeapEngine = useRef(null);
    if (!fibHeapEngine.current) fibHeapEngine.current = new DSAEngine();

    return (
        <LinkedListLayout
            title="Circular Doubly Linked List"
            subtitle="Bidirectional ring structure with O(1) operations"
            icon="⟲"
            color="purple"
        >
            {(mode, setMode) => {
                switch (mode) {
                    case 'concept':
                        return <CircularDoublyConcept onStartLearning={() => setMode('structure')} />;
                    case 'structure':
                        return <CircularDoublyLinearStructure engine={visualizerEngine.current} />;
                    case 'application':
                        return (
                            <div className="flex flex-col gap-12">
                                <div className="flex flex-col gap-4">
                                     <h3 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                                        <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400">1</span>
                                        OS Task Switcher
                                    </h3>
                                    <TaskSwitcherApp engine={osEngine.current} />
                                </div>
                                
                                <hr className="border-gray-800" />

                                <div className="flex flex-col gap-4">
                                    <h3 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                                        <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400">2</span>
                                        Fibonacci Heap (Advanced)
                                    </h3>
                                    <FibonacciHeapRoot engine={fibHeapEngine.current} />
                                </div>
                            </div>
                        );
                    default:
                        return <CircularDoublyConcept onStartLearning={() => setMode('structure')} />;
                }
            }}
        </LinkedListLayout>
    );
}
