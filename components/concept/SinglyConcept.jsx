'use client';

export default function SinglyConcept({ onStartLearning }) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center max-w-4xl mx-auto">
            <div className="mb-8 p-6 bg-blue-500/10 rounded-full">
                <span className="text-6xl">→</span>
            </div>

            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                What is a Singly Linked List?
            </h2>

            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                A precise sequence of nodes where each node contains data and a pointer to the next node.
                Unlike arrays, nodes are not stored contiguously in memory, allowing for efficient
                <strong className="text-blue-400"> O(1) insertions</strong> at the head.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 w-full">
                <div className="bg-[#1f2937] p-8 rounded-2xl border border-[#374151]">
                    <h3 className="text-lg font-bold mb-4 text-green-400">When to use</h3>
                    <ul className="text-left space-y-3 text-gray-300">
                        <li className="flex gap-2">✓ <span>Dynamic size requirements</span></li>
                        <li className="flex gap-2">✓ <span>Frequent insertions at the beginning</span></li>
                        <li className="flex gap-2">✓ <span>Implementing Stacks or Queues</span></li>
                    </ul>
                </div>

                <div className="bg-[#1f2937] p-8 rounded-2xl border border-[#374151]">
                    <h3 className="text-lg font-bold mb-4 text-red-400">When NOT to use</h3>
                    <ul className="text-left space-y-3 text-gray-300">
                        <li className="flex gap-2">✗ <span>Random access needed (Index i)</span></li>
                        <li className="flex gap-2">✗ <span>Memory is extremely limited (pointer overhead)</span></li>
                        <li className="flex gap-2">✗ <span>Backward traversal required</span></li>
                    </ul>
                </div>
            </div>

            <button
                onClick={onStartLearning}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 group"
            >
                Start Visualization
                <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
        </div>
    );
}
