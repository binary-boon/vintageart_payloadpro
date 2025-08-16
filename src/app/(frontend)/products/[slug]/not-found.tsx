// src/app/(frontend)/products/[slug]/not-found.tsx
import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Artwork Not Found</h1>
          <p className="text-gray-600">
            Sorry, we couldn't find the artwork you're looking for. It may have been moved or is no
            longer available.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            Browse All Artworks
          </Link>

          <div>
            <Link href="/" className="text-amber-600 hover:text-amber-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
