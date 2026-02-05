'use client';

import { useState } from 'react';
import { Play, ChevronRight, ChevronLeft, RotateCcw, Command } from 'lucide-react';

export default function ControlPanel({ 
  listType, 
  onExecute, 
  onNextStep, 
  onPrevStep, 
  onReset,
  hasNext,
  hasPrev,
  isRunning,
  currentStepIndex,
  totalSteps
}) {
  const operations = {
    'singly': [
      { id: 'insertHead', label: 'Insert at Head', needsValue: true },
      { id: 'insertTail', label: 'Insert at Tail', needsValue: true },
      { id: 'deleteHead', label: 'Delete Head', needsValue: false },
      { id: 'deleteTail', label: 'Delete Tail', needsValue: false },
      { id: 'traverse', label: 'Traverse', needsValue: false },
      { id: 'reverse', label: 'Reverse', needsValue: false },
    ],
    'doubly': [
      { id: 'insertHead', label: 'Insert at Head', needsValue: true },
      { id: 'insertTail', label: 'Insert at Tail', needsValue: true },
      { id: 'deleteHead', label: 'Delete Head', needsValue: false },
      { id: 'deleteTail', label: 'Delete Tail', needsValue: false },
       { id: 'traverse', label: 'Traverse', needsValue: false },
    ],
    'circular-singly': [
      { id: 'insertHead', label: 'Insert at Head', needsValue: true },
    ],
    'circular-doubly': [
      { id: 'insertHead', label: 'Insert at Head', needsValue: true },
    ],
  };

  const [selectedOperation, setSelectedOperation] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleExecute = () => {
    const operation = operations[listType].find(op => op.id === selectedOperation);
    if (!operation) return;

    const params = {};
    if (operation.needsValue) {
      const value = parseInt(inputValue);
      if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
      }
      params.value = value;
    }

    onExecute(selectedOperation, params);
    setInputValue('');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <Command className="w-5 h-5 text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Control Station
        </h2>
      </div>
      
      {/* Operation Selection */}
      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
            Operation
          </label>
          <div className="relative">
            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
              disabled={isRunning}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 disabled:opacity-50 transition-colors"
            >
              <option value="">Select Action...</option>
              {operations[listType]?.map(op => (
                <option key={op.id} value={op.id}>{op.label}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>
        </div>

        {/* Value Input */}
        {selectedOperation && operations[listType]?.find(op => op.id === selectedOperation)?.needsValue && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
              Input Value
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-300"
              placeholder="e.g. 42"
              disabled={isRunning}
              onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            />
          </div>
        )}

        {/* Execute Button */}
        <button
          onClick={handleExecute}
          disabled={!selectedOperation || isRunning}
          className="w-full mt-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed py-2.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 group shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
          {isRunning ? 'Running...' : 'Execute'}
        </button>
      </div>

      {/* Playback Controls */}
      {isRunning && (
        <div className="pt-6 mt-6 border-t border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
              STEP {currentStepIndex + 1} / {totalSteps}
            </span>
            <button
              onClick={onReset}
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onPrevStep}
              disabled={!hasPrev}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            
            <button
              onClick={onNextStep}
              disabled={!hasNext}
              className="flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:hover:bg-black shadow-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
