'use client';

import { useTheme } from '@/app/context/ThemeContext';

export default function CircularSinglyConcept({ onStartLearning }) {
    const { isDark } = useTheme();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in-up">
            <div className={`p-8 rounded-3xl border shadow-2xl max-w-4xl transition-colors duration-500
                ${isDark
                    ? 'bg-green-900/20 border-green-500/30'
                    : 'bg-white border-green-200 shadow-green-100'}`}>
                <div className="text-6xl mb-6 text-green-500">↻</div>
                <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Circular Singly Linked List</h2>
                <p className={`text-xl mb-8 leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    A linked list where the
                    <span className="text-green-500 font-bold mx-1">last node points back to the head</span>
                    instead of NULL. This forms a continuous circle, perfect for Round-Robin scheduling.
                </p>

                {/* Visual Diagram */}
                <div className={`p-8 rounded-xl border mb-8 overflow-x-auto relative transition-colors
                    ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-center gap-4 min-w-max font-mono text-sm relative z-10 pb-8">

                        {/* Node 1 */}
                        <div className="flex items-center relative">
                            <div className={`w-24 h-16 rounded-lg flex border-2 shadow-lg z-10 relative
                                ${isDark
                                    ? 'bg-green-600 border-green-400 shadow-green-500/20'
                                    : 'bg-white border-green-500 shadow-sm text-gray-900'}`}>
                                <div className={`flex-1 flex items-center justify-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>10</div>
                                <div className={`w-1/3 border-l flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-green-400 bg-green-800/50 text-green-300'
                                        : 'border-green-200 bg-green-50 text-green-600'}`}>next</div>
                            </div>
                            {/* Anchor point for start of return arrow */}
                            <div className="absolute left-1/2 bottom-0 translate-y-full"></div>
                        </div>

                        {/* Arrow */}
                        <div className="text-gray-400">→</div>

                        {/* Node 2 */}
                        <div className="flex items-center">
                            <div className={`w-24 h-16 rounded-lg flex border-2 shadow-lg z-10 relative
                                ${isDark
                                    ? 'bg-green-600 border-green-400 shadow-green-500/20'
                                    : 'bg-white border-green-500 shadow-sm text-gray-900'}`}>
                                <div className={`flex-1 flex items-center justify-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>20</div>
                                <div className={`w-1/3 border-l flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-green-400 bg-green-800/50 text-green-300'
                                        : 'border-green-200 bg-green-50 text-green-600'}`}>next</div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="text-gray-400">→</div>

                        {/* Node 3 */}
                        <div className="flex items-center relative">
                            <div className={`w-24 h-16 rounded-lg flex border-2 shadow-lg z-10 relative
                                ${isDark
                                    ? 'bg-green-600 border-green-400 shadow-green-500/20'
                                    : 'bg-white border-green-500 shadow-sm text-gray-900'}`}>
                                <div className={`flex-1 flex items-center justify-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>30</div>
                                <div className={`w-1/3 border-l flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-green-400 bg-green-800/50 text-green-300'
                                        : 'border-green-200 bg-green-50 text-green-600'}`}>next</div>
                            </div>
                        </div>

                        {/* Return Arrow SVG - Moved inside relative container */}
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <marker id="arrow-return-green" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                    <path d="M0,0 L10,5 L0,10 Z" fill={isDark ? "#4ade80" : "#16a34a"} />
                                </marker>
                            </defs>
                            <path
                                d="M 285 70 Q 170 120, 55 75"
                                fill="none"
                                stroke={isDark ? "#4ade80" : "#16a34a"}
                                strokeWidth="2"
                                strokeDasharray="6,4"
                                markerEnd="url(#arrow-return-green)"
                                transform="translate(130, 0)"
                            />
                        </svg>
                    </div>

                    <div className="text-xs text-green-400 mt-2 text-center relative z-10">Last node points back to first node</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                    <div className={`p-4 rounded-lg flex flex-col justify-center ${isDark ? 'bg-gray-800' : 'bg-green-50 border border-green-100'}`}>
                        <h4 className="text-green-500 font-bold mb-2">✅ Pros</h4>
                        <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <li>• No NULL pointers</li>
                            <li>• Endless traversal</li>
                            <li>• Perfect for Round-Robin</li>
                        </ul>
                    </div>
                    <div className={`p-4 rounded-lg flex flex-col justify-center ${isDark ? 'bg-gray-800' : 'bg-red-50 border border-red-100'}`}>
                        <h4 className="text-red-500 font-bold mb-2">❌ Cons</h4>
                        <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <li>• Risk of infinite loops</li>
                            <li>• Complex insertion/deletion</li>
                        </ul>
                    </div>
                </div>

                <button
                    onClick={onStartLearning}
                    className="mt-8 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-600/30 transition-all transform hover:scale-105 active:scale-95"
                >
                    Initialize Memory Space 🚀
                </button>
            </div>
        </div>
    );
}
