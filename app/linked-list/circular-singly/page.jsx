'use client';

import { useRef } from 'react';
import { DSAEngine } from '@/engine/dsaEngine';
import LinkedListLayout from '@/components/LinkedListLayout';
import CircularSinglyConcept from '@/components/concept/CircularSinglyConcept';
import CircularLinearStructure from '@/components/structure/CircularLinearStructure';
import CircularSinglyApp from '@/components/application/CircularSinglyApp';

export default function CircularSinglyLinkedListPage() {
    // Separate engines for separate contexts to keep state clean
    // Renamed ref to force HMR reset
    const visualizerEngine = useRef(null);
    if (!visualizerEngine.current) visualizerEngine.current = new DSAEngine();

    // Renamed ref to force HMR reset
    const musicEngine = useRef(null);
    if (!musicEngine.current) musicEngine.current = new DSAEngine();

    return (
        <LinkedListLayout
            title="Circular Singly Linked List"
            subtitle="Explore how the last node connects back to the start"
            icon="↻"
            color="green"
        >
            {(mode, setMode) => {
                switch (mode) {
                    case 'concept':
                        return <CircularSinglyConcept onStartLearning={() => setMode('structure')} />;
                    case 'structure':
                        return <CircularLinearStructure engine={visualizerEngine.current} />;
                    case 'application':
                        return <CircularSinglyApp engine={musicEngine.current} />;
                    default:
                        return <CircularSinglyConcept onStartLearning={() => setMode('structure')} />;
                }
            }}
        </LinkedListLayout>
    );
}
