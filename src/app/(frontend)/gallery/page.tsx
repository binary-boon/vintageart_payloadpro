import React from 'react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import type { Media, Category } from '@/payload-types'
import { FilteredGallery } from '../../../components/Gallery/FilteredGallery'
import { getMediaUrl, getThumbnailUrl } from '@/utilities/getMediaUrl'

import styles from './page.module.scss'

interface GalleryImage {
  id: string
  src: string
  thumb: string
  alt: string
  category?: {
    id: string
    title: string
    slug: string
  }
}

interface CategoryType {
  id: string
  title: string
  slug: string
}

async function getGalleryData(): Promise<{
  images: GalleryImage[]
  categories: CategoryType[]
}> {
  const payload = await getPayloadHMR({
    config: configPromise,
  })

  try {
    // Fetch artwork categories with better error handling
    const categoriesResult = await payload.find({
      collection: 'categories',
      where: {
        type: {
          equals: 'artwork',
        },
      },
      sort: 'title',
      limit: 100, // Add limit to prevent issues
    })

    console.log(`Found ${categoriesResult.docs.length} artwork categories`)

    // Fetch gallery images with less strict filtering and better sorting
    const mediaResult = await payload.find({
      collection: 'media',
      where: {
        isGalleryImage: {
          equals: true,
        },
      },
      sort: ['-updatedAt', '-createdAt'], // Sort by most recently updated first
      limit: 500, // Increase limit
      depth: 2, // Ensure category is populated
    })

    console.log(`Found ${mediaResult.docs.length} gallery images from database`)

    // Log raw data for debugging
    mediaResult.docs.forEach((item: any, index: number) => {
      if (index < 3) {
        // Log first 3 items for debugging
        console.log(`Media item ${index + 1}:`, {
          id: item.id,
          alt: item.alt,
          url: item.url,
          filename: item.filename,
          isGalleryImage: item.isGalleryImage,
          category: item.category,
          updatedAt: item.updatedAt,
          createdAt: item.createdAt,
        })
      }
    })

    // Transform and filter media data with more lenient validation
    const validImages: GalleryImage[] = []

    for (const item of mediaResult.docs as Media[]) {
      // More lenient URL validation - accept any truthy URL
      if (!item.url) {
        console.warn(`Skipping media ${item.id} - no URL field:`, {
          id: item.id,
          url: item.url,
          filename: item.filename,
          alt: item.alt,
        })
        continue
      }

      // Try to get URLs with more flexible approach
      let baseUrl: string
      let thumbnailUrl: string

      try {
        baseUrl = getMediaUrl(item.url)
        if (!baseUrl) {
          // Fallback: construct URL manually if getMediaUrl fails
          if (item.url.startsWith('http')) {
            baseUrl = item.url
          } else {
            // Construct S3 URL manually
            const bucket = process.env.S3_BUCKET || 'vintageartecomm'
            const region = process.env.S3_REGION || 'ap-south-1'
            const cleanPath = item.url.startsWith('/') ? item.url.substring(1) : item.url
            const path = cleanPath.startsWith('media/') ? cleanPath : `media/${cleanPath}`
            baseUrl = `https://${bucket}.s3.${region}.amazonaws.com/${path}`
          }
        }
      } catch (error) {
        console.warn(`Error getting base URL for media ${item.id}:`, error)
        continue
      }

      try {
        thumbnailUrl = getThumbnailUrl(item)
        if (!thumbnailUrl) {
          // Fallback to base URL if thumbnail generation fails
          thumbnailUrl = baseUrl
        }
      } catch (error) {
        console.warn(`Error getting thumbnail URL for media ${item.id}:`, error)
        // Use base URL as fallback
        thumbnailUrl = baseUrl
      }

      // Handle category relationship with better error handling
      let category = undefined
      if (item.category) {
        try {
          if (typeof item.category === 'object' && 'id' in item.category) {
            // Category is populated
            category = {
              id: item.category.id,
              title: item.category.title || 'Untitled',
              slug: item.category.slug || 'uncategorized',
            }
          } else if (typeof item.category === 'string') {
            // Category is just an ID - find it in categories
            const foundCategory = categoriesResult.docs.find((cat) => cat.id === item.category)
            if (foundCategory) {
              category = {
                id: foundCategory.id,
                title: foundCategory.title || 'Untitled',
                slug: foundCategory.slug || 'uncategorized',
              }
            }
          }
        } catch (categoryError) {
          console.warn(`Error processing category for media ${item.id}:`, categoryError)
        }
      }

      // Create valid gallery image with fallback alt text
      const galleryImage: GalleryImage = {
        id: item.id,
        src: baseUrl,
        thumb: thumbnailUrl,
        alt: item.alt || `Vintage Artwork - ${item.filename || item.id}`,
        category,
      }

      validImages.push(galleryImage)

      // Log successful processing
      console.log(`Successfully processed media ${item.id}:`, {
        id: galleryImage.id,
        hasValidSrc: !!galleryImage.src,
        hasValidThumb: !!galleryImage.thumb,
        categoryTitle: galleryImage.category?.title,
        alt: galleryImage.alt,
      })
    }

    console.log(
      `Processed ${validImages.length} valid images out of ${mediaResult.docs.length} total`,
    )

    // Transform categories data
    const categories: CategoryType[] = categoriesResult.docs.map((cat: Category) => ({
      id: cat.id,
      title: cat.title || 'Untitled Category',
      slug: cat.slug || `category-${cat.id}`,
    }))

    // Sort images by updatedAt descending (newest first)
    validImages.sort((a, b) => {
      const mediaA = mediaResult.docs.find((m) => m.id === a.id) as Media
      const mediaB = mediaResult.docs.find((m) => m.id === b.id) as Media

      if (!mediaA || !mediaB) return 0

      const dateA = new Date(mediaA.updatedAt || mediaA.createdAt)
      const dateB = new Date(mediaB.updatedAt || mediaB.createdAt)

      return dateB.getTime() - dateA.getTime()
    })

    return { images: validImages, categories }
  } catch (error) {
    console.error('Error fetching gallery data:', error)
    // Return empty arrays instead of throwing
    return { images: [], categories: [] }
  }
}

