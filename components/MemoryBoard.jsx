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

    // Convert linked list to array for rendering
    const getNodesArray = () => {
        const result = [];
        let current = head;
        const visited = new Set(); // Prevent infinite loops
        let limit = 20; // Safety limit

        while (current && nodes[current] && !visited.has(current) && limit > 0) {
            visited.add(current);
            result.push({ ...nodes[current], formattedValue: valueFormatter(nodes[current].value) });
            current = nodes[current].next;
            limit--;
        }
        return result;
    };

    const nodeList = getNodesArray();

    return (
        <div className="bg-[#1f2937] rounded-xl border border-[#374151] p-6 h-full shadow-inner flex flex-col">
            <h3 className="text-gray-400 font-bold mb-8 flex items-center gap-2">
                <span>{icon}</span> {title}
            </h3>

            <div className="flex-1 flex items-center content-center overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
                <div className="flex items-center px-8 min-w-max h-32">
                    {head === null ? (
                        <div className="text-gray-500 italic flex items-center gap-2">
                            <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                                NULL
                            </div>
                            <span className="text-sm">List is empty</span>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            {/* Head Pointer Visualization */}
                            <div className="mr-4 flex flex-col items-center opacity-50">
                                <div className="text-xs mb-1 font-mono text-green-500">head</div>
                                <div className="w-8 h-0.5 bg-green-500 mb-1"></div>
                            </div>

                            <AnimatePresence>
                                {nodeList.map((node, index) => (
                                    <Node
                                        key={node.id}
                                        node={node}
                                        isHead={node.id === head}
                                        isTail={node.id === tail}
                                        isHighlighted={highlightedNodes.includes(node.id)}
                                        isCurr={node.id === curr}
                                        showNextPointer={true}
                                        type={type}
                                    />
                                ))}
                            </AnimatePresence>

                            {/* Final Null Pointer */}
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded flex items-center justify-center ml-1">
                                    <span className="text-xs font-mono text-gray-500">NULL</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const Node = ({ node, isHead, isTail, isCurr, isHighlighted, showNextPointer = true, type = 'singly' }) => {
    return (
        <div className="relative flex items-center">
            {/* Node Circle/Box */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className={`
          relative z-10 min-w-[5rem] h-20 px-2 rounded-full flex items-center justify-center border-4 
          shadow-xl transition-all duration-300
          ${isHighlighted
                        ? 'bg-blue-600 border-blue-300 shadow-blue-500/50 scale-110'
                        : isCurr
                            ? 'bg-purple-600 border-purple-300 shadow-purple-500/50 scale-105'
                            : 'bg-gray-800 border-gray-600'
                    }
        `}
            >
                <span className="text-lg font-bold font-mono text-white max-w-[8rem] truncate text-center">
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
                </div>

                {/* Address Label (Simulated) */}
                <div className="absolute -bottom-6 text-[10px] text-gray-500 font-mono">
                    {node.id.replace('node_', '0x')}
                </div>
            </motion.div>

            {/* Pointers (Arrows) */}
            {showNextPointer && (
                <div className="mx-2 text-gray-500 flex flex-col items-center justify-center gap-0.5">
                    {/* Forward Arrow (Next) */}
                    <div className="flex items-center text-gray-500">
                        <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="6" x2="54" y2="6" stroke="currentColor" strokeWidth="2" />
                            <path d="M50 1L58 6L50 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {/* Backward Arrow (Prev) - Only for Doubly */}
                    {type === 'doubly' && (
                        <div className="flex items-center text-gray-600">
                            <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="6" y1="6" x2="60" y2="6" stroke="currentColor" strokeWidth="2" />
                                <path d="M10 1L2 6L10 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
