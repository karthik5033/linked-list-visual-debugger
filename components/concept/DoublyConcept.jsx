'use client';

import { useTheme } from '@/app/context/ThemeContext';

export default function DoublyConcept({ onStartLearning }) {
    const { isDark } = useTheme();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in-up">
            <div className={`p-8 rounded-3xl border shadow-2xl max-w-4xl transition-colors duration-500
                ${isDark
                    ? 'bg-purple-900/20 border-purple-500/30'
                    : 'bg-white border-purple-200 shadow-purple-100'}`}>
                <div className="text-6xl mb-6 text-purple-500">⇄</div>
                <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Doubly Linked List</h2>
                <p className={`text-xl mb-8 leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    A linked list where each node points to both its
                    <span className="text-purple-500 font-bold mx-1">Next</span>
                    node and its
                    <span className="text-pink-500 font-bold mx-1">Previous</span>
                    node. This allows for bidirectional traversal but requires more memory for the extra pointer.
                </p>

                {/* Visual Diagram */}
                <div className={`p-8 rounded-xl border mb-8 overflow-x-auto transition-colors
                    ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-center gap-4 min-w-max font-mono text-sm">

                        {/* Null Prev */}
                        <div className="flex flex-col items-center opacity-50">
                            <div className={`w-12 h-12 border-2 border-dashed rounded flex items-center justify-center
                                ${isDark ? 'border-gray-600' : 'border-gray-300 text-gray-400'}`}>
                                NULL
                            </div>
                        </div>
                        <div className="text-gray-500">←</div>

                        {/* Node 1 */}
                        <div className="flex items-center">
                            <div className={`w-24 h-16 rounded-lg flex border-2 shadow-lg z-10 relative
                                ${isDark
                                    ? 'bg-purple-600 border-purple-400 shadow-purple-500/20'
                                    : 'bg-white border-purple-500 shadow-sm text-gray-900'}`}>
                                <div className={`w-1/3 border-r flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-purple-400 bg-purple-800/50 text-pink-300'
                                        : 'border-purple-200 bg-purple-50 text-pink-600'}`}>prev</div>
                                <div className={`flex-1 flex items-center justify-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>10</div>
                                <div className={`w-1/3 border-l flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-purple-400 bg-purple-800/50 text-blue-300'
                                        : 'border-purple-200 bg-purple-50 text-blue-600'}`}>next</div>
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
                                    ? 'bg-purple-600 border-purple-400 shadow-purple-500/20'
                                    : 'bg-white border-purple-500 shadow-sm text-gray-900'}`}>
                                <div className={`w-1/3 border-r flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-purple-400 bg-purple-800/50 text-pink-300'
                                        : 'border-purple-200 bg-purple-50 text-pink-600'}`}>prev</div>
                                <div className={`flex-1 flex items-center justify-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>20</div>
                                <div className={`w-1/3 border-l flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-purple-400 bg-purple-800/50 text-blue-300'
                                        : 'border-purple-200 bg-purple-50 text-blue-600'}`}>next</div>
                            </div>
                        </div>

                        {/* Arrows */}
                        <div className="flex flex-col gap-1 text-gray-400">
                            <span>→</span>
                            <span>←</span>
                        </div>

                        {/* Node 3 */}
                        <div className="flex items-center">
                            <div className={`w-24 h-16 rounded-lg flex border-2 shadow-lg z-10 relative
                                ${isDark
                                    ? 'bg-purple-600 border-purple-400 shadow-purple-500/20'
                                    : 'bg-white border-purple-500 shadow-sm text-gray-900'}`}>
                                <div className={`w-1/3 border-r flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-purple-400 bg-purple-800/50 text-pink-300'
                                        : 'border-purple-200 bg-purple-50 text-pink-600'}`}>prev</div>
                                <div className={`flex-1 flex items-center justify-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>30</div>
                                <div className={`w-1/3 border-l flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-purple-400 bg-purple-800/50 text-blue-300'
                                        : 'border-purple-200 bg-purple-50 text-blue-600'}`}>next</div>
                            </div>
                        </div>

                        <div className="text-gray-500">→</div>
                        {/* Null Next */}
                        <div className="flex flex-col items-center opacity-50">
                            <div className={`w-12 h-12 border-2 border-dashed rounded flex items-center justify-center
                                ${isDark ? 'border-gray-600' : 'border-gray-300 text-gray-400'}`}>
                                NULL
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                    <div className={`p-4 rounded-lg flex flex-col justify-center ${isDark ? 'bg-gray-800' : 'bg-green-50 border border-green-100'}`}>
                        <h4 className="text-green-500 font-bold mb-2">✅ Pros</h4>
                        <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <li>• Traverse in both directions</li>
                            <li>• Easier to delete a node (given pointer)</li>
                            <li>• Perfect for history buttons, undos</li>
                        </ul>
                    </div>
                    <div className={`p-4 rounded-lg flex flex-col justify-center ${isDark ? 'bg-gray-800' : 'bg-red-50 border border-red-100'}`}>
                        <h4 className="text-red-500 font-bold mb-2">❌ Cons</h4>
                        <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
