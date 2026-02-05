'use client';

import { Calculator } from 'lucide-react';

export default function VariableWatch({ variables }) {
  if (!variables || Object.keys(variables).length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center p-6 text-center h-48">
        <Calculator className="w-8 h-8 text-gray-200 mb-2" />
        <p className="text-gray-400 text-xs">Variables will appear here during execution</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <Calculator className="w-4 h-4 text-gray-400" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Variables
        </h2>
      </div>
      
      <div className="p-2 space-y-1 overflow-y-auto">
        {Object.entries(variables).map(([name, value]) => (
          <div 
            key={name}
            className="group flex justify-between items-center px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
          >
            <span className="font-mono text-xs font-medium text-gray-500">
              {name}
            </span>
            <span className={`font-mono text-sm font-semibold px-2 py-0.5 rounded ${
               value === null ? 'text-gray-400 bg-gray-100' : 
               value === undefined ? 'text-gray-300' :
               typeof value === 'string' && value.startsWith('node_') ? 'text-blue-600 bg-blue-50' :
               'text-gray-900 bg-gray-100'
            }`}>
              {value === null ? 'NULL' : value === undefined ? 'undefined' : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
