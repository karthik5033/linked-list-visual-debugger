'use client';

import { useTheme } from '@/app/context/ThemeContext';

export default function SinglyConcept({ onStartLearning }) {
    const { isDark } = useTheme();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in-up">
            <div className={`p-8 rounded-3xl border shadow-2xl max-w-4xl transition-colors duration-500
                ${isDark
                    ? 'bg-blue-900/20 border-blue-500/30'
                    : 'bg-white border-blue-200 shadow-blue-100'}`}>
                <div className="text-6xl mb-6 text-blue-500">→</div>
                <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Singly Linked List</h2>
                <p className={`text-xl mb-8 leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    A linked list where each node points to its
                    <span className="text-blue-500 font-bold mx-1">Next</span>
                    node. This allows for efficient insertions at the head but only forward traversal.
                </p>

                {/* Visual Diagram */}
                <div className={`p-8 rounded-xl border mb-8 overflow-x-auto transition-colors
                    ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-center gap-4 min-w-max font-mono text-sm">

                        {/* Node 1 */}
                        <div className="flex items-center">
                            <div className={`w-24 h-16 rounded-lg flex border-2 shadow-lg z-10 relative
                                ${isDark
                                    ? 'bg-blue-600 border-blue-400 shadow-blue-500/20'
                                    : 'bg-white border-blue-500 shadow-sm text-gray-900'}`}>
                                <div className={`flex-1 flex items-center justify-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>10</div>
                                <div className={`w-1/3 border-l flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-blue-400 bg-blue-800/50 text-blue-300'
                                        : 'border-blue-200 bg-blue-50 text-blue-600'}`}>next</div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="text-gray-400">→</div>

                        {/* Node 2 */}
                        <div className="flex items-center">
                            <div className={`w-24 h-16 rounded-lg flex border-2 shadow-lg z-10 relative
                                ${isDark
                                    ? 'bg-blue-600 border-blue-400 shadow-blue-500/20'
                                    : 'bg-white border-blue-500 shadow-sm text-gray-900'}`}>
                                <div className={`flex-1 flex items-center justify-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>20</div>
                                <div className={`w-1/3 border-l flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-blue-400 bg-blue-800/50 text-blue-300'
                                        : 'border-blue-200 bg-blue-50 text-blue-600'}`}>next</div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="text-gray-400">→</div>

                        {/* Node 3 */}
                        <div className="flex items-center">
                            <div className={`w-24 h-16 rounded-lg flex border-2 shadow-lg z-10 relative
                                ${isDark
                                    ? 'bg-blue-600 border-blue-400 shadow-blue-500/20'
                                    : 'bg-white border-blue-500 shadow-sm text-gray-900'}`}>
                                <div className={`flex-1 flex items-center justify-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>30</div>
                                <div className={`w-1/3 border-l flex items-center justify-center text-[10px]
                                    ${isDark
                                        ? 'border-blue-400 bg-blue-800/50 text-blue-300'
                                        : 'border-blue-200 bg-blue-50 text-blue-600'}`}>next</div>
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
                            <li>• Dynamic size</li>
                            <li>• O(1) insertion at head</li>
                            <li>• Simple implementation</li>
                        </ul>
                    </div>
                    <div className={`p-4 rounded-lg flex flex-col justify-center ${isDark ? 'bg-gray-800' : 'bg-red-50 border border-red-100'}`}>
                        <h4 className="text-red-500 font-bold mb-2">❌ Cons</h4>
                        <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <li>• No random access</li>
                            <li>• Forward traversal only</li>
                        </ul>
                    </div>
                </div>

                <button
                    onClick={onStartLearning}
                    className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105 active:scale-95"
                >
                    Initialize Memory Space 🚀
                </button>
            </div>
        </div>
    );
}
