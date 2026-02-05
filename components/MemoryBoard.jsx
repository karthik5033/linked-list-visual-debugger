'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function MemoryBoard({
    memoryState,
    highlightedNodes = [],
    title = "Memory Visualization",
    icon = "🧠",
    valueFormatter = (v) => v,
    type = 'singly'
}) {
    const { nodes, head, tail, curr } = memoryState || { nodes: {}, head: null, tail: null, curr: null };

    // Combine reachable and detached nodes for full visualization
    const getAllNodes = () => {
        const nodesArray = [];
        const visited = new Set();
        const maxNodes = 20;

        // 1. Reachable nodes
        let current = head;
        let count = 0;
        while (current && nodes[current] && !visited.has(current) && count < maxNodes) {
            visited.add(current);
            nodesArray.push({ ...nodes[current], formattedValue: valueFormatter(nodes[current].value) });
            current = nodes[current].next;
            count++;
        }

        // 2. Detached nodes
        const allNodeIds = Object.keys(nodes).sort();
        for (const nodeId of allNodeIds) {
            if (!visited.has(nodeId)) {
                nodesArray.push({ ...nodes[nodeId], formattedValue: valueFormatter(nodes[nodeId].value) });
            }
        }

        return nodesArray;
    };

    const nodeList = getAllNodes();

    return (
        <div className="bg-[#1f2937] rounded-xl border border-[#374151] p-6 h-full shadow-inner flex flex-col">
            <h3 className="text-gray-400 font-bold mb-8 flex items-center gap-2">
                <span>{icon}</span> {title}
            </h3>

            <div className="flex-1 flex items-center content-center overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
                <div className="flex items-center px-8 min-w-max h-32">
                    {nodeList.length === 0 ? (
                        <div className="text-gray-500 italic flex items-center gap-2">
                            <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                                NULL
                            </div>
                            <span className="text-sm">Heap is empty</span>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            {/* Head Pointer Visualization */}
                            {head && (
                                <div className="mr-2 flex flex-col items-center opacity-50">
                                    <div className="text-xs mb-1 font-mono text-green-500">head</div>
                                    <div className="w-8 h-0.5 bg-green-500 mb-1"></div>
                                </div>
                            )}

                            <AnimatePresence mode="popLayout">
                                {nodeList.map((node, index) => (
                                    <Node
                                        key={node.id}
                                        node={node}
                                        isHead={node.id === head}
                                        isTail={node.id === tail}
                                        isHighlighted={highlightedNodes.includes(node.id)}
                                        isCurr={node.id === curr}
                                        showNextPointer={node.next !== null} // Only show if pointing to something
                                        type={type}
                                    />
                                ))}
                            </AnimatePresence>

                            {/* Final Null Pointer (only if last node points to null) */}
                            <div className="flex items-center ml-2 opacity-30">
                                <span className="text-xs font-mono text-gray-500">NULL</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
             {/* Legend */}
             <div className="mt-4 pt-4 border-t border-gray-700 flex gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    <span>Head</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500/20 border border-orange-500/50"></div>
                    <span>Tail</span>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500/20 border border-purple-500/50"></div>
                    <span>Current</span>
                </div>
            </div>
        </div>
    );
}

const Node = ({ node, isHead, isTail, isCurr, isHighlighted, showNextPointer = true, type = 'singly' }) => {
    return (
        <div className="relative flex items-center mx-1">
            {/* Node Circle/Box */}
            <motion.div
                layout
                initial={{ scale: 0.8, opacity: 1 }} // Fixed: opacity 1 for visibility
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`
          relative z-10 min-w-[4rem] h-16 px-2 rounded-xl flex items-center justify-center border-2 
          shadow-lg transition-all duration-300
          ${isHighlighted
                        ? 'bg-blue-600/90 border-blue-400 shadow-blue-500/30'
                        : isCurr
                            ? 'bg-purple-600/90 border-purple-400 shadow-purple-500/30'
                            : 'bg-gray-800 border-gray-600'
                    }
        `}
            >
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold font-mono text-white max-w-[6rem] truncate">
                        {node.formattedValue !== undefined ? node.formattedValue : node.value}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono mt-0.5">
                        {node.id.replace('node_', '0x')}
                    </span>
                </div>

                {/* Labels (Head/Tail/Curr) */}
                <div className="absolute -top-3 right-0 mr-[-5px] mt-[-5px] flex gap-1">
                    {isHead && (
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]" title="HEAD"/>
                    )}
                    {isTail && (
                        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.8)]" title="TAIL"/>
                    )}
                </div>
            </motion.div>

            {/* Pointers (Arrows) */}
            {showNextPointer && (
                <div className="ml-1 text-gray-600 flex flex-col items-center justify-center gap-0.5">
                    {/* Forward Arrow (Next) */}
                    <div className="flex items-center">
                        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M16 2L20 6L16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};
