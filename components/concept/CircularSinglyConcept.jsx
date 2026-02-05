'use client';

export default function CircularSinglyConcept({ onStartLearning }) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in-up">
            <div className="bg-green-900/20 p-8 rounded-3xl border border-green-500/30 shadow-2xl max-w-4xl">
                <div className="text-6xl mb-6">↻</div>
                <h2 className="text-4xl font-bold text-white mb-4">Circular Singly Linked List</h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                    A linked list where the
                    <span className="text-green-400 font-bold mx-1">last node points back to the head</span>
                    instead of NULL. This forms a continuous circle, perfect for Round-Robin scheduling.
                </p>

                {/* Visual Diagram */}
                <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700 mb-8 overflow-x-auto relative">
                    <div className="flex items-center justify-center gap-4 min-w-max font-mono text-sm relative z-10 pb-8">

                        {/* Node 1 */}
                        <div className="flex items-center relative">
                            <div className="w-24 h-16 bg-green-600 rounded-lg flex border-2 border-green-400 shadow-lg shadow-green-500/20 z-10 relative">
                                <div className="flex-1 flex items-center justify-center font-bold text-white">10</div>
                                <div className="w-1/3 border-l border-green-400 bg-green-800/50 flex items-center justify-center text-[10px] text-green-300">next</div>
                            </div>
                            {/* Anchor point for start of return arrow */}
                            <div className="absolute left-1/2 bottom-0 translate-y-full"></div>
                        </div>

                        {/* Arrow */}
                        <div className="text-gray-400">→</div>

                        {/* Node 2 */}
                        <div className="flex items-center">
                            <div className="w-24 h-16 bg-green-600 rounded-lg flex border-2 border-green-400 shadow-lg shadow-green-500/20 z-10 relative">
                                <div className="flex-1 flex items-center justify-center font-bold text-white">20</div>
                                <div className="w-1/3 border-l border-green-400 bg-green-800/50 flex items-center justify-center text-[10px] text-green-300">next</div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="text-gray-400">→</div>

                        {/* Node 3 */}
                        <div className="flex items-center relative">
                            <div className="w-24 h-16 bg-green-600 rounded-lg flex border-2 border-green-400 shadow-lg shadow-green-500/20 z-10 relative">
                                <div className="flex-1 flex items-center justify-center font-bold text-white">30</div>
                                <div className="w-1/3 border-l border-green-400 bg-green-800/50 flex items-center justify-center text-[10px] text-green-300">next</div>
                            </div>
                        </div>
                    </div>

                    {/* Return Arrow SVG - Positioned absolutely to connect last node to first */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <marker id="arrow-return-green" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="#4ade80" />
                            </marker>
                        </defs>
                        {/* 
                           Approximate path based on flex layout:
                           Node 1 center-x approx: 50% - 150px
                           Node 3 center-x approx: 50% + 150px
                           (Assuming center alignment and gap)
                           We'll use percentage based curve for responsiveness or hardcoded width if the container is tight.
                           Better approach: Since it's min-w-max centered, we can guess coordinates or just use a wide curve.
                           Let's try a path that spans deeply.
                        */}
                        <path
                            d="M 285 70 Q 170 140, 55 75"
                            fill="none"
                            stroke="#4ade80"
                            strokeWidth="2"
                            strokeDasharray="6,4"
                            markerEnd="url(#arrow-return-green)"
                            transform="translate(15, 0)"
                        />
                        {/* Note: The coordinates above are estimates based on standard rendering (96px + 16px + 20px...). 
                             Center to Center approx distance is ~300px.
                             We can adjust via transform if needed.
                         */}
                    </svg>

                    <div className="text-xs text-green-400 mt-2 text-center relative z-10">Last node points back to first node</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-green-400 font-bold mb-2">✅ Pros</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li>• No NULL pointers</li>
                            <li>• Endless traversal</li>
                            <li>• Perfect for Round-Robin</li>
                        </ul>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-red-400 font-bold mb-2">❌ Cons</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
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
