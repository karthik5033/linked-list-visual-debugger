/**
 * Arrow Component
 * Renders an arrow between nodes (for next/prev pointers)
 */

'use client';

export default function Arrow({ direction = 'right', label = '', isHighlighted = false }) {
  const arrowColor = isHighlighted ? '#facc15' : '#374151';
  
  if (direction === 'right') {
    return (
      <div className="flex flex-col items-center justify-center mx-2">
        <svg width="60" height="40" className="overflow-visible">
          <defs>
            <marker
              id={`arrowhead-${label}-${isHighlighted}`}
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3, 0 6"
                fill={arrowColor}
              />
            </marker>
          </defs>
          <line
            x1="0"
            y1="20"
            x2="50"
            y2="20"
            stroke={arrowColor}
            strokeWidth={isHighlighted ? "3" : "2"}
            markerEnd={`url(#arrowhead-${label}-${isHighlighted})`}
          />
        </svg>
        {label && (
          <span className={`text-xs font-semibold ${isHighlighted ? 'text-yellow-600' : 'text-gray-600'}`}>
            {label}
          </span>
        )}
      </div>
    );
  }

  // For backward arrows (prev pointer in doubly linked list)
  if (direction === 'left') {
    return (
      <div className="flex flex-col items-center justify-center mx-2">
        <svg width="60" height="40" className="overflow-visible">
          <defs>
            <marker
              id={`arrowhead-back-${label}-${isHighlighted}`}
              markerWidth="10"
              markerHeight="10"
              refX="1"
              refY="3"
              orient="auto"
            >
              <polygon
                points="10 0, 0 3, 10 6"
                fill={arrowColor}
              />
            </marker>
          </defs>
          <line
            x1="10"
            y1="20"
            x2="60"
            y2="20"
            stroke={arrowColor}
            strokeWidth={isHighlighted ? "3" : "2"}
            markerStart={`url(#arrowhead-back-${label}-${isHighlighted})`}
          />
        </svg>
        {label && (
          <span className={`text-xs font-semibold ${isHighlighted ? 'text-yellow-600' : 'text-gray-600'}`}>
            {label}
          </span>
        )}
      </div>
    );
  }

  return null;
}
