'use client';

import { motion } from 'framer-motion';

export default function Node({ value, nodeId, isHead, isTail, isHighlighted }) {
  return (
    <motion.div 
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="flex flex-col items-center mx-2 group"
    >
      {/* Labels - Absolute positioned to avoid layout shift */}
      <div className="h-6 mb-1 flex gap-1 items-end">
        {isHead && (
          <motion.span 
            initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 tracking-wider"
          >
            HEAD
          </motion.span>
        )}
        {isTail && (
          <motion.span 
            initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 tracking-wider"
          >
            TAIL
          </motion.span>
        )}
      </div>

      {/* Node Box */}
      <div 
        className={`
          relative w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center
          transition-all duration-300 shadow-sm
          ${isHighlighted 
            ? 'border-black bg-black text-white shadow-lg shadow-gray-400/50 scale-105 z-10' 
            : 'border-gray-200 bg-white text-gray-900 group-hover:border-gray-300 group-hover:shadow'
          }
        `}
      >
        <span className="text-xl font-bold font-mono tracking-tight">{value}</span>
        
        {/* Memory Address Simulation */}
        <span className={`text-[8px] font-mono mt-1 opacity-60 ${isHighlighted ? 'text-gray-300' : 'text-gray-400'}`}>
          {nodeId.replace('node_', '0x')}
        </span>
      </div>
    </motion.div>
  );
}
