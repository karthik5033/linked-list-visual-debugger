'use client';

export default function CircularDoublyConcept({ onStartLearning }) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in-up">
            <div className="bg-orange-900/20 p-8 rounded-3xl border border-orange-500/30 shadow-2xl max-w-4xl">
                <div className="text-6xl mb-6">⟲</div>
                <h2 className="text-4xl font-bold text-white mb-4">Circular Doubly Linked List</h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                    The most complex linked structure. Each node has
                    <span className="text-pink-400 font-bold mx-1">Previous</span>
                    and
                    <span className="text-orange-400 font-bold mx-1">Next</span>
                    pointers, and the list forms a closed loop in both directions.
                </p>

                {/* Visual Diagram */}
                <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700 mb-8 overflow-x-auto relative">
                    <div className="flex items-center justify-center gap-4 min-w-max font-mono text-sm relative z-10 pb-8">

                        {/* Node 1 */}
                        <div className="flex items-center relative">
                            <div className="w-24 h-16 bg-orange-600 rounded-lg flex border-2 border-orange-400 shadow-lg shadow-orange-500/20 z-10 relative">
                                <div className="w-1/3 border-r border-orange-400 bg-orange-800/50 flex items-center justify-center text-[10px] text-pink-300">prev</div>
                                <div className="flex-1 flex items-center justify-center font-bold text-white">10</div>
                                <div className="w-1/3 border-l border-orange-400 bg-orange-800/50 flex items-center justify-center text-[10px] text-orange-300">next</div>
                            </div>
                        </div>

                        {/* Arrows */}
                        <div className="flex flex-col gap-1 text-gray-400">
                            <span>→</span>
                            <span>←</span>
                        </div>

                        {/* Node 2 */}
                        <div className="flex items-center">
                            <div className="w-24 h-16 bg-orange-600 rounded-lg flex border-2 border-orange-400 shadow-lg shadow-orange-500/20 z-10 relative">
                                <div className="w-1/3 border-r border-orange-400 bg-orange-800/50 flex items-center justify-center text-[10px] text-pink-300">prev</div>
                                <div className="flex-1 flex items-center justify-center font-bold text-white">20</div>
                                <div className="w-1/3 border-l border-orange-400 bg-orange-800/50 flex items-center justify-center text-[10px] text-orange-300">next</div>
                            </div>
                        </div>

                        {/* Arrows */}
                        <div className="flex flex-col gap-1 text-gray-400">
                            <span>→</span>
                            <span>←</span>
                        </div>

                        {/* Node 3 */}
                        <div className="flex items-center relative">
                            <div className="w-24 h-16 bg-orange-600 rounded-lg flex border-2 border-orange-400 shadow-lg shadow-orange-500/20 z-10 relative">
                                <div className="w-1/3 border-r border-orange-400 bg-orange-800/50 flex items-center justify-center text-[10px] text-pink-300">prev</div>
                                <div className="flex-1 flex items-center justify-center font-bold text-white">30</div>
                                <div className="w-1/3 border-l border-orange-400 bg-orange-800/50 flex items-center justify-center text-[10px] text-orange-300">next</div>
                            </div>
                        </div>
                    </div>

                    {/* Return Arrow SVG */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <marker id="arrow-return-orange" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="#fb923c" />
                            </marker>
                            <marker id="arrow-return-pink" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="#f472b6" />
                            </marker>
                        </defs>

                        {/* Bi-directional curve to represent full loop */}
                        <path
                            d="M 285 70 Q 170 140, 55 75"
                            fill="none"
                            stroke="#fb923c"
                            strokeWidth="2"
                            strokeDasharray="6,4"
                            markerEnd="url(#arrow-return-orange)"
                            markerStart="url(#arrow-return-pink)"
                            transform="translate(15, 0)"
                        />
                    </svg>

                    <div className="text-xs text-orange-400 mt-2 text-center relative z-10">Bidirectional circular connection</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-green-400 font-bold mb-2">✅ Pros</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li>• Bidirectional circular traversal</li>
                            <li>• O(1) insert/delete at head/tail</li>
                            <li>• Used in Fibonacci Heaps</li>
                        </ul>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-red-400 font-bold mb-2">❌ Cons</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li>• Most pointer overhead</li>
                            <li>• Complex pointer maintenance</li>
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
