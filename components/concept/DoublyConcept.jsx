'use client';

export default function DoublyConcept({ onStartLearning }) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in-up">
            <div className="bg-purple-900/20 p-8 rounded-3xl border border-purple-500/30 shadow-2xl max-w-4xl">
                <div className="text-6xl mb-6">⇄</div>
                <h2 className="text-4xl font-bold text-white mb-4">Doubly Linked List</h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                    A linked list where each node points to both its
                    <span className="text-purple-400 font-bold mx-1">Next</span>
                    node and its
                    <span className="text-pink-400 font-bold mx-1">Previous</span>
                    node. This allows for bidirectional traversal but requires more memory for the extra pointer.
                </p>

                {/* Visual Diagram */}
                <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700 mb-8 overflow-x-auto">
                    <div className="flex items-center justify-center gap-4 min-w-max font-mono text-sm">

                        {/* Null Prev */}
                        <div className="flex flex-col items-center opacity-50">
                            <div className="w-12 h-12 border-2 border-dashed border-gray-600 rounded flex items-center justify-center">
                                NULL
                            </div>
                        </div>
                        <div className="text-gray-500">←</div>

                        {/* Node 1 */}
                        <div className="flex items-center">
                            <div className="w-24 h-16 bg-purple-600 rounded-lg flex border-2 border-purple-400 shadow-lg shadow-purple-500/20">
                                <div className="w-1/3 border-r border-purple-400 bg-purple-800/50 flex items-center justify-center text-[10px] text-pink-300">prev</div>
                                <div className="flex-1 flex items-center justify-center font-bold text-white">10</div>
                                <div className="w-1/3 border-l border-purple-400 bg-purple-800/50 flex items-center justify-center text-[10px] text-blue-300">next</div>
                            </div>
                        </div>

                        {/* Arrows */}
                        <div className="flex flex-col gap-1 text-gray-400">
                            <span>→</span>
                            <span>←</span>
                        </div>

                        {/* Node 2 */}
                        <div className="flex items-center">
                            <div className="w-24 h-16 bg-purple-600 rounded-lg flex border-2 border-purple-400 shadow-lg shadow-purple-500/20">
                                <div className="w-1/3 border-r border-purple-400 bg-purple-800/50 flex items-center justify-center text-[10px] text-pink-300">prev</div>
                                <div className="flex-1 flex items-center justify-center font-bold text-white">20</div>
                                <div className="w-1/3 border-l border-purple-400 bg-purple-800/50 flex items-center justify-center text-[10px] text-blue-300">next</div>
                            </div>
                        </div>

                        {/* Arrows */}
                        <div className="flex flex-col gap-1 text-gray-400">
                            <span>→</span>
                            <span>←</span>
                        </div>

                        {/* Node 3 */}
                        <div className="flex items-center">
                            <div className="w-24 h-16 bg-purple-600 rounded-lg flex border-2 border-purple-400 shadow-lg shadow-purple-500/20">
                                <div className="w-1/3 border-r border-purple-400 bg-purple-800/50 flex items-center justify-center text-[10px] text-pink-300">prev</div>
                                <div className="flex-1 flex items-center justify-center font-bold text-white">30</div>
                                <div className="w-1/3 border-l border-purple-400 bg-purple-800/50 flex items-center justify-center text-[10px] text-blue-300">next</div>
                            </div>
                        </div>

                        <div className="text-gray-500">→</div>
                        {/* Null Next */}
                        <div className="flex flex-col items-center opacity-50">
                            <div className="w-12 h-12 border-2 border-dashed border-gray-600 rounded flex items-center justify-center">
                                NULL
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-green-400 font-bold mb-2">✅ Pros</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li>• Traverse in both directions</li>
                            <li>• Easier to delete a node (given pointer)</li>
                            <li>• Perfect for history buttons, undos</li>
                        </ul>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-red-400 font-bold mb-2">❌ Cons</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li>• Uses more memory (extra pointer)</li>
                            <li>• More pointers to update on insert/delete</li>
                        </ul>
                    </div>
                </div>

                <button
                    onClick={onStartLearning}
                    className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-600/30 transition-all transform hover:scale-105 active:scale-95"
                >
                    Initialize Memory Space 🚀
                </button>
            </div>
        </div>
    );
}
