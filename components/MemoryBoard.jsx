'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';

export default function MemoryBoard({
    memoryState,
    highlightedNodes = [],
    title = "Memory Visualization",
    icon = "🧠",
    valueFormatter = (v) => v,
    type = 'singly',
    onNodeClick = null
}) {
    const { nodes, head, tail, curr } = memoryState || { nodes: {}, head: null, tail: null, curr: null };
    const { isDark } = useTheme();

    // Convert linked list to array for rendering
    const getNodesArray = () => {
        const result = [];
        let current = head;
        const visited = new Set();
        let limit = 20;

        while (current && nodes[current] && !visited.has(current) && limit > 0) {
            visited.add(current);
            result.push({ ...nodes[current], formattedValue: valueFormatter(nodes[current].value) });
            current = nodes[current].next;
            limit--;
        }
        return result;
    };

    const nodeList = getNodesArray();

    const isCircular = type.includes('circular');
    const isDoubly = type.includes('doubly');

    return (
        <div className={`rounded-xl border p-6 h-full shadow-inner flex flex-col relative transition-colors duration-500
            ${isDark ? 'bg-[#1f2937] border-[#374151]' : 'bg-white border-gray-200'}`}>
            <h3 className={`font-bold mb-8 flex items-center gap-2 relative z-10 transition-colors
                ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>{icon}</span> {title}
            </h3>

            <div className="flex-1 flex items-center content-center overflow-x-auto overflow-y-visible pb-4 custom-scrollbar relative">
                <div className="flex items-center px-8 min-w-max h-64 relative">
                    {head === null ? (
                        <div className="text-gray-500 flex flex-col items-center gap-3 animate-pulse opacity-50 mx-auto">
                            <div className={`w-20 h-20 border-2 border-dashed rounded-2xl flex items-center justify-center transition-colors
                                ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-300 bg-gray-50'}`}>
                                <span className="text-2xl">∅</span>
                            </div>
                            <span className="text-xs font-mono tracking-widest uppercase">Memory Empty</span>
                        </div>
                    ) : (
                        <div className="flex items-center relative">

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
                                        onClick={() => onNodeClick && onNodeClick(node.id)}
                                        isDark={isDark}
                                    />
                                ))}
                            </AnimatePresence>

                            {/* Final Element: NULL or Circular Link */}
                            {!isCircular && (
                                <div key="final-null" className="flex items-center group">
                                    <div className={`w-12 h-12 border border-dashed rounded-lg flex items-center justify-center ml-1 transition-colors group-hover:border-gray-400
                                        ${isDark ? 'bg-[#050505] border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
                                        <span className="text-[10px] font-mono text-gray-500">NULL</span>
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const Node = ({ node, isHead, isTail, isCurr, isHighlighted, showNextPointer = true, type, onClick, isDark }) => {
    return (
        <div 
            className={`relative flex items-center ${onClick ? 'cursor-pointer' : ''}`} 
            style={{ width: '150px' }}
            onClick={onClick}
        >
            {/* Node Circle/Box */}
            <motion.div
                whileHover={onClick ? { scale: 1.05 } : {}}
                whileTap={onClick ? { scale: 0.95 } : {}}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: isHighlighted ? 1.1 : 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className={`
          relative z-10 w-24 h-20 px-2 rounded-xl flex items-center justify-center border-4 
          shadow-xl transition-all duration-300 mx-auto
          ${isHighlighted
                        ? 'bg-blue-600 border-blue-300 shadow-blue-500/50'
                        : isCurr
                            ? 'bg-purple-600 border-purple-300 shadow-purple-500/50'
                            : isDark 
                                ? 'bg-gray-800 border-gray-600 hover:border-gray-400 cursor-pointer'
                                : 'bg-gray-100 border-gray-300 hover:border-gray-400 cursor-pointer'
                    }
        `}
            >
                <div className="flex flex-col items-center justify-center h-full px-2 w-full overflow-hidden scale-[0.9]">
                    <span 
                        className={`text-[11px] font-bold font-mono text-center break-all leading-tight line-clamp-3 select-none transition-colors
                            ${(isHighlighted || isCurr) ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'}
                        `}
                        title={node.value}
                    >
                        {node.formattedValue !== undefined ? node.formattedValue : node.value}
                    </span>
                </div>

                {/* Labels (Head/Tail/Curr) */}
                <div className="absolute -top-[52px] flex flex-col items-center gap-1 w-max pointer-events-none">
                    <AnimatePresence mode="popLayout">
                        {isCurr ? (
                            <motion.span 
                                key={`curr-${node.id}`}
                                initial={{ y: 5, opacity: 0 }} 
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -5, opacity: 0 }}
                                className="px-2 py-0.5 bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white text-[9px] font-black rounded uppercase tracking-tighter"
                            >
                                CURRENT
                            </motion.span>
                        ) : null}
                        <div className="flex gap-1" key={`marks-${node.id}`}>
                            {isHead && (
                                <motion.span 
                                    key={`head-${node.id}`}
                                    initial={{ y: 5, opacity: 0 }} 
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[9px] font-bold rounded border border-green-500/50 uppercase tracking-tighter"
                                >
                                    HEAD
                                </motion.span>
                            )}
                            {isTail && (
                                <motion.span 
                                    key={`tail-${node.id}`}
                                    initial={{ y: 5, opacity: 0 }} 
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-[9px] font-bold rounded border border-orange-500/50 uppercase tracking-tighter"
                                >
                                    TAIL
                                </motion.span>
                            )}
                        </div>
                    </AnimatePresence>
                </div>

                {/* Address Label (Simulated) */}
                <div className={`absolute -bottom-7 text-[9px] font-mono tracking-tighter px-1.5 rounded border transition-colors
                    ${isDark ? 'text-gray-500 bg-black/40 border-white/5' : 'text-gray-400 bg-gray-100 border-gray-200'}
                `}>
                    {node.id.replace('node_', '0x')}
                </div>
            </motion.div>

            {/* Pointers (Arrows) */}
            {showNextPointer && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[54px] flex flex-col items-center justify-center gap-1">
                    {/* Forward Arrow (Next) */}
                    <div className={`flex items-center w-full ${isDark ? 'text-gray-500' : 'text-gray-300'}`}>
                        <svg width="100%" height="8" viewBox="0 0 24 8" fill="none" preserveAspectRatio="none">
                            <line x1="0" y1="4" x2="20" y2="4" stroke="currentColor" strokeWidth="2" />
                            <path d="M18 1L23 4L18 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {/* Backward Arrow (Prev) - Only for Doubly */}
                    {type.includes('doubly') && (
                        <div className={`flex items-center w-full ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                            <svg width="100%" height="8" viewBox="0 0 24 8" fill="none" preserveAspectRatio="none">
                                <line x1="4" y1="4" x2="24" y2="4" stroke="currentColor" strokeWidth="2" />
                                <path d="M6 1L1 4L6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
