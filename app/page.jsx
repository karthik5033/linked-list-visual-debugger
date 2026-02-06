'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import MemoryBackground from './components/MemoryBackground';
import { useTheme } from './context/ThemeContext';


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

const StatusBar = ({ isDark }) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 1 }}
    className={`fixed bottom-0 left-0 right-0 h-8 border-t flex items-center px-4 justify-between text-xs font-mono z-50 select-none backdrop-blur-sm transition-colors duration-500
      ${isDark ? 'bg-[#0a0a0a] border-white/5 text-gray-600' : 'bg-white/80 border-gray-200 text-gray-500'}`}
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
      <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Memory.cpp</span>
      <span className="text-blue-500">UTF-8</span>
    </div>
  </motion.div>
);

const BentoCard = ({ item, index, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + (index * 0.05) }}
    className="relative group h-full"
  >
    <Link href={item.href} className="block h-full">
      <div className={`h-full border rounded-lg p-6 transition-all duration-300 flex flex-col justify-between
        ${isDark 
          ? 'bg-[#080808] border-white/5 hover:border-blue-500/30 hover:bg-[#0c0c0c] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.1)]' 
          : 'bg-white border-gray-200 hover:border-blue-500/50 hover:shadow-xl shadow-sm'
        }`}>
        
        <div>
           <div className="flex items-center justify-between mb-4">
             <div className="w-12 h-12 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
               {item.icon}
             </div>
             <span className={`text-xs font-mono uppercase tracking-wider border px-2 py-1 rounded
               ${isDark ? 'text-gray-600 border-white/5' : 'text-gray-500 border-gray-200 bg-gray-50'}`}>
               {item.meta}
             </span>
           </div>
           
           <h3 className={`text-2xl font-bold mb-2 transition-colors ${isDark ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`}>
             {item.title}
           </h3>
           
           <p className={`text-base leading-relaxed mb-4 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
             {item.description}
           </p>
        </div>

        <div className={`mt-6 pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
           <div className={`rounded p-3 font-mono text-xs truncate transition-colors
             ${isDark ? 'bg-black/50 text-gray-400 group-hover:text-gray-300' : 'bg-gray-50 text-gray-500 group-hover:text-gray-700'}`}>
             <span className="text-purple-400">struct</span> Point {'{'} {item.code} {'}'}
           </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const ComplexityRow = ({ name, access, search, insert, remove, isDark }) => (
  <div className={`grid grid-cols-5 py-4 border-b text-sm transition-colors px-4
    ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
    <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{name}</div>
    <div className={`font-mono ${access === 'O(1)' ? 'text-green-400' : isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>{access}</div>
    <div className={`font-mono ${search === 'O(1)' ? 'text-green-400' : isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>{search}</div>
    <div className={`font-mono ${insert === 'O(1)' ? 'text-green-400' : isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>{insert}</div>
    <div className={`font-mono ${remove === 'O(1)' ? 'text-green-400' : isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>{remove}</div>
  </div>
);

const StatBox = ({ value, label, isDark }) => (
  <div className={`p-6 border rounded-lg text-center transition-colors duration-500
    ${isDark ? 'border-white/5 bg-[#0a0a0a]' : 'border-gray-200 bg-white shadow-sm'}`}>
    <div className={`text-3xl font-bold mb-1 transition-colors ${isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-900'}`}>{value}</div>
    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">{label}</div>
  </div>
);

export default function Home() {
  const { isDark, toggleTheme } = useTheme();

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
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDark ? 'text-gray-200 bg-[#050505]' : 'text-gray-800 bg-gray-50'}`}>
      <MemoryBackground isDark={isDark} />
      
      {/* Header with Theme Switcher */}
      <header className={`fixed top-0 left-0 right-0 z-40 px-6 py-5 flex items-center justify-between backdrop-blur-md border-b transition-colors duration-500
        ${isDark ? 'bg-black/20 border-white/5' : 'bg-white/60 border-gray-200'}`}>
        <div className="flex items-center gap-3">
            {/* Logo Icon - Professional sophisticated design */}
            <div className={`relative w-11 h-11 rounded-2xl flex items-center justify-center group transition-all duration-300 hover:scale-105 border
                ${isDark 
                    ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-slate-600/50 shadow-lg shadow-slate-900/50 hover:shadow-slate-700/40' 
                    : 'bg-gradient-to-br from-slate-100 via-white to-slate-50 border-slate-300/60 shadow-lg shadow-slate-400/20 hover:shadow-slate-500/30'
                }`}>
                {/* Complex layered geometric structure */}
                <svg className={`w-7 h-7 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-700'}`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Hexagonal container outline */}
                    <path d="M20 4L32 11V29L20 36L8 29V11L20 4Z" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          opacity="0.3"
                          strokeLinejoin="round"/>
                    
                    {/* Inner hexagon */}
                    <path d="M20 10L27 14V26L20 30L13 26V14L20 10Z" 
                          stroke="currentColor" 
                          strokeWidth="1.2" 
                          opacity="0.5"
                          strokeLinejoin="round"/>
                    
                    {/* Central node cluster - representing linked data */}
                    <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.9"/>
                    <circle cx="14" cy="17" r="1.8" fill="currentColor" opacity="0.7"/>
                    <circle cx="26" cy="17" r="1.8" fill="currentColor" opacity="0.7"/>
                    <circle cx="17" cy="25" r="1.8" fill="currentColor" opacity="0.7"/>
                    <circle cx="23" cy="25" r="1.8" fill="currentColor" opacity="0.7"/>
                    
                    {/* Connection lines - data flow */}
                    <path d="M15.5 17.5L17.5 19" stroke="currentColor" strokeWidth="1.2" opacity="0.4" strokeLinecap="round"/>
                    <path d="M24.5 17.5L22.5 19" stroke="currentColor" strokeWidth="1.2" opacity="0.4" strokeLinecap="round"/>
                    <path d="M18.5 23L19 21" stroke="currentColor" strokeWidth="1.2" opacity="0.4" strokeLinecap="round"/>
                    <path d="M21.5 23L21 21" stroke="currentColor" strokeWidth="1.2" opacity="0.4" strokeLinecap="round"/>
                    
                    {/* Pointer arrows - subtle directional indicators */}
                    <path d="M27 14L28 15" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
                    <path d="M13 26L12 27" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
                    
                    {/* Memory address markers */}
                    <rect x="18.5" y="12" width="3" height="1" rx="0.5" fill="currentColor" opacity="0.25"/>
                    <rect x="18.5" y="27" width="3" height="1" rx="0.5" fill="currentColor" opacity="0.25"/>
                </svg>
                
                {/* Subtle professional glow */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300
                    ${isDark ? 'bg-slate-400' : 'bg-slate-600'}`}></div>
            </div>
            
            {/* Brand Text */}
            <div className="flex items-baseline gap-1">
                <span className={`font-bold tracking-tight text-xl transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    DSA
                </span>
                <span className={`font-semibold text-lg transition-colors ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Viz
                </span>
            </div>
        </div>
        <button 
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2
            ${isDark 
                ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 shadow-sm'}`}
        >
            {isDark ? (
                <>
                    <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    <span>Light Mode</span>
                </>
            ) : (
                <>
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    <span>Dark Mode</span>
                </>
            )}
        </button>
      </header>

      <StatusBar isDark={isDark} />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-32">
        
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

          <h1 className={`text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b max-w-5xl
            ${isDark ? 'from-white via-white to-gray-600' : 'from-gray-900 via-gray-800 to-gray-500'}`}>
            Visualize Memory. 
            <br />
            <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>Master the Heap.</span>
          </h1>

          <p className={`max-w-2xl text-xl mb-12 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            A professional lightweight debugger for visualizing <span className="text-blue-500 font-semibold">Linked Lists</span>. 
            Trace allocations, watch pointers rewire, and understand true memory management.
          </p>

          <div className="flex gap-4">
             <button className={`px-8 py-3 font-bold rounded transition-colors text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200
               ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
               Get Started
             </button>
             <button className={`px-8 py-3 border font-medium rounded transition-colors text-base font-mono
               ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'}`}>
               npm install dsa-viz
             </button>
          </div>
        </section>


        {/* --- Stats Grid --- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
           <StatBox value="60 FPS" label="Rendering" isDark={isDark} />
           <StatBox value="< 1ms" label="Latency" isDark={isDark} />
           <StatBox value="Zero" label="Dependencies" isDark={isDark} />
           <StatBox value="100%" label="Open Source" isDark={isDark} />
        </section>


        {/* --- Bento Grid --- */}
        <section className="mb-32">
           <div className="flex items-center justify-between mb-8">
             <h2 className={`text-2xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
               <span className="w-1.5 h-8 bg-blue-500 rounded-sm"></span>
               Data Structures
             </h2>
             <span className="text-sm font-mono text-gray-500">INDEX: 0x01 - 0x05</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {linkedLists.map((item, i) => (
                <BentoCard key={i} item={item} index={i} isDark={isDark} />
              ))}
           </div>
        </section>


        {/* --- Specs Table --- */}
        <section className="mb-32">
           <div className="flex items-center justify-between mb-8">
             <h2 className={`text-2xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
               <span className="w-1.5 h-8 bg-blue-500 rounded-sm"></span>
               Tech Specs
             </h2>
             <span className="text-sm font-mono text-gray-500">perf_analysis.log</span>
           </div>

           <div className={`border rounded-lg overflow-hidden transition-colors ${isDark ? 'border-white/5 bg-[#080808]' : 'border-gray-200 bg-white shadow-sm'}`}>
             <div className={`grid grid-cols-5 py-4 border-b text-xs font-mono uppercase px-4
               ${isDark ? 'border-white/10 bg-white/5 text-gray-400' : 'border-gray-100 bg-gray-50 text-gray-500'}`}>
               <div>Structure</div>
               <div>Access</div>
               <div>Search</div>
               <div>Insert</div>
               <div>Delete</div>
             </div>
             
             <ComplexityRow name="Singly Linked List" access="O(n)" search="O(n)" insert="O(1)" remove="O(1)" isDark={isDark} />
             <ComplexityRow name="Doubly Linked List" access="O(n)" search="O(n)" insert="O(1)" remove="O(1)" isDark={isDark} />
             <ComplexityRow name="Circular List" access="O(n)" search="O(n)" insert="O(1)" remove="O(1)" isDark={isDark} />
             <ComplexityRow name="Array (Ref)" access="O(1)" search="O(n)" insert="O(n)" remove="O(n)" isDark={isDark} />
           </div>
        </section>


        {/* --- Features Grid --- */}
        <section className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 border-t pt-16 transition-colors ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
           <div className="p-6">
             <div className="text-blue-500 mb-6"><Icons.Cpu /></div>
             <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Real-time Heap View</h3>
             <p className={`text-base leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
               Watch as `malloc()` reserves specific blocks in our simulated heap memory. See the addresses change live.
             </p>
           </div>
           
           <div className="p-6">
             <div className="text-blue-500 mb-6"><Icons.Zap /></div>
             <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Pointer Arithmetic</h3>
             <p className={`text-base leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
               Understand `next` and `prev` pointers not as arrows, but as memory addresses storing locations.
             </p>
           </div>

           <div className="p-6">
             <div className="text-blue-500 mb-6"><Icons.Database /></div>
             <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>State Management</h3>
             <p className={`text-base leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
               Global state ensures your data structures persist across route changes, just like a real database.
             </p>
           </div>
        </section>


        {/* --- Terminal CTA --- */}
        <section className={`relative rounded-2xl border overflow-hidden ${isDark ? 'border-white/10 bg-[#0c0c0c]' : 'border-gray-300 bg-[#1e1e1e] shadow-xl'}`}>
           <div className={`absolute top-0 left-0 right-0 h-10 border-b flex items-center px-4 gap-2 bg-white/5 border-white/5`}>
             <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
             <div className="ml-4 text-[10px] font-mono text-gray-500">term -- zsh</div>
           </div>

           <div className="p-8 pt-16 font-mono text-sm md:text-base text-gray-400">
             <p>$ <span className="text-blue-400">init</span> engine --verbose</p>
             <p className="text-gray-500 mt-2">Loading core modules...</p>
             <p className="text-gray-500">Initializing heap memory (1024MB)...</p>
             <p className="text-green-500 mt-2">Success! Visualizer ready.</p>
             <p className="mt-4 animate-pulse">_</p>
           </div>
        </section>

      </main>
    </div>
  );
}
