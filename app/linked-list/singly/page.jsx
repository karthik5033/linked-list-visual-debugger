'use client';

import { useState, useRef } from 'react';
import { DSAEngine } from '@/engine/dsaEngine';
import LinkedListLayout from '@/components/LinkedListLayout';
import SinglyConcept from '@/components/concept/SinglyConcept';
import LinearStructure from '@/components/structure/LinearStructure';
import MusicPlaylist from '@/components/application/MusicPlaylist';

export default function SinglyPage() {
    // Use useRef to keep the engine instance stable across checking re-renders
    // We use a lazy initializer ref pattern or just a singleton for this component lifecycle
    const engineRef = useRef(null);

    // Use refs to strictly separate state contexts
    // 1. Structure Engine: For the numerical debugging exercises
    // 2. App Engine: For the music playlist (starts clean, uses string names)
    const structureEngine = useRef(new DSAEngine());
    const appEngine = useRef(new DSAEngine());

    return (
        <LinkedListLayout
            title="Singly Linked List"
            subtitle="Single-direction memory nodes"
            icon="→"
            color="blue"
        >
            {(mode, setMode) => {
                switch (mode) {
                    case 'concept':
                        return <SinglyConcept onStartLearning={() => setMode('structure')} />;

                    case 'structure':
                        return <LinearStructure engine={structureEngine.current} />;

                    case 'application':
                        return <MusicPlaylist engine={appEngine.current} />;

                    default:
                        return null;
                }
            }}
        </LinkedListLayout>
    );
}
