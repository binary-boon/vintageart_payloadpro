// src/app/(frontend)/products/[slug]/page.tsx
import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ProductDetailClient } from './ProductDetailClient'
import type { Metadata } from 'next'
import { Product } from '@/payload-types'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'products',
      where: {
        or: [{ slug: { equals: slug } }, { id: { equals: slug } }],
      },
      limit: 1,
    })

    const product = result.docs[0] as Product

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      }
    }

    return {
      title: product.seo?.title || `${product.name} - Handmade Thikri Artwork`,
      description:
        product.seo?.description ||
        product.description ||
        `Beautiful handmade Thikri artwork - ${product.name}`,
      keywords: product.seo?.keywords || 'thikri, handmade, artwork, glass, metal, wood, luxury',
      openGraph: {
        title: product.name,
        description: product.description || `Beautiful handmade Thikri artwork - ${product.name}`,
        images:
          product.image && typeof product.image === 'object'
            ? [
                {
                  url: product.image.url || '',
                  width: 1200,
                  height: 630,
                  alt: product.name,
                },
              ]
            : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  try {
    const payload = await getPayload({ config })

    // Get the product
    const result = await payload.find({
      collection: 'products',
      where: {
        or: [{ slug: { equals: slug } }, { id: { equals: slug } }],
      },
      limit: 1,
      depth: 2,
    })

    const product = result.docs[0] as Product

    if (!product) {
      notFound()
    }

    // Get related products (same category or similar tags)
    let relatedProducts: Product[] = []
    try {
      const relatedResult = await payload.find({
        collection: 'products',
        where: {
          and: [
            { id: { not_equals: product.id } },
            product.category && typeof product.category === 'object'
              ? { category: { equals: product.category.id } }
              : {},
          ],
        },
        limit: 4,
        depth: 1,
      })
      relatedProducts = relatedResult.docs as Product[]
    } catch (error) {
      console.error('Error fetching related products:', error)
    }

    return <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }
}
