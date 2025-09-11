// src/blocks/ProductListing/Component.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Product, Page } from '@/payload-types'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/Button'
import { cn } from '@/utilities/ui'

interface ProductListingProps {
  title?: string
  description?: string
  displayMode: 'all' | 'selected' | 'latest'
  selectedProducts?: (Product | string)[]
  numberOfProducts?: number
  showDescription?: boolean
  cardsPerRow?: '2' | '3' | '4'
  className?: string
  disableInnerContainer?: boolean
  callToAction?: {
    enabled?: boolean
    label?: string
    linkType?: 'internal' | 'external'
    internalLink?: Page | string
    externalLink?: string
    openInNewTab?: boolean
    appearance?: 'primary' | 'secondary' | 'default'
  }
}

export const ProductListingComponent: React.FC<ProductListingProps> = async ({
  title,
  description,
  displayMode,
  selectedProducts = [],
  numberOfProducts = 6,
  showDescription = true,
  cardsPerRow = '3',
  className,
  disableInnerContainer,
  callToAction,
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
          {title && <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">{title}</h2>}
          {description && (
            <p className="text-lg text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              {description}
            </p>
          )}
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

  // Generate button href based on link type
  const getButtonHref = () => {
    if (!callToAction?.enabled) return ''

    if (callToAction.linkType === 'external') {
      return callToAction.externalLink || ''
    }

    if (callToAction.linkType === 'internal' && callToAction.internalLink) {
      const page =
        typeof callToAction.internalLink === 'string'
          ? callToAction.internalLink
          : callToAction.internalLink.slug
      return `/${page}`
    }

    return ''
  }

  return (
    <section className={cn('py-12 bg-gray-50', className)}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl font-bold mb-4 text-gray-900">{title}</h2>}
          {description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">{description}</p>
          )}
        </div>

        {/* Products Grid */}
        <div className={cn('grid gap-6 mb-12', getGridClasses())}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              showDescription={showDescription}
              priority={index < 4} // Prioritize first 4 images for loading
            />
          ))}
        </div>

        {/* Call to Action Button */}
        {callToAction?.enabled && callToAction.label && getButtonHref() && (
          <div className="text-center">
            <Button
              label={callToAction.label}
              href={getButtonHref()}
              appearance={callToAction.appearance || 'primary'}
              newTab={callToAction.openInNewTab}
              el={callToAction.linkType === 'external' ? 'a' : 'link'}
              className="inline-flex items-center px-8 py-3 text-lg font-medium transition-all duration-200 hover:transform hover:scale-105"
            />
          </div>
        )}

        {/* Legacy Load More Button (shown only when no CTA is enabled and conditions are met) */}
        {!callToAction?.enabled &&
          displayMode !== 'selected' &&
          products.length >= numberOfProducts && (
            <div className="text-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Load More Products
              </button>
            </div>
          )}
      </div>
    </section>
  )
}
