'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import MemoryBackground from './components/MemoryBackground';

// --- Icons ---
const Icons = {
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>,
  Zap: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  Cpu: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>,
  Box: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>,
  GitMerge: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9a9 9 0 019 9"/></svg>,
  Activity: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Database: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4"/></svg>
};

const StatusBar = () => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 1 }}
    className="fixed bottom-0 left-0 right-0 h-8 bg-[#0a0a0a] border-t border-white/5 flex items-center px-4 justify-between text-xs font-mono text-gray-600 z-50 select-none backdrop-blur-sm"
  >
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-blue-500 font-bold">READY</span>
      </div>
      <span className="hidden md:inline">main*</span>
      <span className="hidden md:inline">0 errors</span>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-gray-500">Memory.cpp</span>
      <span className="text-blue-500">UTF-8</span>
    </div>
  </motion.div>
);

const BentoCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + (index * 0.05) }}
    className="relative group h-full"
  >
    <Link href={item.href} className="block h-full">
      <div className="h-full bg-[#080808] border border-white/5 rounded-lg p-6 hover:border-blue-500/30 transition-all duration-300 hover:bg-[#0c0c0c] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.1)] flex flex-col justify-between">
        
        <div>
           <div className="flex items-center justify-between mb-4">
             <div className="w-12 h-12 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
               {item.icon}
             </div>
             <span className="text-xs text-gray-600 font-mono uppercase tracking-wider border border-white/5 px-2 py-1 rounded">
               {item.meta}
             </span>
           </div>
           
           <h3 className="text-2xl font-bold text-gray-200 mb-2 group-hover:text-blue-400 transition-colors">
             {item.title}
           </h3>
           
           <p className="text-base text-gray-500 leading-relaxed mb-4">
             {item.description}
           </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5">
           <div className="bg-black/50 rounded p-3 font-mono text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors">
             <span className="text-purple-400">struct</span> Point {'{'} {item.code} {'}'}
           </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const ComplexityRow = ({ name, access, search, insert, remove }) => (
  <div className="grid grid-cols-5 py-4 border-b border-white/5 text-sm hover:bg-white/5 transition-colors px-4">
    <div className="font-medium text-gray-200">{name}</div>
    <div className={`font-mono ${access === 'O(1)' ? 'text-green-400' : 'text-yellow-500'}`}>{access}</div>
    <div className={`font-mono ${search === 'O(1)' ? 'text-green-400' : 'text-yellow-500'}`}>{search}</div>
    <div className={`font-mono ${insert === 'O(1)' ? 'text-green-400' : 'text-yellow-500'}`}>{insert}</div>
    <div className={`font-mono ${remove === 'O(1)' ? 'text-green-400' : 'text-yellow-500'}`}>{remove}</div>
  </div>
);

const StatBox = ({ value, label }) => (
  <div className="p-6 border border-white/5 rounded-lg bg-[#0a0a0a] text-center">
    <div className="text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{value}</div>
    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">{label}</div>
  </div>
);

