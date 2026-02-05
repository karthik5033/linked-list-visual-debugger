'use client';

import { motion } from 'framer-motion';

const StatusBar = () => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.5 }}
    className="fixed bottom-0 left-0 right-0 h-8 bg-[#0a0a0a]/80 border-t border-white/5 flex items-center px-4 justify-between text-xs font-mono text-gray-600 z-50 select-none backdrop-blur-md"
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

export default StatusBar;
