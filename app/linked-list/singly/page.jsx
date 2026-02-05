'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, GitCommit } from 'lucide-react';
import ControlPanel from '@/components/ControlPanel';
import MemoryBoard from '@/components/MemoryBoard';
import CodePanel from '@/components/CodePanel';
import VariableWatch from '@/components/VariableWatch';
import { useStepRunner } from '@/hooks/useStepRunner';
import { DSAEngine } from '@/engine/dsaEngine';
import { getSinglyLLCode } from '@/codeMap/singlyLL.cpp.js';

export default function SinglyLinkedListPage() {
  const [engine] = useState(() => new DSAEngine());
  const [steps, setSteps] = useState([]);
  const [currentCode, setCurrentCode] = useState([]);
  const [currentOperation, setCurrentOperation] = useState('');

  const {
    currentStep,
    currentStepIndex,
    nextStep,
    prevStep,
    reset: resetRunner,
    start,
    hasNext,
    hasPrev,
    isRunning,
    totalSteps
  } = useStepRunner(steps);

  const handleExecute = (operation, params) => {
    const code = getSinglyLLCode(operation);
    setCurrentCode(code);
    setCurrentOperation(operation);
    const generatedSteps = engine.executeOperation('singly', operation, params);
    setSteps(generatedSteps);
    setTimeout(() => start(), 100);
  };

  const handleReset = () => {
    resetRunner();
    engine.reset();
    setSteps([]);
    setCurrentCode([]);
    setCurrentOperation('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Pro Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <GitCommit className="w-5 h-5" />
              Singly Linked List
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             DEBUGGER ONLINE
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-6 overflow-hidden max-w-[1920px] mx-auto w-full">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
          
          {/* Left Panel: Controls & Variables */}
          <div className="col-span-3 flex flex-col gap-6 h-full overflow-hidden">
             <div className="flex-none">
              <ControlPanel
                listType="singly"
                onExecute={handleExecute}
                onNextStep={nextStep}
                onPrevStep={prevStep}
                onReset={handleReset}
                hasNext={hasNext}
                hasPrev={hasPrev}
                isRunning={isRunning}
                currentStepIndex={currentStepIndex}
                totalSteps={totalSteps}
              />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <VariableWatch variables={currentStep?.variables || {}} />
            </div>
          </div>

          {/* Center Panel: Visualization */}
          <div className="col-span-6 flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 p-4 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Memory Graph</h2>
              <div className="flex gap-2">
                 <div className="flex items-center gap-1.5 text-[10px] text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                  <div className="w-2 h-2 bg-black rounded-sm" /> NODE
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                  <div className="w-2 h-2 bg-yellow-400 rounded-sm" /> ACTIVE
                </div>
              </div>
            </div>
             <div className="flex-1 overflow-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] p-8">
              <MemoryBoard
                memoryState={currentStep?.memoryState || engine.getMemoryState()}
                highlightedNodes={[]}
              />
            </div>
             {currentStep?.description && (
              <div className="p-4 border-t border-gray-100 bg-white">
                <p className="text-sm text-gray-700 font-mono">
                  <span className="text-black font-bold mr-2">{'>'}</span>
                  {currentStep.description}
                </p>
              </div>
            )}
          </div>

          {/* Right Panel: Code */}
           <div className="col-span-3 h-full overflow-hidden">
            <CodePanel
               code={currentCode}
               activeLine={currentStep?.activeLine}
               title="Algorithm Source"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
