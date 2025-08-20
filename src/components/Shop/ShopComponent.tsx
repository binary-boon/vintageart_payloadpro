// src/components/Shop/ShopComponent.tsx - FINAL VERSION WITHOUT PRICING
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { ShopFilters } from './ShopFilters'
import { ShopSort } from './ShopSort'
import { ShopSearch } from './ShopSearch'
import { ShopPagination } from './ShopPagination'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Product, Category } from '@/payload-types'
import { Filter, Grid, List } from 'lucide-react'

interface ShopFilters {
  category?: string
  sortBy?: string
  search?: string
  page?: number
  featured?: boolean
  tags?: string[]
}

interface ShopComponentProps {
  searchParams: {
    category?: string
    sortBy?: string
    search?: string
    page?: string
    featured?: string
    tags?: string
  }
}

interface ShopData {
  products: Product[]
  totalPages: number
  currentPage: number
  totalProducts: number
  categories: Category[]
  availableTags: string[]
}

export const ShopComponent: React.FC<ShopComponentProps> = ({ searchParams }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [data, setData] = useState<ShopData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Parse search params into filters - REMOVED ALL PRICE FIELDS
  const filters: ShopFilters = {
    category: searchParams.category,
    sortBy: searchParams.sortBy || 'newest',
    search: searchParams.search,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    featured: searchParams.featured === 'true',
    tags: searchParams.tags ? searchParams.tags.split(',') : undefined,
  }

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const queryParams = new URLSearchParams()

        // Add filters to query params - REMOVED ALL PRICE FIELDS
        if (filters.category) queryParams.set('category', filters.category)
        if (filters.sortBy) queryParams.set('sortBy', filters.sortBy)
        if (filters.search) queryParams.set('search', filters.search)
        if (filters.page) queryParams.set('page', filters.page.toString())
        if (filters.featured) queryParams.set('featured', 'true')
        if (filters.tags?.length) queryParams.set('tags', filters.tags.join(','))

        const response = await fetch(`/api/shop?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const shopData = await response.json()
        setData(shopData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [
    filters.category,
    filters.sortBy,
    filters.search,
    filters.page,
    filters.featured,
    filters.tags?.join(','),
  ])

  // Update URL with new filters
  const updateFilters = (newFilters: Partial<ShopFilters>) => {
    const params = new URLSearchParams()

    const updatedFilters = { ...filters, ...newFilters, page: 1 } // Reset to page 1 when filters change

    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','))
          }
        } else {
          params.set(key, value.toString())
        }
      }
    })

    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname

    router.push(newUrl)
  }

  // Clear all filters
  const clearFilters = () => {
    router.push(pathname)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-lg">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0) &&
      !(typeof value === 'number' && value === 1), // Ignore page = 1
  )

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="sticky top-4">
          <ShopFilters
            filters={filters}
            onFiltersChange={updateFilters}
            categories={data.categories}
            availableTags={data.availableTags}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Search */}
            <ShopSearch
              value={filters.search || ''}
              onChange={(search) => updateFilters({ search })}
            />
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort */}
            <ShopSort
              value={filters.sortBy || 'newest'}
              onChange={(sortBy) => updateFilters({ sortBy })}
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
          <span>
            Showing {data.products.length} of {data.totalProducts} artworks
            {filters.search && ` for "${filters.search}"`}
          </span>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-blue-600 hover:text-blue-700 underline">
              Clear all filters
            </button>
          )}
        </div>

        {/* Products Grid/List */}
        {data.products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">No artworks found</p>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
              }
            >
              {data.products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showDescription={true}
                  priority={index < 6}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="mt-12">
                <ShopPagination
                  currentPage={data.currentPage}
                  totalPages={data.totalPages}
                  onPageChange={(page) => updateFilters({ page })}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
