'use client';

import { AnimatePresence } from 'framer-motion';
import Node from './Node';
import Arrow from './Arrow';

export default function MemoryBoard({ memoryState, highlightedNodes = [] }) {
  if (!memoryState || !memoryState.nodes || Object.keys(memoryState.nodes).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full opacity-50">
        <div className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-xl mb-4" />
        <p className="text-gray-400 text-sm font-medium">Heap Empty</p>
        <p className="text-gray-300 text-xs mt-1">Initialize data to view memory map</p>
      </div>
    );
  }

  // Build array of nodes following the linked list
  const nodesArray = [];
  let current = memoryState.head;
  const visited = new Set();
  const maxNodes = 20;

  while (current && !visited.has(current) && nodesArray.length < maxNodes) {
    visited.add(current);
    nodesArray.push(memoryState.nodes[current]);
    current = memoryState.nodes[current]?.next;
  }

  // Detect if this is a Doubly LL by checking for 'prev' property on first node
  const isDoubly = nodesArray.length > 0 && nodesArray[0].hasOwnProperty('prev');

  return (
    <div className="flex items-center min-w-max p-4 h-full">
      <AnimatePresence mode="popLayout">
        {nodesArray.map((node, index) => (
          <div key={node.id} className="flex items-center relative group">
            
            <div className="flex flex-col items-center relative z-10">
              <Node
                value={node.value}
                nodeId={node.id}
                isHead={node.id === memoryState.head}
                isTail={node.id === memoryState.tail}
                isHighlighted={highlightedNodes.includes(node.id)}
              />
              
              {/* Render Prev Arrow underneath if Doubly */}
              {isDoubly && index > 0 && (
                <div className="absolute top-14 w-full flex justify-center -left-[50%]">
                   <Arrow direction="left" isHighlighted={false} />
                </div>
              )}
            </div>
            
            {/* Next Arrow */}
            {index < nodesArray.length - 1 && (
              <div className="mx-0">
                <Arrow 
                  direction="right" 
                  label={index === 0 ? "next" : ""} // Only show usage label once for cleanliness
                  isHighlighted={highlightedNodes.includes(node.id)}
                />
              </div>
            )}

            {/* NULL Pointer */}
            {index === nodesArray.length - 1 && node.next === null && (
              <div className="flex items-center ml-2">
                 <Arrow direction="right" label="" />
                <div className="flex flex-col items-center ml-1 opacity-50">
                   <div className="w-8 h-8 rounded border border-dashed border-gray-400 flex items-center justify-center bg-gray-50 scale-75">
                    <span className="text-[8px] font-mono text-gray-500">NULL</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
