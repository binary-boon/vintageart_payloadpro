// src/blocks/ProductListing/Component.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Product } from '@/payload-types'
import { ProductCard } from '@/components/ProductCard'
import { cn } from '@/utilities/ui'

interface ProductListingProps {
  title?: string
  displayMode: 'all' | 'selected' | 'latest'
  selectedProducts?: (Product | string)[]
  numberOfProducts?: number
  showDescription?: boolean
  cardsPerRow?: '2' | '3' | '4'
  className?: string
  disableInnerContainer?: boolean
}

export const ProductListingComponent: React.FC<ProductListingProps> = async ({
  title,
  displayMode,
  selectedProducts = [],
  numberOfProducts = 6,
  showDescription = true,
  cardsPerRow = '3',
  className,
  disableInnerContainer,
}) => {
  let products: Product[] = []

  try {
    const payload = await getPayload({ config })

    switch (displayMode) {
      case 'all':
        const allProductsResult = await payload.find({
          collection: 'products',
          limit: numberOfProducts,
          depth: 2,
        })
        products = allProductsResult.docs
        break

      case 'latest':
        const latestProductsResult = await payload.find({
          collection: 'products',
          limit: numberOfProducts,
          sort: '-createdAt',
          depth: 2,
        })
        products = latestProductsResult.docs
        break

      case 'selected':
        // Handle both populated and non-populated selectedProducts
        if (selectedProducts.length > 0) {
          const productIds = selectedProducts.map((product) =>
            typeof product === 'string' ? product : product.id,
          )

          const selectedProductsResult = await payload.find({
            collection: 'products',
            where: {
              id: {
                in: productIds,
              },
            },
            limit: productIds.length,
            depth: 2,
          })
          products = selectedProductsResult.docs
        }
        break

      default:
        products = []
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    products = []
  }

  if (products.length === 0) {
    return (
      <section className={cn('py-12', className)}>
        <div className="container mx-auto px-4">
          {title && <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">{title}</h2>}
          <div className="text-center text-gray-600">
            <p>No products available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  const getGridClasses = () => {
    switch (cardsPerRow) {
      case '2':
        return 'grid-cols-1 md:grid-cols-2'
      case '4':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  return (
    <section className={cn('py-12 bg-gray-50', className)}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{title}</h2>}

        <div className={cn('grid gap-6', getGridClasses())}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              showDescription={showDescription}
              priority={index < 4} // Prioritize first 4 images for loading
            />
          ))}
        </div>

        {displayMode !== 'selected' && products.length >= numberOfProducts && (
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
