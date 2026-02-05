'use client';

import Link from 'next/link'

export default function Home() {
  const linkedLists = [
    {
      title: 'Singly Linked List',
      description: 'Master single-direction traversal with next pointers',
      icon: '→',
      color: 'blue',
      href: '/linked-list/singly',
      features: ['Insert at head/tail', 'Delete nodes', 'Traverse & reverse']
    },
    {
      title: 'Doubly Linked List',
      description: 'Navigate bidirectionally with prev and next pointers',
      icon: '⇄',
      color: 'purple',
      href: '/linked-list/doubly',
      features: ['Back & forward', 'Bidirectional traversal', 'Browser history simulation']
    },
    {
      title: 'Circular Singly Linked List',
      description: 'Explore circular references where tail connects to head',
      icon: '↻',
      color: 'green',
      href: '/linked-list/circular-singly',
      features: ['Round-robin scheduling', 'Infinite loops', 'No NULL pointers']
    },
    {
      title: 'Circular Doubly Linked List',
      description: 'Master the most complex structure with circular bidirectional links',
      icon: '⟲',
      color: 'orange',
      href: '/linked-list/circular-doubly',
      features: ['Full bidirectional cycles', 'Advanced navigation', 'Complex operations']
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        gradient: 'from-blue-500 to-blue-600/50',
        text: 'text-blue-500',
        shadow: 'hover:shadow-blue-500/20',
        border: 'hover:border-blue-500',
        bg: 'bg-blue-500',
        btnShadow: 'shadow-blue-500/30',
        before: 'before:via-blue-500'
      },
      purple: {
        gradient: 'from-purple-500 to-purple-600/50',
        text: 'text-purple-500',
        shadow: 'hover:shadow-purple-500/20',
        border: 'hover:border-purple-500',
        bg: 'bg-purple-500',
        btnShadow: 'shadow-purple-500/30',
        before: 'before:via-purple-500'
      },
      green: {
        gradient: 'from-green-500 to-green-600/50',
        text: 'text-green-500',
        shadow: 'hover:shadow-green-500/20',
        border: 'hover:border-green-500',
        bg: 'bg-green-500',
        btnShadow: 'shadow-green-500/30',
        before: 'before:via-green-500'
      },
      orange: {
        gradient: 'from-orange-500 to-orange-600/50',
        text: 'text-orange-500',
        shadow: 'hover:shadow-orange-500/20',
        border: 'hover:border-orange-500',
        bg: 'bg-orange-500',
        btnShadow: 'shadow-orange-500/30',
        before: 'before:via-orange-500'
      }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] to-[#0f1422] text-gray-50 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Opacity removed to prevent blank page */}
        <header className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            Linked List Visual Debugger
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Step through real C++ linked list algorithms line-by-line. Watch memory allocations,
            pointer updates, and variable changes in real-time as you debug like a professional developer.
          </p>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {linkedLists.map((list, index) => {
            const colors = getColorClasses(list.color);
            return (
              <Link
                key={list.href}
                href={list.href}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
              >
                <div className={`
                  relative bg-[#1a1f35] border border-[#2d3548] rounded-2xl p-8
                  transition-all duration-500 hover:-translate-y-2
                  hover:shadow-2xl ${colors.shadow} ${colors.border}
                  before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px]
                  before:bg-gradient-to-r before:from-transparent ${colors.before} before:to-transparent
                  before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
                `}>
                  {/* Card Header */}
                  <div className="flex items-center gap-5 mb-6">
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                      bg-gradient-to-br ${colors.gradient}
                      transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6
                    `}>
                      {list.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-1 tracking-tight">
                        {list.title}
                      </h2>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {list.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-7">
                    {list.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-gray-400 text-sm transition-colors hover:text-gray-200"
                      >
                        <span className={`${colors.text} font-semibold text-lg`}>→</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className={`
                    inline-flex items-center gap-2 px-7 py-3.5
                    ${colors.bg} text-white rounded-xl font-semibold text-sm
                    transition-all duration-300 group-hover:translate-x-1
                    shadow-lg ${colors.btnShadow}
                    relative overflow-hidden
                    before:absolute before:inset-0 before:bg-gradient-to-r 
                    before:from-transparent before:via-white/20 before:to-transparent
                    before:-translate-x-full group-hover:before:translate-x-full
                    before:transition-transform before:duration-700
                  `}>
                    Start Learning
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-[#1a1f35] border border-[#2d3548] rounded-3xl p-14 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
          <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">
            What Makes This Different?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              { icon: '🔍', title: 'Debugger Style', desc: 'Step through code line-by-line, not just watch animations', color: 'blue' },
              { icon: '💻', title: 'Real C++ Code', desc: 'See actual textbook C++ algorithms in action', color: 'green' },
              { icon: '🧠', title: 'Memory Visualization', desc: 'Watch memory, pointers, and variables change in real-time', color: 'purple' }
            ].map((feature, idx) => {
              const colors = getColorClasses(feature.color);
              return (
                <div
                  key={idx}
                  className={`
                    text-center p-8 rounded-2xl bg-[#111827] border border-transparent
                    transition-all duration-500 hover:-translate-y-1
                    ${colors.border} hover:bg-[#242b42]
                  `}
                >
                  <span className="text-5xl block mb-5">{feature.icon}</span>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
