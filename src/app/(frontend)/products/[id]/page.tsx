// src/app/(frontend)/products/[id]/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { Product, Media } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'
import { Button } from '@/components/Button'
import { generateMeta } from '@/utilities/generateMeta'

interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params

  let product: Product | null = null

  try {
    const payload = await getPayload({ config })
    product = await payload.findByID({
      collection: 'products',
      id,
      depth: 2,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
  }

  if (!product) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-lg">
          {product.image && typeof product.image === 'object' && (
            <MediaComponent
              resource={product.image as Media}
              className="object-cover w-full h-full"
              priority
            />
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {product.price && (
              <p className="text-3xl font-bold text-blue-600 mb-6">${product.price}</p>
            )}
          </div>

          {product.description && (
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button appearance="primary" size="large" className="w-full">
              Add to Cart
            </Button>

            <Button appearance="secondary" size="large" className="w-full">
              Add to Wishlist
            </Button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Product ID:</span>
                <p className="font-medium">{product.id}</p>
              </div>

              <div>
                <span className="text-gray-600">Created:</span>
                <p className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params

  let product: Product | null = null

  try {
    const payload = await getPayload({ config })
    product = await payload.findByID({
      collection: 'products',
      id,
      depth: 2,
    })
  } catch (error) {
    console.error('Error fetching product for metadata:', error)
  }

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return generateMeta({
    title: product.name,
    description: product.description || `View details for ${product.name}`,
    image:
      product.image && typeof product.image === 'object' ? (product.image as Media) : undefined,
  })
}
