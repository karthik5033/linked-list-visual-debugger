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

<<<<<<< HEAD
    // Combine reachable and detached nodes for full visualization
    const getAllNodes = () => {
        const nodesArray = [];
        const visited = new Set();
        const maxNodes = 20;
=======
    // Convert linked list to array for rendering
    const getNodesArray = () => {
        const result = [];
        let current = head;
        const visited = new Set();
        let limit = 20;
>>>>>>> 557650788061e3c58028ffe18551ff12a1d6633e

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

    const isCircular = type.includes('circular');
    const isDoubly = type.includes('doubly');

    return (
<<<<<<< HEAD
        <div className="bg-[#0a0a0a]/60 backdrop-blur-md rounded-xl border border-white/10 p-6 h-full shadow-lg flex flex-col">
            <h3 className="text-gray-400 font-bold mb-8 flex items-center gap-2">
                <span>{icon}</span> {title}
            </h3>

            <div className="flex-1 flex items-center content-center overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
                <div className="flex items-center px-8 min-w-max h-32">
                    {nodeList.length === 0 ? (
=======
        <div className="bg-[#1f2937] rounded-xl border border-[#374151] p-6 h-full shadow-inner flex flex-col relative">
            <h3 className="text-gray-400 font-bold mb-8 flex items-center gap-2 relative z-10">
                <span>{icon}</span> {title}
            </h3>

            <div className="flex-1 flex items-center content-center overflow-x-auto overflow-y-visible pb-4 custom-scrollbar relative">
                <div className="flex items-center px-8 min-w-max h-64 relative">
                    {head === null ? (
>>>>>>> 557650788061e3c58028ffe18551ff12a1d6633e
                        <div className="text-gray-500 italic flex items-center gap-2">
                            <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                                NULL
                            </div>
                            <span className="text-sm">Heap is empty</span>
                        </div>
                    ) : (
<<<<<<< HEAD
                        <div className="flex items-center">
                            {/* Head Pointer Visualization */}
                            {head && (
                                <div className="mr-2 flex flex-col items-center opacity-50">
                                    <div className="text-xs mb-1 font-mono text-green-400 font-bold uppercase tracking-wider">head</div>
                                    <div className="w-8 h-1 bg-green-500 mb-1 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                                </div>
                            )}
=======
                        <div className="flex items-center relative">
>>>>>>> 557650788061e3c58028ffe18551ff12a1d6633e

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

<<<<<<< HEAD
                            {/* Final Null Pointer (only if last node points to null) */}
                            <div className="flex items-center ml-2 opacity-30">
                                <span className="text-sm font-mono text-gray-500 font-bold">NULL</span>
                            </div>
=======
                            {/* Final Element: NULL or Circular Link */}
                            {!isCircular && (
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded flex items-center justify-center ml-1">
                                        <span className="text-xs font-mono text-gray-500">NULL</span>
                                    </div>
                                </div>
                            )}

                            {/* Circular SVG Overlay */}
                            {isCircular && nodeList.length > 0 && (
                                <svg
                                    className="absolute top-0 left-0 pointer-events-none overflow-visible"
                                    style={{
                                        width: `${nodeList.length * 150}px`,
                                        height: '300px'
                                    }}
                                >
                                    <defs>
                                        <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                            <path d="M0,0 L10,5 L0,10 Z" fill="#10b981" />
                                        </marker>
                                        <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                            <path d="M0,0 L10,5 L0,10 Z" fill="#3b82f6" />
                                        </marker>
                                    </defs>

                                    {nodeList.length === 1 ? (
                                        // Single node: self-loop on the right side
                                        <>
                                            {/* Next pointer self-loop */}
                                            <path
                                                d="M 87 90 C 140 90, 160 120, 160 160 C 160 200, 140 230, 87 230 C 60 230, 50 210, 50 180"
                                                fill="none"
                                                stroke="#10b981"
                                                strokeWidth="2.5"
                                                strokeDasharray="6,4"
                                                markerEnd="url(#arrow-green)"
                                                opacity="0.7"
                                            />
                                            {/* Prev pointer self-loop - for Doubly */}
                                            {isDoubly && (
                                                <path
                                                    d="M 63 50 C 40 50, 30 70, 30 90 C 30 110, 40 130, 63 130"
                                                    fill="none"
                                                    stroke="#3b82f6"
                                                    strokeWidth="2.5"
                                                    strokeDasharray="6,4"
                                                    markerEnd="url(#arrow-blue)"
                                                    opacity="0.5"
                                                />
                                            )}
                                        </>
                                    ) : (
                                        // Multiple nodes: arc from tail to head
                                        <>
                                            {/* Next Pointer Loop (Bottom arc) - from tail to head */}
                                            <path
                                                d={`M ${(nodeList.length - 1) * 150 + 87} 90 Q ${nodeList.length * 75} 185, 63 90`}
                                                fill="none"
                                                stroke="#10b981"
                                                strokeWidth="2.5"
                                                strokeDasharray="6,4"
                                                markerEnd="url(#arrow-green)"
                                                opacity="0.7"
                                            />

                                            {/* Prev Pointer Loop (Top arc) - from head to tail - for Doubly */}
                                            {isDoubly && (
                                                <path
                                                    d={`M 87 30 Q ${nodeList.length * 75} -30, ${(nodeList.length - 1) * 150 + 63} 30`}
                                                    fill="none"
                                                    stroke="#3b82f6"
                                                    strokeWidth="2.5"
                                                    strokeDasharray="6,4"
                                                    markerEnd="url(#arrow-blue)"
                                                    opacity="0.5"
                                                />
                                            )}
                                        </>
                                    )}
                                </svg>
                            )}
>>>>>>> 557650788061e3c58028ffe18551ff12a1d6633e
                        </div>
                    )}
                </div>
            </div>
            
             {/* Legend */}
             <div className="mt-4 pt-4 border-t border-white/10 flex gap-4 text-xs text-gray-400">
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

const Node = ({ node, isHead, isTail, isCurr, isHighlighted, showNextPointer = true, type }) => {
    return (
<<<<<<< HEAD
        <div className="relative flex items-center mx-1">
=======
        <div className="relative flex items-center" style={{ width: '150px' }}>
>>>>>>> 557650788061e3c58028ffe18551ff12a1d6633e
            {/* Node Circle/Box */}
            <motion.div
                layout
                initial={{ scale: 0.8, opacity: 1 }} // Fixed: opacity 1 for visibility
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`
<<<<<<< HEAD
          relative z-10 min-w-[5.5rem] h-20 px-3 rounded-2xl flex items-center justify-center border-2 
          shadow-lg transition-all duration-300
=======
          relative z-10 w-24 h-20 px-2 rounded-xl flex items-center justify-center border-4 
          shadow-xl transition-all duration-300 mx-auto
>>>>>>> 557650788061e3c58028ffe18551ff12a1d6633e
          ${isHighlighted
                        ? 'bg-blue-600/90 border-blue-400 shadow-blue-500/30'
                        : isCurr
                            ? 'bg-purple-600/90 border-purple-400 shadow-purple-500/30'
                            : 'bg-black/40 border-white/20 hover:border-white/40'
                    }
        `}
            >
<<<<<<< HEAD
            <div className="flex flex-col items-center gap-1">
                    <span className="text-xl font-bold font-mono text-white max-w-[6rem] truncate tracking-tight drop-shadow-md">
                        {node.formattedValue !== undefined ? node.formattedValue : node.value}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                        {node.id.replace('node_', '0x')}
                    </span>
=======
                <span className="text-sm font-bold font-mono text-white text-center break-words leading-tight">
                    {node.formattedValue !== undefined ? node.formattedValue : node.value}
                </span>

                {/* Labels (Head/Tail/Curr) */}
                <div className="absolute -top-10 flex flex-col items-center gap-1 w-max">
                    {isCurr && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-bold rounded border border-purple-500/50 animate-bounce">
                            CURR
                        </span>
                    )}
                    {isHead && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/50">
                            HEAD
                        </span>
                    )}
                    {isTail && !isHead && (
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded border border-orange-500/50">
                            TAIL
                        </span>
                    )}
>>>>>>> 557650788061e3c58028ffe18551ff12a1d6633e
                </div>

                {/* Labels (Head/Tail/Curr) */}
                <div className="absolute -top-4 right-0 mr-[-5px] mt-[-5px] flex gap-2">
                    {isHead && (
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)] border border-white/20" title="HEAD"/>
                    )}
                    {isTail && (
                        <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)] border border-white/20" title="TAIL"/>
                    )}
                </div>
            </motion.div>

            {/* Pointers (Arrows) */}
            {showNextPointer && (
<<<<<<< HEAD
                <div className="ml-1 text-gray-600 flex flex-col items-center justify-center gap-0.5">
                    {/* Forward Arrow (Next) */}
                    <div className="flex items-center">
                        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M16 2L20 6L16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
=======
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[54px] flex flex-col items-center justify-center gap-1">
                    {/* Forward Arrow (Next) */}
                    <div className="flex items-center text-gray-500 w-full">
                        <svg width="100%" height="8" viewBox="0 0 24 8" fill="none" preserveAspectRatio="none">
                            <line x1="0" y1="4" x2="20" y2="4" stroke="currentColor" strokeWidth="2" />
                            <path d="M18 1L23 4L18 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {/* Backward Arrow (Prev) - Only for Doubly */}
                    {type.includes('doubly') && (
                        <div className="flex items-center text-gray-600 w-full">
                            <svg width="100%" height="8" viewBox="0 0 24 8" fill="none" preserveAspectRatio="none">
                                <line x1="4" y1="4" x2="24" y2="4" stroke="currentColor" strokeWidth="2" />
                                <path d="M6 1L1 4L6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
>>>>>>> 557650788061e3c58028ffe18551ff12a1d6633e
                </div>
            )}
        </div>
    );
};
