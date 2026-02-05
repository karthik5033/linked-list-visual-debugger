/**
 * Singly Linked List Page
 * Main debugger interface for singly linked list operations
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
    // Get the C++ code for this operation
    const code = getSinglyLLCode(operation);
    setCurrentCode(code);
    setCurrentOperation(operation);

    // Execute the operation and get steps
    const generatedSteps = engine.executeOperation('singly', operation, params);
    setSteps(generatedSteps);

    // Start stepping through
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              Singly Linked List Debugger
            </h1>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Data Structure</div>
            <div className="text-lg font-bold text-blue-600">Singly Linked List</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Control Panel */}
          <div className="lg:col-span-1">
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

            {/* Variable Watch */}
            <div className="mt-6">
              <VariableWatch 
                variables={currentStep?.variables || {}} 
              />
            </div>
          </div>

          {/* Right Column: Visualization and Code */}
          <div className="lg:col-span-2 space-y-6">
            {/* Memory Board */}
            <MemoryBoard
              memoryState={currentStep?.memoryState || engine.getMemoryState()}
              highlightedNodes={[]}
            />

            {/* Code Panel */}
            {currentCode.length > 0 && (
              <CodePanel
                code={currentCode}
                activeLine={currentStep?.activeLine}
                title={`C++ Code - ${currentOperation}`}
              />
            )}

            {/* Step Description */}
            {currentStep?.description && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Current Step Description
                </h3>
                <p className="text-gray-700">{currentStep.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📚 About Singly Linked List
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h4 className="font-bold mb-2">Structure</h4>
              <p className="text-sm">
                Each node contains data and a single pointer (next) to the next node.
                The last node points to NULL.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Time Complexity</h4>
              <ul className="text-sm space-y-1">
                <li>• Insert at head: O(1)</li>
                <li>• Insert at tail: O(1) with tail pointer</li>
                <li>• Delete: O(n)</li>
                <li>• Search: O(n)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
