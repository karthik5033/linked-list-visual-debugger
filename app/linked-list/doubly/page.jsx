'use client';

import { useRef } from 'react';
import { DSAEngine } from '@/engine/dsaEngine';
import LinkedListLayout from '@/components/LinkedListLayout';
import DoublyConcept from '@/components/concept/DoublyConcept';
import DoublyLinearStructure from '@/components/structure/DoublyLinearStructure';
import BrowserHistoryApp from '@/components/application/BrowserHistoryApp';

export default function DoublyPage() {
    // Separate engines for separate contexts
    const structureEngine = useRef(null);
    if (!structureEngine.current) structureEngine.current = new DSAEngine();

    const appEngine = useRef(null);
    if (!appEngine.current) appEngine.current = new DSAEngine();

    return (
        <LinkedListLayout
            title="Doubly Linked List"
            subtitle="Explore bidirectional navigation and browser history"
            icon="⇄"
            color="purple"
        >
            {(mode, setMode) => {
                switch (mode) {
                    case 'concept':
                        return <DoublyConcept onStartLearning={() => setMode('structure')} />;
                    case 'structure':
                        return <DoublyLinearStructure engine={structureEngine.current} />;
                    case 'application':
                        return <BrowserHistoryApp engine={appEngine.current} />;
                    default:
                        return <DoublyConcept onStartLearning={() => setMode('structure')} />;
                }
            }}
        </LinkedListLayout>
    );
}
