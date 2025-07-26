// src/app/(frontend)/shop/page.tsx
import React from 'react'
import { ShopComponent } from '@/components/Shop/ShopComponent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop - Vintage Art & Decor',
  description:
    'Browse our collection of vintage art and decor pieces. Filter by category, price, and more.',
}

interface ShopPageProps {
  searchParams: Promise<{
    category?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    search?: string
    page?: string
    inStock?: string
    featured?: string
    tags?: string
  }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Await searchParams for Next.js 15 compatibility
  const resolvedSearchParams = await searchParams

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop</h1>
          <p className="text-lg text-gray-600">
            Discover our curated collection of vintage art and decor pieces
          </p>
        </div>

        <ShopComponent searchParams={resolvedSearchParams} />
      </div>
    </div>
  )
}
