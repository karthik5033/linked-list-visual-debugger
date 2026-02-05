/**
 * Circular Doubly Linked List Page
 * Coming soon
 */

'use client';

import Link from 'next/link';

export default function CircularDoublyLinkedListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-semibold">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Circular Doubly Linked List Debugger
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-xl shadow-2xl p-12">
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Coming Soon!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            The Circular Doubly Linked List debugger is under development.
            This is the most complex linked list with circular bidirectional pointers.
          </p>
          <Link 
            href="/linked-list/singly"
            className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Try Singly Linked List Instead
          </Link>
        </div>
      </main>
    </div>
  );
}
