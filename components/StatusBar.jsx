'use client';

import { motion } from 'framer-motion';

const StatusBar = ({ isDark = true }) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.5 }}
    className={`fixed bottom-0 left-0 right-0 h-8 border-t flex items-center px-4 justify-between text-xs font-mono z-50 select-none backdrop-blur-md transition-colors duration-500
      ${isDark ? 'bg-[#0a0a0a]/80 border-white/5 text-gray-600' : 'bg-white/80 border-gray-200 text-gray-500'}`}
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
      <span className={isDark ? "text-gray-500" : "text-gray-400"}>Memory.cpp</span>
      <span className="text-blue-500">UTF-8</span>
    </div>
  </motion.div>
);

export default StatusBar;
