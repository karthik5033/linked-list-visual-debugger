'use client';

import Link from 'next/link';

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030303]">
    {/* Base Gradient - Ultra Dark */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-[#0a0a0a]" />

    {/* Infinite Moving Grid - Tech Style */}
    <div 
      className="absolute inset-0 opacity-[0.25] animate-pan"
      style={{
        backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}
    />
    
    {/* Subtle Radial Glows for depth */}
    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen animate-float" style={{ animationDuration: '10s' }} />
    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }} />
  </div>
);

export default function Home() {
  const linkedLists = [
    {
      title: 'Singly Linked List',
      description: 'Single-direction traversal structure.',
      icon: '→',
      color: 'blue',
      href: '/linked-list/singly',
      features: ['Head/Tail Insertion', 'Pointer Rewiring', 'Memory Deallocation']
    },
    {
      title: 'Doubly Linked List',
      description: 'Bidirectional navigation system.',
      icon: '⇄',
      color: 'purple',
      href: '/linked-list/doubly',
      features: ['Prev/Next Pointers', 'History Simulation', 'Bidirectional Traversal']
    },
    {
      title: 'Circular Singly List',
      description: 'Continuous loop architecture.',
      icon: '↻',
      color: 'emerald',
      href: '/linked-list/circular-singly',
      features: ['Ring Topology', 'Infinite Cycle', 'Scheduler Logic']
    },
    {
      title: 'Circular Doubly List',
      description: 'Complex bidirectional cycle.',
      icon: '⟲',
      color: 'orange',
      href: '/linked-list/circular-doubly',
      features: ['Advanced Cycles', 'Robust Navigation', 'Full Connectivity']
    }
  ];

  // Pro Theme Colors
  const getTheme = (color) => {
    const themes = {
      blue: {
        border: 'group-hover:border-blue-500/50',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]',
        iconBg: 'bg-blue-500/10 text-blue-400',
        text: 'text-blue-400',
        btn: 'bg-blue-600 hover:bg-blue-500'
      },
      purple: {
        border: 'group-hover:border-purple-500/50',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]',
        iconBg: 'bg-purple-500/10 text-purple-400',
        text: 'text-purple-400',
        btn: 'bg-purple-600 hover:bg-purple-500'
      },
      emerald: {
        border: 'group-hover:border-emerald-500/50',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]',
        iconBg: 'bg-emerald-500/10 text-emerald-400',
        text: 'text-emerald-400',
        btn: 'bg-emerald-600 hover:bg-emerald-500'
      },
      orange: {
        border: 'group-hover:border-orange-500/50',
        glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)]',
        iconBg: 'bg-orange-500/10 text-orange-400',
        text: 'text-orange-400',
        btn: 'bg-orange-600 hover:bg-orange-500'
      }
    };
    return themes[color];
  };

  return (
    <div className="min-h-screen font-sans text-gray-200 selection:bg-white/20">
      <AnimatedBackground />

      <main className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Hero Section */}
        <div className="text-center mb-24 animate-fade-in-down">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="text-xs font-mono tracking-widest text-gray-400 uppercase">
              DSA Visualizer v2.0
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Mem<span className="text-gray-600">ory</span>.cpp
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-500 font-light leading-relaxed">
            A professional-grade debugger for visualizing <span className="text-gray-300 font-mono">Linked List</span> operations in real-time. Watch pointer allocations on the heap.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {linkedLists.map((item, index) => {
            const theme = getTheme(item.color);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className="group relative block animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-md`} />
                
                {/* Card Content */}
                <div className={`
                  relative h-full bg-[#0a0a0a] border border-white/10 rounded-xl p-8
                  transition-all duration-300 ${theme.border} ${theme.glow}
                  hover:-translate-y-1
                `}>
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-12 h-12 rounded-lg ${theme.iconBg} flex items-center justify-center text-2xl font-mono`}>
                      {item.icon}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <span className={`text-xs font-mono border border-current px-2 py-1 rounded ${theme.text}`}>
                         ./RUN
                       </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-white/90 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="border-t border-white/5 pt-6">
                    <ul className="grid grid-cols-1 gap-2">
                       {item.features.map((feat, i) => (
                         <li key={i} className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                           <span className={`w-1 h-1 rounded-full ${theme.bg || theme.text.replace('text', 'bg')}`} />
                           {feat}
                         </li>
                       ))}
                    </ul>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
