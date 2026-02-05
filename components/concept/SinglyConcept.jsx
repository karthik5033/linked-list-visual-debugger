'use client';

import { motion } from 'framer-motion';

const TechCard = ({ title, children, className = "" }) => (
    <div className={`bg-[#050505] border border-white/10 rounded-sm p-6 ${className}`}>
        <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
            {title}
        </h3>
        {children}
    </div>
);

const SpecRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-white/5 font-mono text-sm last:border-0">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-200">{value}</span>
    </div>
);

export default function SinglyConcept({ onStartLearning }) {
    return (
        <div className="h-full max-w-6xl mx-auto p-6 flex flex-col justify-center">
            
            {/* Header / Meta */}
            <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
                <div>
                   <div className="text-blue-500 font-mono text-xs mb-2 tracking-wide">DOCS :: STRUCTURES :: 0x01</div>
                   <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                       Singly Linked List
                   </h2>
                </div>
                <div className="hidden md:block text-right font-mono text-xs text-gray-500">
                    <div>LAST_UPDATE: 2024-10-24</div>
                    <div>AUTHOR: SYSTEM</div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                
                {/* Main Description */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                    <p className="text-xl text-gray-400 font-light leading-relaxed">
                        A fundamental data structure consisting of a sequence of nodes, where each node contains 
                        explicit reference (pointer) to the next node in the sequence. Memory allocation is non-contiguous.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TechCard title="Advantages">
                            <ul className="space-y-3 text-sm text-gray-300 font-mono">
                                <li className="flex gap-3">
                                    <span className="text-green-500">[+]</span>
                                    <span>Dynamic Memory Allocation</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-green-500">[+]</span>
                                    <span>Constant Time O(1) Insertion (Head)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-green-500">[+]</span>
                                    <span>Efficient Stack Implementation</span>
                                </li>
                            </ul>
                        </TechCard>

                        <TechCard title="Limitations">
                            <ul className="space-y-3 text-sm text-gray-300 font-mono">
                                <li className="flex gap-3">
                                    <span className="text-red-500">[-]</span>
                                    <span>No Random Access (Index i)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-red-500">[-]</span>
                                    <span>Uni-directional Navigation</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-red-500">[-]</span>
                                    <span>Extra Memory (Pointer Overhead)</span>
                                </li>
                            </ul>
                        </TechCard>
                    </div>

                     <div className="mt-4">
                        <button
                            onClick={onStartLearning}
                            className="bg-white text-black px-6 py-3 font-bold text-sm hover:bg-gray-200 transition-colors rounded-sm flex items-center gap-2"
                        >
                            <span>INITIALIZE_VISUALIZER</span>
                            <span>→</span>
                        </button>
                    </div>
                </div>

                {/* Sidebar Specs */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                    <TechCard title="Technical Specifications">
                        <div className="flex flex-col">
                            <SpecRow label="Type" value="Linear, Dynamic" />
                            <SpecRow label="Direction" value="Uni-directional" />
                            <SpecRow label="Memory" value="Non-contiguous" />
                            <SpecRow label="Overhead" value="4-8 bytes / node" />
                        </div>
                    </TechCard>

                    <TechCard title="Complexity Analysis">
                        <div className="flex flex-col">
                            <SpecRow label="Access" value="O(n)" />
                            <SpecRow label="Search" value="O(n)" />
                            <SpecRow label="Insert (Head)" value="O(1)" />
                            <SpecRow label="Insert (Tail)" value="O(n)*" />
                            <SpecRow label="Delete" value="O(n)" />
                        </div>
                        <div className="mt-2 text-[10px] text-gray-600 font-mono">* O(1) if tail pointer maintained</div>
                    </TechCard>
                </div>
            </div>
        </div>
    );
}
