'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

// --- Professional Theme Constants ---
const GRID_SIZE = 40; // px
const ALLOC_COLOR = '#3b82f6'; // Professional Blue
const FREE_COLOR = '#334155'; // Slate 700 (Inactive)
const SCAN_LINE_COLOR = 'rgba(59, 130, 246, 0.1)';

// --- Sub-Components ---

// Represents a memory address being "scanned"
const ScanLine = () => (
  <motion.div
    initial={{ top: '-10%' }}
    animate={{ top: '110%' }}
    transition={{ duration: 8, ease: "linear", repeat: Infinity }}
    className="absolute left-0 right-0 h-32 z-0 pointer-events-none"
    style={{
      background: `linear-gradient(to bottom, transparent, ${SCAN_LINE_COLOR}, transparent)`
    }}
  />
);

// A discreet, technical memory block
const TechBlock = ({ x, y, active }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: active ? [0, 1, 0.5] : 0, 
      scale: 1
    }}
    transition={{ duration: 2, times: [0, 0.1, 1] }}
    className="absolute w-1.5 h-1.5 bg-blue-500 rounded-[1px] shadow-[0_0_8px_rgba(59,130,246,0.6)]"
    style={{ left: x, top: y }}
  />
);

// A straight, circuit-like connection
const CircuitTrace = ({ sx, sy, ex, ey }) => {
  // Calculate Manhattan path (L-shape)
  const midX = sx; 
  const midY = ey;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
      <motion.path
        d={`M ${sx} ${sy} L ${midX} ${midY} L ${ex} ${ey}`}
        fill="none"
        stroke={ALLOC_COLOR}
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 1.5, ease: "circOut" }}
      />
    </svg>
  );
};

// Moving "Instruction Pointer"
const InstructionCursor = ({ x, y }) => (
  <motion.div 
    layoutId="cursor"
    className="absolute w-4 h-4 border border-blue-500/50 rounded-sm flex items-center justify-center"
    animate={{ x, y }}
    transition={{ type: "spring", stiffness: 100, damping: 20 }}
  >
    <div className="w-1 h-1 bg-blue-400 rounded-full" />
  </motion.div>
);

export default function MemoryBackground({ isDark = true }) {
  const [blocks, setBlocks] = useState([]);
  const [trace, setTrace] = useState(null);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const containerRef = useRef(null);

  // Simulation Logic: sequential access pattern
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const interval = setInterval(() => {
      // Find a random "address" aligned to grid
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      const cols = Math.floor(w / GRID_SIZE);
      const rows = Math.floor(h / GRID_SIZE);
      
      const c = Math.floor(Math.random() * cols);
      const r = Math.floor(Math.random() * rows);
      
      const x = c * GRID_SIZE + (GRID_SIZE / 2); // Center in cell
      const y = r * GRID_SIZE + (GRID_SIZE / 2);
      
      const uniqueId = `${Date.now()}-${Math.random()}`;
      
      // Move Instruction Pointer
      setCursor(prev => {
        // Occasionally trace from previous position
        if (Math.random() > 0.5 && prev.x > 0) {
            setTrace({ id: uniqueId, sx: prev.x, sy: prev.y, ex: x, ey: y });
        }
        return { x, y };
      });

      // Allocate Block
      setBlocks(prev => {
        const next = [...prev, { id: uniqueId, x, y, active: true }];
        return next.slice(-30); // Keep history clean
      });

    }, 600); // Slower, more deliberate pace

    return () => clearInterval(interval);
  }, []);

  const gridColor = isDark ? '#ffffff' : '#000000';
  const bgColor = isDark ? 'bg-[#050505]' : 'bg-gray-50';

  return (
    <div ref={containerRef} className={`fixed inset-0 z-0 ${bgColor} overflow-hidden transition-colors duration-500`}>
      {/* 1. The Grid (The foundation) */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
        }}
      />

      {/* 2. The Scanner */}
      <ScanLine />

      {/* 3. Active Traces */}
      {trace && (
         <CircuitTrace key={trace.id} {...trace} />
      )}

      {/* 4. Memory Blocks */}
      {blocks.map(b => (
        <TechBlock key={b.id} x={b.x} y={b.y} active={b.active} />
      ))}

      {/* 5. Instruction Pointer */}
      <InstructionCursor x={cursor.x} y={cursor.y} />

      {/* 6. Vignette for focus */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none transition-colors duration-500" 
        style={{
            background: `radial-gradient(circle at center, transparent 0%, ${isDark ? '#050505' : '#f9fafb'} 100%)`
        }}
      />
    </div>
  );
}
