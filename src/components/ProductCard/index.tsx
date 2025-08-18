// src/components/ProductCard/index.tsx - FIXED VERSION
'use client'

import React from 'react'
import Link from 'next/link'
import { Product, Media } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'
import {
  RequestQuoteButton,
  QuickRequestQuoteButton,
} from '@/components/RequestQuote/RequestQuoteButton'
import { cn } from '@/utilities/ui'
import { formatPrice } from '@/utilities/shopHelpers'

interface ProductCardProps {
  product: Product
  showDescription?: boolean
  showRequestQuote?: boolean
  className?: string
  priority?: boolean
  viewMode?: 'grid' | 'list'
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showDescription = true,
  showRequestQuote = true,
  className,
  priority = false,
  viewMode = 'grid',
}) => {
  const { name, description, image } = product

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'group flex bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300',
          className,
        )}
      >
        <Link
          href={`/products/${product.id}`}
          className="w-48 h-48 relative overflow-hidden bg-gray-100 flex-shrink-0"
        >
          {image && typeof image === 'object' && (
            <MediaComponent
              resource={image as Media}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              priority={priority}
            />
          )}
        </Link>

        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                  {name}
                </h3>
              </Link>
            </div>

            {/* Badges - Removed stock status, kept featured */}
            <div className="flex items-center gap-2 mb-3">
              {product.featured && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Featured
                </span>
              )}
              {/* Always show as available for quote */}
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Available for Quote
              </span>
            </div>

            {showDescription && description && (
              <p className="text-gray-600 line-clamp-3 mb-4">{description}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <Link
              href={`/products/${product.id}`}
              className="text-blue-600 font-medium group-hover:underline"
            >
              View Details →
            </Link>

            {showRequestQuote && (
              <div className="min-w-[140px]">
                <RequestQuoteButton product={product} size="sm" variant="primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Grid view (default)
  return (
    <div
      className={cn(
        'group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300 relative',
        className,
      )}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {image && typeof image === 'object' && (
            <MediaComponent
              resource={image as Media}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              priority={priority}
            />
          )}

          {/* Quick Request Quote Button */}
          {showRequestQuote && <QuickRequestQuoteButton product={product} />}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        {/* Badges - Removed stock status, kept featured */}
        <div className="flex items-center gap-2">
          {product.featured && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              Featured
            </span>
          )}
          {/* Always show as available for quote */}
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Available for Quote
          </span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </Link>

        {showDescription && description && (
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        )}

        <div className="flex items-center justify-between">
          <Link
            href={`/products/${product.id}`}
            className="text-sm text-blue-600 font-medium group-hover:underline"
          >
            View Details →
          </Link>
        </div>

        {showRequestQuote && (
          <div className="pt-2">
            <RequestQuoteButton product={product} size="md" variant="primary" fullWidth />
          </div>
        )}
      </div>
    </div>
  )
}
