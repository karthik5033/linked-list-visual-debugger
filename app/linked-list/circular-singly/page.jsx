/**
 * Circular Singly Linked List Page
 * Coming soon
 */

'use client';

import Link from 'next/link';

export default function CircularSinglyLinkedListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-green-600 hover:text-green-700 font-semibold">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Circular Singly Linked List Debugger
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
            The Circular Singly Linked List debugger is under development.
            This will show how the last node points back to the head.
          </p>
          <Link 
            href="/linked-list/singly"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Try Singly Linked List Instead
          </Link>
        </div>
      </main>
    </div>
  );
}
