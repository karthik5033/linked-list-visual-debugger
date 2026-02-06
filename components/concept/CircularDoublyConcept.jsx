'use client';

import { useTheme } from '@/app/context/ThemeContext';

export default function CircularDoublyConcept({ onStartLearning }) {
    const { isDark } = useTheme();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in-up">
            <div className={`p-8 rounded-3xl border shadow-2xl max-w-4xl transition-colors duration-500
                ${isDark
                    ? 'bg-orange-900/20 border-orange-500/30'
                    : 'bg-white border-orange-200 shadow-orange-100'}`}>
                <div className="text-6xl mb-6 text-orange-500">↻⇄</div>
                <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Circular Doubly Linked List</h2>
                <p className={`text-xl mb-8 leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    A linked list where nodes have both
                    <span className="text-orange-500 font-bold mx-1">Next</span>
                    and
                    <span className="text-pink-500 font-bold mx-1">Previous</span>
                    pointers, and the list forms a complete circle. Best of both worlds!
                </p>

                {/* Visual Diagram */}
                <div className={`p-8 rounded-xl border mb-8 overflow-x-auto relative transition-colors
                    ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-center gap-4 min-w-max font-mono text-sm relative z-10 pb-8 pt-4">

                        {/* Node 1 */}
                        <div className="flex items-center relative">
                            <div className={`w-24 h-16 rounded-lg flex border-2 shadow-lg z-10 relative
                                ${isDark
                                    ? 'bg-orange-600 border-orange-400 shadow-orange-500/20'
                                    : 'bg-white border-orange-500 shadow-sm text-gray-900'}`}>
                                <div className={`w-1/3 border-r flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-orange-400 bg-orange-800/50 text-pink-300'
                                        : 'border-orange-200 bg-orange-50 text-pink-600'}`}>prev</div>
                                <div className={`flex-1 flex items-center justify-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>10</div>
                                <div className={`w-1/3 border-l flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-orange-400 bg-orange-800/50 text-blue-300'
                                        : 'border-orange-200 bg-orange-50 text-blue-600'}`}>next</div>
                            </div>
                        </div>

                        {/* Arrows */}
                        <div className="flex flex-col gap-1 text-gray-400">
                            <span>→</span>
                            <span>←</span>
                        </div>

                        {/* Node 2 */}
                        <div className="flex items-center">
                            <div className={`w-24 h-16 rounded-lg flex border-2 shadow-lg z-10 relative
                                ${isDark
                                    ? 'bg-orange-600 border-orange-400 shadow-orange-500/20'
                                    : 'bg-white border-orange-500 shadow-sm text-gray-900'}`}>
                                <div className={`w-1/3 border-r flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-orange-400 bg-orange-800/50 text-pink-300'
                                        : 'border-orange-200 bg-orange-50 text-pink-600'}`}>prev</div>
                                <div className={`flex-1 flex items-center justify-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>20</div>
                                <div className={`w-1/3 border-l flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-orange-400 bg-orange-800/50 text-blue-300'
                                        : 'border-orange-200 bg-orange-50 text-blue-600'}`}>next</div>
                            </div>
                        </div>

                        {/* Arrows */}
                        <div className="flex flex-col gap-1 text-gray-400">
                            <span>→</span>
                            <span>←</span>
                        </div>

                        {/* Node 3 */}
                        <div className="flex items-center relative">
                            <div className={`w-24 h-16 rounded-lg flex border-2 shadow-lg z-10 relative
                                ${isDark
                                    ? 'bg-orange-600 border-orange-400 shadow-orange-500/20'
                                    : 'bg-white border-orange-500 shadow-sm text-gray-900'}`}>
                                <div className={`w-1/3 border-r flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-orange-400 bg-orange-800/50 text-pink-300'
                                        : 'border-orange-200 bg-orange-50 text-pink-600'}`}>prev</div>
                                <div className={`flex-1 flex items-center justify-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>30</div>
                                <div className={`w-1/3 border-l flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-orange-400 bg-orange-800/50 text-blue-300'
                                        : 'border-orange-200 bg-orange-50 text-blue-600'}`}>next</div>
                            </div>
                        </div>

                        {/* Circular Arrows SVG - Moved inside relative container */}
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <marker id="arrow-return-orange" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                    <path d="M0,0 L10,5 L0,10 Z" fill={isDark ? "#fb923c" : "#ea580c"} />
                                </marker>
                                <marker id="arrow-return-pink" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                    <path d="M0,0 L10,5 L0,10 Z" fill={isDark ? "#f472b6" : "#db2777"} />
                                </marker>
                            </defs>

                            {/* Top Arc: Head (prev) -> Tail */}
                            <path
                                d="M 55 25 Q 170 -40, 285 30"
                                fill="none"
                                stroke={isDark ? "#f472b6" : "#db2777"}
                                strokeWidth="2"
                                strokeDasharray="6,4"
                                markerEnd="url(#arrow-return-pink)"
                                transform="translate(130, -15)"
                            />

                            {/* Bottom Arc: Tail (next) -> Head */}
                            <path
                                d="M 285 70 Q 170 140, 55 75"
                                fill="none"
                                stroke={isDark ? "#fb923c" : "#ea580c"}
                                strokeWidth="2"
                                strokeDasharray="6,4"
                                markerEnd="url(#arrow-return-orange)"
                                transform="translate(130, 15)"
                            />
                        </svg>
                    </div>

                    <div className="text-xs text-orange-400 mt-2 text-center relative z-10">Bidirectional Circular Connections</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                    <div className={`p-4 rounded-lg flex flex-col justify-center ${isDark ? 'bg-gray-800' : 'bg-green-50 border border-green-100'}`}>
                        <h4 className="text-green-500 font-bold mb-2">✅ Pros</h4>
                        <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <li>• Traverse any direction</li>
                            <li>• Continuous looping</li>
                            <li>• Efficient music players etc</li>
                        </ul>
                    </div>
                    <div className={`p-4 rounded-lg flex flex-col justify-center ${isDark ? 'bg-gray-800' : 'bg-red-50 border border-red-100'}`}>
                        <h4 className="text-red-500 font-bold mb-2">❌ Cons</h4>
                        <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <li>• Complex implementation</li>
                            <li>• High memory overhead</li>
                        </ul>
                    </div>
                </div>

                <button
                    onClick={onStartLearning}
                    className="mt-8 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-600/30 transition-all transform hover:scale-105 active:scale-95"
                >
                    Initialize Memory Space 🚀
                </button>
            </div>
        </div>
    );
}
