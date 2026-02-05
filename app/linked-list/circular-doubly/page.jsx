'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DSAEngine } from '@/engine/dsaEngine';
import ModeTabs from '@/components/ModeTabs';

import CircularDoublyConcept from '@/components/concept/CircularDoublyConcept';
import CircularDoublyLinearStructure from '@/components/structure/CircularDoublyLinearStructure';
import FibonacciHeapRoot from '@/components/application/FibonacciHeapRoot';

const engine = new DSAEngine();

export default function CircularDoublyLinkedListPage() {
  const [activeTab, setActiveTab] = useState('concept');
  const [key, setKey] = useState(0);

  // Reset engine when switching tabs to avoid stale state
  useEffect(() => {
    setKey(prev => prev + 1);
    engine.reset();
  }, [activeTab]);

  return (
    <div className="h-screen bg-[#0a0e1a] text-white flex flex-col overflow-hidden font-dm-sans selection:bg-blue-500/30">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 z-50"></div>

      {/* Header */}
      <header className="bg-[#111827] border-b border-[#1f2937] px-6 py-4 flex items-center justify-between z-20 shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back
          </Link>
          <div className="h-6 w-px bg-gray-700 mx-2"></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent flex items-center gap-2">
            <span>⟲</span> Circular Doubly Linked List
          </h1>
        </div>

        <ModeTabs currentMode={activeTab} onModeChange={setActiveTab} />
      </header>

      {/* Main App Area */}
      <main className="flex-1 overflow-hidden p-6 relative">
        <div className="absolute inset-0 bg-[#0a0e1a] bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>
        <div className="h-full max-w-[1920px] mx-auto z-10 relative">
          {activeTab === 'concept' && (
            <CircularDoublyConcept onStartLearning={() => setActiveTab('structure')} />
          )}
          {activeTab === 'structure' && (
            <CircularDoublyLinearStructure engine={engine} key={`struct-${key}`} />
          )}
          {activeTab === 'application' && (
            <FibonacciHeapRoot engine={engine} key={`app-${key}`} />
          )}
        </div>
      </main>
    </div>
  );
}
