'use client';

import { useTheme } from '@/app/context/ThemeContext';

export default function CodePanel({ code = [], activeLine, title = 'C++ Code' }) {
    const { isDark } = useTheme();

    return (
        <div className={`backdrop-blur-md rounded-xl border overflow-hidden flex flex-col h-full shadow-lg transition-colors duration-500
            ${isDark ? 'bg-[#0a0a0a]/60 border-white/10' : 'bg-white/80 border-gray-200 shadow-xl'}`}>
            <div className={`px-4 py-3 border-b flex justify-between items-center transition-colors
                ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-mono text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{title}</h3>
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
            </div>

            <div className={`flex-1 p-6 overflow-auto font-mono text-base transition-colors
                ${isDark ? 'bg-black/20' : 'bg-white'}`}>
                {code.length === 0 ? (
                    <div className="text-gray-500 italic text-center mt-10">
            // No operation running
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <tbody>
                            {code.map((line, index) => {
                                const isHighlight = activeLine === index + 1; // activeLine is 1-based usually
                                return (
                                    <tr
                                        key={index}
                                        className={`${isHighlight ? (isDark ? 'bg-blue-500/20' : 'bg-blue-50') : (isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50')} transition-colors duration-150`}
                                    >
                                        <td className={`w-8 text-right pr-4 select-none border-r transition-colors
                                            ${isDark ? 'text-gray-600 border-white/10' : 'text-gray-400 border-gray-200 bg-gray-50/50'}`}>
                                            {index + 1}
                                        </td>
                                        <td className={`pl-4 py-0.5 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                                            {/* Use syntax highlighting */}
                                            <span dangerouslySetInnerHTML={{ __html: highlightSyntax(line, isDark) }} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

// Simple syntax highlighter for C++ appearance, theme-aware
function highlightSyntax(code, isDark) {
  if (!code) return '';

  // Theme Colors
  const colors = {
      comment: isDark ? 'text-gray-400' : 'text-gray-500',
      keyword: isDark ? 'text-pink-400' : 'text-purple-600',
      variable: isDark ? 'text-cyan-400' : 'text-blue-600',
      operator: isDark ? 'text-yellow-400' : 'text-amber-600',
      type: isDark ? 'text-green-400' : 'text-green-600'
  };

  // 1. Escape HTML entities first
  let safeCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  const placeholders = {};
  let pId = 0;
  const mask = (content) => {
    const key = `___MASK_${pId++}___`;
    placeholders[key] = content;
    return key;
  };

  // 2. Mask Comments
  safeCode = safeCode.replace(/(\/\/.*$)/gm, (match) => {
    return mask(`<span class="${colors.comment} italic">${match}</span>`);
  });

  // 3. Mask Keywords
  safeCode = safeCode.replace(/\b(Node|int|void|if|else|while|return|new|delete|struct|public|private)\b/g, (match) => {
    return mask(`<span class="${colors.keyword} font-bold">${match}</span>`); 
  });

  // 4. Mask Variables (Heuristic)
  safeCode = safeCode.replace(/\b(head|tail|next|prev|data|value)\b/g, (match) => {
    return mask(`<span class="${colors.variable} font-bold">${match}</span>`); 
  });

  // 5. Mask Operators
  safeCode = safeCode.replace(/(\->|==|!=|\+\+|[=+\-*/.])/g, (match) => {
    return mask(`<span class="${colors.operator} font-bold">${match}</span>`); 
  });

  // 6. Restore all masks
  Object.keys(placeholders).forEach((key) => {
    safeCode = safeCode.split(key).join(placeholders[key]);
  });

  return safeCode;
}
