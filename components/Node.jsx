/**
 * Node Component
 * Renders a single node in the linked list visualization
 */

'use client';

export default function Node({ value, nodeId, isHead, isTail, isHighlighted }) {
  return (
    <div className="flex flex-col items-center">
      {/* Labels */}
      <div className="flex gap-2 mb-1">
        {isHead && (
          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
            HEAD
          </span>
        )}
        {isTail && (
          <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
            TAIL
          </span>
        )}
      </div>

      {/* Node Box */}
      <div 
        className={`
          relative w-20 h-20 rounded-lg border-4 flex items-center justify-center
          transition-all duration-300 shadow-lg
          ${isHighlighted 
            ? 'border-yellow-400 bg-yellow-50 scale-110' 
            : 'border-gray-700 bg-white'
          }
        `}
      >
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>

      {/* Node ID */}
      <span className="text-xs text-gray-500 mt-1 font-mono">{nodeId}</span>
    </div>
  );
}