export default async function GalleryPage() {
  const { images, categories } = await getGalleryData()

  // Add debug logging
  console.log('Gallery Page Render:', {
    totalImages: images.length,
    totalCategories: categories.length,
    imageIds: images.slice(0, 5).map((img) => ({ id: img.id, alt: img.alt })),
    categoryTitles: categories.map((cat) => cat.title),
  })

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Vintage Art Gallery</h1>
          <p className={styles.subtitle}>
            Discover our curated collection of {images.length} vintage artworks
            {categories.length > 0 && ` across ${categories.length} categories`}. Click on any image
            to view in full detail.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div
              style={{
                marginTop: '10px',
                fontSize: '12px',
                color: '#666',
                fontFamily: 'monospace',
              }}
            >
              Debug: Last updated at {new Date().toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      <div className={styles.gallerySection}>
        {images.length > 0 ? (
          <FilteredGallery images={images} categories={categories} className="mb-8" />
        ) : (
          <div className={styles.noImages}>
            <h3>No Gallery Images Found</h3>
            <p>
              Upload images through the Payload admin dashboard and ensure they are marked as
              gallery images.
            </p>
            <div className={styles.instructionsList}>
              <h4>Troubleshooting Steps:</h4>
              <ol>
                <li>Upload image to Media collection in Payload admin</li>
                <li>Check "Display in Gallery" (isGalleryImage) option</li>
                <li>Add alt text and select category</li>
                <li>Save the media item</li>
                <li>Refresh this page or clear browser cache</li>
                <li>Check browser console for any error messages</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Add revalidate to ensure fresh data
export const revalidate = 0 // Always fetch fresh data
// Alternative: export const revalidate = 60 // Revalidate every 60 seconds

export async function generateMetadata() {
  try {
    const { images, categories } = await getGalleryData()

    const title =
      images.length > 0 ? `Vintage Art Gallery | ${images.length} Artworks` : 'Vintage Art Gallery'

    const description =
      images.length > 0
        ? `Browse our curated collection of ${images.length} vintage artworks across ${categories.length} categories.`
        : 'Explore our vintage art collection featuring handpainted, metal, wooden, and thikri artworks.'

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)

    return {
      title: 'Vintage Art Gallery',
      description: 'Explore our vintage art collection',
    }
  }
}
