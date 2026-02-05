'use client';

import { Terminal } from 'lucide-react';

export default function CodePanel({ code, activeLine, title = "C++ Code" }) {
  if (!code || code.length === 0) {
     return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col p-8 items-center justify-center text-center">
          <Terminal className="w-12 h-12 text-gray-200 mb-4" />
          <p className="text-gray-400 text-sm">Select an operation to view its C++ implementation.</p>
        </div>
     )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
       <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <Terminal className="w-4 h-4 text-gray-400" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Source Code
        </h2>
       </div>
      
      <div className="flex-1 overflow-auto p-4 bg-white font-mono text-[13px] leading-6">
          {code.map((line, index) => (
            <div
              key={index}
              className={`group flex items-center px-2 py-0.5 rounded transition-all duration-200 ${
                index === activeLine 
                  ? 'bg-yellow-100/50 text-gray-900 border-l-2 border-yellow-400 -ml-[2px]' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className={`inline-block w-8 text-[11px] select-none text-right mr-4 ${index === activeLine ? 'text-yellow-600 font-bold' : 'text-gray-300'}`}>
                {index + 1}
              </span>
              <code className={`${index === activeLine ? 'font-medium' : ''}`}>
                <span dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }} />
              </code>
            </div>
          ))}
      </div>
    </div>
  );
}

// Simple syntax highlighter for C++ appearance
function highlightSyntax(code) {
  // Process steps in safe order: Keywords -> Variables -> Operators -> Comments
  return code
    .replace(/\b(Node|int|void|if|else|while|return|new|delete|struct|public|private)\b/g, '<span class="text-purple-600 font-semibold">$&</span>') // Keywords (removed 'class')
    .replace(/\b(head|tail|next|prev|data|value)\b/g, '<span class="text-blue-600">$&</span>') // Variables
    .replace(/(=|==|!=|->|\.|\+\+)/g, '<span class="text-gray-500">$&</span>') // Operators
    .replace(/\/\/.*/g, '<span class="text-gray-400 italic">$&</span>'); // Comments (Last to wrap everything)
}
