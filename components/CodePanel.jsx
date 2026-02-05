'use client';

export default function CodePanel({ code = [], activeLine, title = 'C++ Code' }) {
    return (
        <div className="bg-[#1f2937] rounded-xl border border-[#374151] overflow-hidden flex flex-col h-full shadow-lg">
            <div className="bg-[#111827] px-4 py-3 border-b border-[#374151] flex justify-between items-center">
                <h3 className="font-mono text-sm font-bold text-gray-300">{title}</h3>
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
            </div>

<<<<<<< HEAD
// Simple syntax highlighter for C++ appearance
function highlightSyntax(code) {
<<<<<<< Updated upstream
  // Process steps in safe order: Keywords -> Variables -> Operators -> Comments
  return code
    .replace(/\b(Node|int|void|if|else|while|return|new|delete|struct|public|private)\b/g, '<span class="text-purple-600 font-semibold">$&</span>') // Keywords (removed 'class')
    .replace(/\b(head|tail|next|prev|data|value)\b/g, '<span class="text-blue-600">$&</span>') // Variables
    .replace(/(=|==|!=|->|\.|\+\+)/g, '<span class="text-gray-500">$&</span>') // Operators
    .replace(/\/\/.*/g, '<span class="text-gray-400 italic">$&</span>'); // Comments (Last to wrap everything)
=======
            <div className="flex-1 p-4 overflow-auto font-mono text-sm bg-[#0f1422]">
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
                                        className={`${isHighlight ? 'bg-blue-500/20' : 'hover:bg-gray-800/30'} transition-colors duration-150`}
                                    >
                                        <td className="w-8 text-gray-600 text-right pr-4 select-none border-r border-[#374151]">
                                            {index + 1}
                                        </td>
                                        <td className="pl-4 py-0.5">
                                            <span className={`${isHighlight ? 'text-blue-300 font-bold' : 'text-gray-300'}`}>
                                                {line}
                                            </span>
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
>>>>>>> f8ff2203ae70110c88cd4b2f078d9e627d3d8095
=======
  if (!code) return '';

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
    return mask(`<span class="text-gray-400 italic">${match}</span>`);
  });

  // 3. Mask Keywords
  safeCode = safeCode.replace(/\b(Node|int|void|if|else|while|return|new|delete|struct|public|private)\b/g, (match) => {
    return mask(`<span class="text-purple-600 font-semibold">${match}</span>`);
  });

  // 4. Mask Variables
  safeCode = safeCode.replace(/\b(head|tail|next|prev|data|value)\b/g, (match) => {
    return mask(`<span class="text-blue-600">${match}</span>`);
  });

  // 5. Mask Operators
  safeCode = safeCode.replace(/(\->|==|!=|\+\+|[=+\-*/.])/g, (match) => {
    return mask(`<span class="text-gray-500">${match}</span>`);
  });

  // 6. Restore all masks
  Object.keys(placeholders).forEach((key) => {
    safeCode = safeCode.split(key).join(placeholders[key]);
  });

  return safeCode;
>>>>>>> Stashed changes
}
