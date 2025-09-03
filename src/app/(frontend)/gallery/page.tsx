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
    // Fetch artwork categories
    const categoriesResult = await payload.find({
      collection: 'categories',
      where: {
        type: {
          equals: 'artwork',
        },
      },
      sort: 'title',
    })

    // Fetch gallery images with stricter filtering
    const mediaResult = await payload.find({
      collection: 'media',
      where: {
        and: [
          { isGalleryImage: { equals: true } },
          { url: { exists: true } }, // Ensure URL field exists
          { url: { not_equals: null } }, // Ensure URL is not null
          { url: { not_equals: '' } }, // Ensure URL is not empty string
        ],
      },
      sort: '-galleryOrder',
      limit: 200,
      depth: 2,
    })

    console.log(`Found ${mediaResult.docs.length} gallery images from database`)

    // Transform and filter media data with comprehensive validation
    const validImages: GalleryImage[] = []

    for (const item of mediaResult.docs as Media[]) {
      // Skip items with invalid URLs
      if (!item.url || item.url === 'null' || item.url === 'undefined' || item.url.trim() === '') {
        console.warn(`Skipping media ${item.id} - invalid URL:`, item.url)
        continue
      }

      const baseUrl = getMediaUrl(item.url)
      if (!baseUrl) {
        console.warn(`Skipping media ${item.id} - could not generate base URL`)
        continue
      }

      const thumbnailUrl = getThumbnailUrl(item)
      if (!thumbnailUrl) {
        console.warn(`Skipping media ${item.id} - could not generate thumbnail URL`)
        continue
      }

      // Handle category relationship safely
      let category = undefined
      if (item.category && typeof item.category === 'object' && 'id' in item.category) {
        category = {
          id: item.category.id,
          title: item.category.title || 'Untitled',
          slug: item.category.slug || 'uncategorized',
        }
      }

      // Create valid gallery image
      validImages.push({
        id: item.id,
        src: baseUrl,
        thumb: thumbnailUrl,
        alt: item.alt || `Vintage Artwork ${item.id}`,
        category,
      })
    }

    console.log(
      `Processed ${validImages.length} valid images out of ${mediaResult.docs.length} total`,
    )

    // Transform categories data
    const categories: CategoryType[] = categoriesResult.docs.map((cat: Category) => ({
      id: cat.id,
      title: cat.title || 'Untitled Category',
      slug: cat.slug || 'uncategorized',
    }))

    return { images: validImages, categories }
  } catch (error) {
    console.error('Error fetching gallery data:', error)
    return { images: [], categories: [] }
  }
}

export default async function GalleryPage() {
  const { images, categories } = await getGalleryData()

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
        </div>
      </div>

      {/* Gallery Section */}
      <div className={styles.gallerySection}>
        {images.length > 0 ? (
          <FilteredGallery images={images} categories={categories} className="mb-8" />
        ) : (
          <div className={styles.noImages}>
            <h3>No Valid Gallery Images Found</h3>
            <p>
              Upload images through the Payload admin dashboard and ensure they have valid URLs.
              Mark them as gallery images to display them here.
            </p>
            <div className={styles.instructionsList}>
              <h4>Troubleshooting Steps:</h4>
              <ol>
                <li>Check that images uploaded successfully to S3</li>
                <li>Ensure "Display in Gallery" option is checked</li>
                <li>Verify images have valid URLs in the media collection</li>
                <li>Select appropriate artwork categories</li>
                <li>Save and refresh the page</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

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