export default function Home() {
  const linkedLists = [
    {
      title: 'Singly List',
      description: 'The fundamental unidirectional structure. Master head/tail insertions.',
      icon: <Icons.ArrowRight />,
      meta: 'v1.0',
      href: '/linked-list/singly',
      code: 'Node* next;'
    },
    {
      title: 'Doubly List',
      description: 'Navigate both ways with prev/next pointers. Essential for history stacks.',
      icon: <Icons.GitMerge />,
      meta: 'v1.2',
      href: '/linked-list/doubly',
      code: 'Node* prev; Node* next;'
    },
    {
      title: 'Circular Singly',
      description: 'Ring topology for round-robin scheduling and endless loops.',
      icon: <Icons.Zap />,
      meta: 'v2.0',
      href: '/linked-list/circular-singly',
      code: 'tail->next = head;'
    },
    {
      title: 'Circular Doubly',
      description: 'Complex bidirectional cycle. The ultimate test of pointer logic.',
      icon: <Icons.Box />,
      meta: 'v2.1',
      href: '/linked-list/circular-doubly',
      code: 'head->prev = tail;'
    }
  ];

  return (
    <div className="min-h-screen font-sans text-gray-200">
      <MemoryBackground />
      <StatusBar />

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-32">
        
        {/* --- Hero Section --- */}
        <section className="mb-24 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
             <span className="px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-sm font-mono tracking-wide">
               SYSTEM_ONLINE :: v2.4.0
             </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white via-white to-gray-600 bg-clip-text text-transparent max-w-5xl">
            Visualize Memory. 
            <br />
            <span className="text-gray-600">Master the Heap.</span>
          </h1>

          <p className="max-w-2xl text-gray-400 text-xl mb-12 leading-relaxed">
            A professional lightweight debugger for visualizing <span className="text-blue-400">Linked Lists</span>. 
            Trace allocations, watch pointers rewire, and understand true memory management.
          </p>

          <div className="flex gap-4">
             <button className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors text-base">
               Get Started
             </button>
             <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-medium rounded hover:bg-white/10 transition-colors text-base font-mono">
               npm install dsa-viz
             </button>
          </div>
        </section>


        {/* --- Stats Grid (New Content) --- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
           <StatBox value="60 FPS" label="Rendering" />
           <StatBox value="< 1ms" label="Latency" />
           <StatBox value="Zero" label="Dependencies" />
           <StatBox value="100%" label="Open Source" />
        </section>


        {/* --- Bento Grid --- */}
        <section className="mb-32">
           <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <span className="w-1.5 h-8 bg-blue-500 rounded-sm"></span>
               Data Structures
             </h2>
             <span className="text-sm font-mono text-gray-600">INDEX: 0x01 - 0x05</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {linkedLists.map((item, i) => (
                <BentoCard key={i} item={item} index={i} />
              ))}
           </div>
        </section>


        {/* --- Specs Table (New Content) --- */}
        <section className="mb-32">
           <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <span className="w-1.5 h-8 bg-blue-500 rounded-sm"></span>
               Tech Specs
             </h2>
             <span className="text-sm font-mono text-gray-600">perf_analysis.log</span>
           </div>

           <div className="border border-white/5 rounded-lg bg-[#080808] overflow-hidden">
             <div className="grid grid-cols-5 py-4 border-b border-white/10 bg-white/5 text-xs font-mono uppercase text-gray-400 px-4">
               <div>Structure</div>
               <div>Access</div>
               <div>Search</div>
               <div>Insert</div>
               <div>Delete</div>
             </div>
             
             <ComplexityRow name="Singly Linked List" access="O(n)" search="O(n)" insert="O(1)" remove="O(1)" />
             <ComplexityRow name="Doubly Linked List" access="O(n)" search="O(n)" insert="O(1)" remove="O(1)" />
             <ComplexityRow name="Circular List" access="O(n)" search="O(n)" insert="O(1)" remove="O(1)" />
             <ComplexityRow name="Array (Ref)" access="O(1)" search="O(n)" insert="O(n)" remove="O(n)" />
           </div>
        </section>


        {/* --- Features Grid --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 border-t border-white/5 pt-16">
           <div className="p-6">
             <div className="text-blue-500 mb-6"><Icons.Cpu /></div>
             <h3 className="text-white text-xl font-bold mb-3">Real-time Heap View</h3>
             <p className="text-base text-gray-500 leading-relaxed">
               Watch as `malloc()` reserves specific blocks in our simulated heap memory. See the addresses change live.
             </p>
           </div>
           
           <div className="p-6">
             <div className="text-blue-500 mb-6"><Icons.Zap /></div>
             <h3 className="text-white text-xl font-bold mb-3">Pointer Arithmetic</h3>
             <p className="text-base text-gray-500 leading-relaxed">
               Understand `next` and `prev` pointers not as arrows, but as memory addresses storing locations.
             </p>
           </div>

           <div className="p-6">
             <div className="text-blue-500 mb-6"><Icons.Database /></div>
             <h3 className="text-white text-xl font-bold mb-3">State Management</h3>
             <p className="text-base text-gray-500 leading-relaxed">
               Global state ensures your data structures persist across route changes, just like a real database.
             </p>
           </div>
        </section>


        {/* --- Terminal CTA --- */}
        <section className="relative rounded-2xl border border-white/10 bg-[#0c0c0c] overflow-hidden">
           <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
             <div className="ml-4 text-[10px] font-mono text-gray-500">term -- zsh</div>
           </div>

           <div className="p-8 pt-16 font-mono text-sm md:text-base text-gray-400">
             <p>$ <span className="text-blue-400">init</span> engine --verbose</p>
             <p className="text-gray-600 mt-2">Loading core modules...</p>
             <p className="text-gray-600">Initializing heap memory (1024MB)...</p>
             <p className="text-green-500 mt-2">Success! Visualizer ready.</p>
             <p className="mt-4 animate-pulse">_</p>
           </div>
        </section>

      </main>
    </div>
  );
}
