/**
 * Memory Board Component
 * Visualizes the linked list structure with nodes and arrows
 */

'use client';

import Node from './Node';
import Arrow from './Arrow';

export default function MemoryBoard({ memoryState, highlightedNodes = [] }) {
  if (!memoryState || !memoryState.nodes || Object.keys(memoryState.nodes).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Memory Visualization</h2>
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-lg italic">
            Empty List - Execute an operation to see memory visualization
          </p>
        </div>
      </div>
    );
  }

  // Build array of nodes following the linked list
  const nodesArray = [];
  let current = memoryState.head;
  const visited = new Set();
  const maxNodes = 20; // Prevent infinite loops in circular lists

  while (current && !visited.has(current) && nodesArray.length < maxNodes) {
    visited.add(current);
    nodesArray.push(memoryState.nodes[current]);
    current = memoryState.nodes[current]?.next;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Memory Visualization</h2>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex items-center min-w-max p-8">
          {nodesArray.map((node, index) => (
            <div key={node.id} className="flex items-center">
              <Node
                value={node.value}
                nodeId={node.id}
                isHead={node.id === memoryState.head}
                isTail={node.id === memoryState.tail}
                isHighlighted={highlightedNodes.includes(node.id)}
              />
              
              {/* Show arrow if there's a next node */}
              {index < nodesArray.length - 1 && (
                <Arrow 
                  direction="right" 
                  label="next"
                  isHighlighted={highlightedNodes.includes(node.id)}
                />
              )}

              {/* Show null arrow for the last node if it's not circular */}
              {index === nodesArray.length - 1 && node.next === null && (
                <div className="ml-4 flex items-center">
                  <Arrow direction="right" label="" />
                  <div className="w-16 h-16 rounded-lg border-4 border-dashed border-gray-400 flex items-center justify-center bg-gray-50">
                    <span className="text-gray-500 font-mono text-sm">NULL</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Memory Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Total Nodes</div>
          <div className="text-2xl font-bold text-blue-700">
            {Object.keys(memoryState.nodes).length}
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
          <div className="text-sm text-gray-600 mb-1">Head Node</div>
          <div className="text-xl font-bold text-purple-700 font-mono">
            {memoryState.head || 'NULL'}
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <div className="text-sm text-gray-600 mb-1">Tail Node</div>
          <div className="text-xl font-bold text-green-700 font-mono">
            {memoryState.tail || 'NULL'}
          </div>
        </div>
      </div>
    </div>
  );
}
