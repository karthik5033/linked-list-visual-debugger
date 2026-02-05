/**
 * Variable Watch Component
 * Displays current values of important variables (head, tail, prev, curr, next, etc.)
 */

'use client';

export default function VariableWatch({ variables }) {
  if (!variables || Object.keys(variables).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Variable Watch</h2>
        <p className="text-gray-500 italic">No variables to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Variable Watch</h2>
      
      <div className="space-y-3">
        {Object.entries(variables).map(([name, value]) => (
          <div 
            key={name}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-2 border-gray-200"
          >
            <span className="font-mono font-semibold text-gray-700">
              {name}
            </span>
            <span className="font-mono text-blue-600 font-bold">
              {value === null ? 'null' : value === undefined ? 'undefined' : String(value)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
        <p className="text-xs text-gray-600">
          💡 These are the live values of pointers and variables as the algorithm executes
        </p>
      </div>
    </div>
  );
}
