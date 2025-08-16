// src/components/ProductCard/index.tsx
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
  const { name, description, price, image } = product

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

          {/* Stock status overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                Out of Stock
              </span>
            </div>
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
              {price && (
                <div className="ml-4 text-right">
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(price)}</span>
                  {product.compareAtPrice && product.compareAtPrice > price && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stock and Featured badges */}
            <div className="flex items-center gap-2 mb-3">
              {product.featured && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Featured
                </span>
              )}
              {product.inStock ? (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Out of Stock
                </span>
              )}
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

          {/* Price tag */}
          {price && (
            <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded-md text-sm font-medium">
              {formatPrice(price)}
              {product.compareAtPrice && product.compareAtPrice > price && (
                <div className="text-xs text-gray-300 line-through">
                  {formatPrice(product.compareAtPrice)}
                </div>
              )}
            </div>
          )}

          {/* Quick Request Quote Button */}
          {showRequestQuote && <QuickRequestQuoteButton product={product} />}

          {/* Stock status overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        {/* Badges */}
        <div className="flex items-center gap-2">
          {product.featured && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              Featured
            </span>
          )}
          {product.inStock ? (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
              Out of Stock
            </span>
          )}
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
          {price && (
            <div>
              <span className="text-xl font-bold text-gray-900">{formatPrice(price)}</span>
              {product.compareAtPrice && product.compareAtPrice > price && (
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(product.compareAtPrice)}
                </div>
              )}
            </div>
          )}

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
