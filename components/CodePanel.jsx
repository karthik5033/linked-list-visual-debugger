/**
 * Code Panel Component
 * Displays C++ code with active line highlighting
 */

'use client';

export default function CodePanel({ code, activeLine, title = "C++ Code" }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm">
          {code.map((line, index) => (
            <div
              key={index}
              className={`py-1 px-3 rounded transition-colors ${
                index === activeLine 
                  ? 'bg-yellow-400 text-gray-900 font-bold' 
                  : 'text-gray-300'
              }`}
            >
              <span className="inline-block w-8 text-gray-500 select-none">
                {index + 1}
              </span>
              <code>{line}</code>
            </div>
          ))}
        </pre>
      </div>

      {activeLine !== null && activeLine !== undefined && (
        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Executing Line {activeLine + 1}:</span>
            <code className="ml-2 text-blue-700">{code[activeLine]}</code>
          </p>
        </div>
      )}
    </div>
  );
}
