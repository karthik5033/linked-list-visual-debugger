import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Linked List Visual Debugger
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Master the entire family of linked lists by executing real C++ algorithms 
            and watching memory, pointers, and variables change step-by-step
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Singly Linked List */}
          <Link href="/linked-list/singly">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Singly Linked List
              </h2>
              <p className="text-gray-600 mb-4">
                Learn the fundamentals of linked lists with single-direction pointers
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                Start Learning →
              </div>
            </div>
          </Link>

          {/* Doubly Linked List */}
          <Link href="/linked-list/doubly">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Doubly Linked List
              </h2>
              <p className="text-gray-600 mb-4">
                Master bidirectional traversal with next and prev pointers
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-semibold">
                Start Learning →
              </div>
            </div>
          </Link>

          {/* Circular Singly Linked List */}
          <Link href="/linked-list/circular-singly">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Circular Singly Linked List
              </h2>
              <p className="text-gray-600 mb-4">
                Understand circular references where the last node points to the first
              </p>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                Start Learning →
              </div>
            </div>
          </Link>

          {/* Circular Doubly Linked List */}
          <Link href="/linked-list/circular-doubly">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-orange-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Circular Doubly Linked List
              </h2>
              <p className="text-gray-600 mb-4">
                Master the most complex linked list with circular bidirectional pointers
              </p>
              <div className="flex items-center gap-2 text-orange-600 font-semibold">
                Start Learning →
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            What Makes This Different?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🔍</div>
              <h4 className="font-bold text-gray-900 mb-2">Debugger Style</h4>
              <p className="text-gray-600 text-sm">
                Step through code line-by-line, not just watch animations
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💻</div>
              <h4 className="font-bold text-gray-900 mb-2">Real C++ Code</h4>
              <p className="text-gray-600 text-sm">
                See actual textbook C++ algorithms in action
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🧠</div>
              <h4 className="font-bold text-gray-900 mb-2">Memory Visualization</h4>
              <p className="text-gray-600 text-sm">
                Watch memory, pointers, and variables change in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
