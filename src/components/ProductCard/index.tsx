// src/components/ProductCard/index.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { Product, Media } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'
import { cn } from '@/utilities/ui'

interface ProductCardProps {
  product: Product
  showDescription?: boolean
  className?: string
  priority?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showDescription = true,
  className,
  priority = false,
}) => {
  const { name, description, price, image } = product

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        'group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300',
        className,
      )}
    >
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        {image && typeof image === 'object' && (
          <MediaComponent
            resource={image as Media}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            priority={priority}
          />
        )}
        {price && (
          <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded-md text-sm font-medium">
            ${price}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>

        {showDescription && description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
        )}

        <div className="flex items-center justify-between">
          {price && <span className="text-xl font-bold text-gray-900">${price}</span>}

          <div className="text-sm text-blue-600 font-medium group-hover:underline">
            View Details →
          </div>
        </div>
      </div>
    </Link>
  )
}
