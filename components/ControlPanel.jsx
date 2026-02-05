/**
 * Control Panel Component
 * Allows users to select operations, input values, and control step execution
 */

'use client';

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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Control Panel</h2>
      
      {/* Operation Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Operation
        </label>
        <select
          value={selectedOperation}
          onChange={(e) => setSelectedOperation(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          disabled={isRunning}
        >
          <option value="">Choose an operation...</option>
          {operations[listType]?.map(op => (
            <option key={op.id} value={op.id}>{op.label}</option>
          ))}
        </select>
      </div>

      {/* Value Input */}
      {selectedOperation && operations[listType]?.find(op => op.id === selectedOperation)?.needsValue && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter Value
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Enter a number"
            disabled={isRunning}
          />
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={handleExecute}
        disabled={!selectedOperation || isRunning}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mb-6"
      >
        Execute Operation
      </button>

      {/* Step Controls */}
      {isRunning && (
        <div className="border-t-2 border-gray-200 pt-6">
          <div className="mb-4 text-center">
            <span className="text-sm font-semibold text-gray-700">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onPrevStep}
              disabled={!hasPrev}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            
            <button
              onClick={onNextStep}
              disabled={!hasNext}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>

          <button
            onClick={onReset}
            className="w-full mt-3 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
