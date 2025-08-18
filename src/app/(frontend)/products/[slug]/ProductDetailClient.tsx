// src/app/(frontend)/products/[slug]/ProductDetailClient.tsx - FIXED VERSION
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product, Media } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'
import { RequestQuoteButton } from '@/components/RequestQuote/RequestQuoteButton'
import { ProductCard } from '@/components/ProductCard'
import { RichText } from '@payloadcms/richtext-lexical/react' // FIXED: Use RichText instead of serialize

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  relatedProducts,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Combine main image with additional images
  const allImages = [product.image, ...(product.images?.map((img) => img.image) || [])].filter(
    Boolean,
  )

  // Get variant data from product or use defaults
  const availableSizes = product.availableVariants?.sizes?.map((s) => s.sizeLabel) || [
    'Small (15x15 cm)',
    'Medium (25x25 cm)',
    'Large (35x35 cm)',
    'Custom Size Available',
  ]

  const availableColors = product.availableVariants?.colors?.map((c) => c.colorLabel) || [
    'Traditional Gold',
    'Silver Accent',
    'Colorful Glass',
    'Natural Wood Finish',
    'Antique Brass',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-amber-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-amber-600">
              Shop
            </Link>
            <span>/</span>
            {product.category && typeof product.category === 'object' && (
              <>
                <span className="hover:text-amber-600">{product.category.title}</span>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 border">
              {allImages[selectedImageIndex] &&
                typeof allImages[selectedImageIndex] === 'object' && (
                  <MediaComponent
                    resource={allImages[selectedImageIndex] as Media}
                    className="object-cover w-full h-full"
                    priority
                  />
                )}

              {/* Featured badge */}
              {product.featured && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  Featured Artwork
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 relative overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-amber-500 ring-2 ring-amber-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {image && typeof image === 'object' && (
                      <MediaComponent
                        resource={image as Media}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Category and Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {product.category && typeof product.category === 'object' && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-amber-100 text-amber-800 rounded-full">
                    {product.category.title}
                  </span>
                )}
                {product.tags &&
                  product.tags.map((tagItem, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tagItem.tag}
                    </span>
                  ))}
              </div>

              {/* Short Description */}
              {product.description && (
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Artwork Details */}
            {product.artworkDetails && (
              <div className="space-y-4 bg-white p-6 rounded-lg border">
                <h3 className="text-xl font-semibold text-gray-900">Artwork Information</h3>

                {/* Materials */}
                {product.artworkDetails.materials &&
                  product.artworkDetails.materials.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Materials Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.artworkDetails.materials.map((materialItem, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium capitalize"
                          >
                            {materialItem.customMaterial || materialItem.material.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Technique */}
                {product.artworkDetails.technique && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Technique:</h4>
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                      {product.artworkDetails.technique.replace('-', ' ')}
                    </span>
                  </div>
                )}

                {/* Origin */}
                {product.artworkDetails.origin && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Style:</h4>
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize">
                      {product.artworkDetails.origin}
                    </span>
                  </div>
                )}

                {/* Creation Time */}
                {product.artworkDetails.timeToCreate && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Creation Time:</h4>
                    <p className="text-gray-700">{product.artworkDetails.timeToCreate}</p>
                  </div>
                )}

                {/* Customization */}
                {product.artworkDetails.customizable && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      <span className="font-medium text-amber-900">Customization Available</span>
                    </div>
                    <p className="text-amber-800 text-sm mt-1">
                      This artwork can be customized according to your preferences. Contact us for
                      personalization options.
                    </p>
                  </div>
                )}
              </div>
            )}
            {/* Product Variants - Informational Only */}
            <div className="space-y-6 bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-gray-900">Available Options</h3>

              {/* Sizes */}
              {availableSizes.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Available Sizes:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableSizes.map((size, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">{size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors/Finishes */}
              {availableColors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Available Finishes:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableColors.map((color, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Care Instructions */}
            {product.careInstructions && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Care & Maintenance</h3>
                <div className="space-y-4">
                  {product.careInstructions.cleaningInstructions && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Cleaning Instructions:</h4>
                      <p className="text-gray-700 text-sm">
                        {product.careInstructions.cleaningInstructions}
                      </p>
                    </div>
                  )}
                  {product.careInstructions.handlingTips && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Handling Tips:</h4>
                      <p className="text-gray-700 text-sm">
                        {product.careInstructions.handlingTips}
                      </p>
                    </div>
                  )}
                  {product.careInstructions.durability && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Durability:</h4>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          product.careInstructions.durability === 'delicate'
                            ? 'bg-red-100 text-red-800'
                            : product.careInstructions.durability === 'moderate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product.careInstructions.durability.charAt(0).toUpperCase() +
                          product.careInstructions.durability.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dimensions */}
            {product.dimensions && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Dimensions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.dimensions.width && (
                    <div>
                      <span className="text-sm text-gray-600">Width:</span>
                      <p className="font-medium">{product.dimensions.width} cm</p>
                    </div>
                  )}
                  {product.dimensions.height && (
                    <div>
                      <span className="text-sm text-gray-600">Height:</span>
                      <p className="font-medium">{product.dimensions.height} cm</p>
                    </div>
                  )}
                  {product.dimensions.depth && (
                    <div>
                      <span className="text-sm text-gray-600">Depth:</span>
                      <p className="font-medium">{product.dimensions.depth} cm</p>
                    </div>
                  )}
                  {product.dimensions.weight && (
                    <div>
                      <span className="text-sm text-gray-600">Weight:</span>
                      <p className="font-medium">{product.dimensions.weight} kg</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Request Quote Button */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Interested in this piece?</h3>
                <p className="text-gray-600">
                  Each artwork is handcrafted with care. Contact us for pricing and customization
                  options.
                </p>
                <RequestQuoteButton product={product} size="lg" variant="primary" fullWidth />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        {product.fullDescription && (
          <div className="mb-16">
            <div className="bg-white rounded-lg p-8 border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Artwork</h2>
              <div className="prose prose-lg max-w-none">
                {/* FIXED: Use RichText component instead of serialize */}
                <RichText data={product.fullDescription} />
              </div>

              {/* Thikri Information */}
              <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="text-xl font-semibold text-amber-900 mb-3">About Thikri Art</h3>
                <p className="text-amber-800 leading-relaxed">
                  Thikri is a traditional art form that involves the intricate process of inlaying
                  small pieces of glass, metal, and sometimes wood to create stunning decorative
                  patterns. This centuries-old technique requires exceptional skill and patience,
                  with each piece being carefully placed by hand to create beautiful,
                  light-reflecting surfaces that bring any space to life.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Related Artworks</h2>
              <Link
                href="/shop"
                className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  showDescription={false}
                  showRequestQuote={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
