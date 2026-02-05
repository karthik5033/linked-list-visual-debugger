'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Cpu, BrainCircuit, Play } from 'lucide-react';

const Card = ({ title, description, href, delay }) => (
  <Link href={href}>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative h-full bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10 font-sans tracking-tight">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 relative z-10">
        {description}
      </p>
      
      <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <ArrowRight className="w-5 h-5 text-gray-900" />
      </div>
    </motion.div>
  </Link>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-gray-100 selection:text-black">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600 mb-6 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-black tracking-tight mb-6">
            Visual Debugger
            <span className="block text-gray-400 font-light mt-2">for Linked Lists</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            A developer-first environment to execute, visualize, and debug memory allocation in real-time. Powered by C++ algorithms.
          </p>

          <div className="mt-10 flex justify-center gap-4">
             <Link 
              href="/linked-list/singly"
              className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg shadow-gray-200"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Debugging
            </Link>
            <a 
              href="https://github.com/karthik5033/linked-list-visual-debugger"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View Source
            </a>
          </div>
        </motion.div>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
          <Card 
            title="Singly Linked List" 
            description="Unidirectional memory structures. Master the fundamentals of next pointers and dynamic allocation."
            href="/linked-list/singly"
            delay={0.1}
          />
          <Card 
            title="Doubly Linked List" 
            description="Bidirectional memory navigation. Handle complexity with prev and next pointer synchronization."
            href="/linked-list/doubly"
            delay={0.2}
          />
          <Card 
            title="Circular Singly" 
            description="Cyclic data structures. Understand terminal node linking and infinite traversal loops."
            href="/linked-list/circular-singly"
            delay={0.3}
          />
          <Card 
            title="Circular Doubly" 
            description="Complex cyclic bidirectional structures. The ultimate test of pointer management."
            href="/linked-list/circular-doubly"
            delay={0.4}
          />
        </div>

        {/* Feature Specs */}
        <div className="border-t border-gray-100 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                <Code2 className="w-5 h-5 text-gray-700" />
              </div>
              <h4 className="font-bold text-gray-900">Native C++ Logic</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Source code execution mirrors standard C++ implementations, providing an authentic low-level debugging experience.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                <Cpu className="w-5 h-5 text-gray-700" />
              </div>
              <h4 className="font-bold text-gray-900">Memory Simulation</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Real-time heap visualization. Watch how nodes are allocated on the heap and how the stack maintains references.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                <BrainCircuit className="w-5 h-5 text-gray-700" />
              </div>
              <h4 className="font-bold text-gray-900">Step-by-Step State</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Atomic execution control. Pause, step forward, or roll back to inspect variable states at any micro-operation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
