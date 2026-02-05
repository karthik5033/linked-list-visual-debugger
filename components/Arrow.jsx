'use client';

import { motion } from 'framer-motion';

export default function Arrow({ direction = 'right', label = '', isHighlighted = false }) {
  const arrowColor = isHighlighted ? '#171717' : '#e5e5e5'; // Black if active, light gray if not
  
  if (direction === 'right') {
    return (
      <div className="flex flex-col items-center justify-center -mx-1 z-0 relative">
        <svg width="40" height="24" className="overflow-visible">
          <defs>
            <marker
              id={`arrowhead-${label}-${isHighlighted}`}
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path
                d="M0,0 L6,3 L0,6"
                fill={arrowColor}
              />
            </marker>
          </defs>
          <motion.line
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
            x1="0"
            y1="12"
            x2="34"
            y2="12"
            stroke={arrowColor}
            strokeWidth="2"
            markerEnd={`url(#arrowhead-${label}-${isHighlighted})`}
          />
        </svg>
        {label && (
          <span className={`text-[9px] font-mono mt-0.5 tracking-tight ${isHighlighted ? 'text-black font-semibold' : 'text-gray-300'}`}>
            {label}
          </span>
        )}
      </div>
    );
  }

  // Backwards Arrow (for Doubly Prev)
  if (direction === 'left') {
    // We render this below the node usually, or offset
     return (
      <div className="flex flex-col items-center justify-center -mx-1 absolute -bottom-4 w-full">
        <svg width="40" height="20" className="overflow-visible">
          <defs>
            <marker
              id={`arrowhead-back-${label}-${isHighlighted}`}
              markerWidth="6"
              markerHeight="6"
              refX="1"
              refY="3"
              orient="auto"
            >
              <path d="M6,0 L0,3 L6,6" fill={arrowColor} />
            </marker>
          </defs>
          <line
            x1="6"
            y1="10"
            x2="40"
            y2="10"
            stroke={arrowColor}
            strokeWidth="2"
            markerStart={`url(#arrowhead-back-${label}-${isHighlighted})`}
             strokeDasharray="4 2"
          />
        </svg>
      </div>
    );
  }

  return null;
}
