'use client';

import { useState } from 'react';

export default function ControlPanel({
    onInsertHead,
    onInsertTail,
    onDeleteValue,
    onSearch,
    onReset,
    isRunning
}) {
    const [inputValue, setInputValue] = useState('');

    const handleAction = (action) => {
        if (!inputValue.trim()) return;
        action(inputValue);
        setInputValue('');
    };

    return (
        <div className="bg-[#1f2937] p-4 rounded-xl border border-[#374151] shadow-lg">
            <div className="flex flex-col gap-4">
                {/* Input Field */}
                <div className="relative">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter value..."
                        disabled={isRunning}
                        className="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAction(onInsertTail);
                        }}
                    />
                </div>

                {/* Operation Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => handleAction(onInsertHead)}
                        disabled={isRunning || !inputValue}
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>➕ Head</span>
                    </button>

                    <button
                        onClick={() => handleAction(onInsertTail)}
                        disabled={isRunning || !inputValue}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <span>➕ Tail</span>
                    </button>

<<<<<<< Updated upstream
                    <button
                        onClick={() => handleAction(onDeleteValue)}
                        disabled={isRunning || !inputValue}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>🗑️ Delete</span>
                    </button>

                    <button
                        onClick={() => handleAction(onSearch)}
                        disabled={isRunning || !inputValue}
                        className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>🔍 Search</span>
                    </button>
                </div>

                <div className="border-t border-[#374151] my-1"></div>

                <button
                    onClick={onReset}
                    disabled={isRunning}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                >
                    Reset Memory
                </button>
=======
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
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
            >
              <option value="">Select Action...</option>
              {operations[listType]?.map(op => (
                <option key={op.id} value={op.id}>{op.label}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
>>>>>>> Stashed changes
            </div>
        </div>
<<<<<<< Updated upstream
    );
=======

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
              onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            />
          </div>
        )}

        {/* Execute Button */}
        <button
          onClick={handleExecute}
          disabled={!selectedOperation}
          className="w-full mt-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed py-2.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 group shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
          Execute
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
>>>>>>> Stashed changes
}
