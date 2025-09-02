import React from 'react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import type { Media, Category } from '@/payload-types'
import { FilteredGallery } from '../../../components/Gallery/FilteredGallery'
import { getMediaUrl } from '@/utilities/getMediaUrl'

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

    // Fetch gallery images with their categories
    const mediaResult = await payload.find({
      collection: 'media',
      where: {
        isGalleryImage: {
          equals: true,
        },
      },
      sort: 'galleryOrder',
      limit: 100, // Adjust as needed
      depth: 2, // To populate category relationship
    })

    // Transform media data to gallery format
    const images: GalleryImage[] = mediaResult.docs
      .filter((item: Media) => item.url) // Ensure image has URL
      .map((item: Media) => {
        const baseUrl = getMediaUrl(item.url!)
        const category =
          item.category && typeof item.category === 'object'
            ? {
                id: item.category.id,
                title: item.category.title,
                slug: item.category.slug!,
              }
            : undefined

        return {
          id: item.id,
          src: baseUrl,
          thumb: item.sizes?.medium?.url ? getMediaUrl(item.sizes.medium.url) : baseUrl,
          alt: item.alt || `Artwork ${item.id}`,
          category,
        }
      })

    // Transform categories data
    const categories: CategoryType[] = categoriesResult.docs.map((cat: Category) => ({
      id: cat.id,
      title: cat.title,
      slug: cat.slug!,
    }))

    return { images, categories }
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
            Discover our curated collection of {images.length} vintage artworks across{' '}
            {categories.length} categories. Click on any image to view in full detail.
          </p>
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
              Upload images through the Payload admin dashboard and mark them as gallery images to
              display them here.
            </p>
            <div className={styles.instructionsList}>
              <h4>To add images to the gallery:</h4>
              <ol>
                <li>Go to your Payload admin dashboard</li>
                <li>Navigate to Media collection</li>
                <li>Upload your artwork images</li>
                <li>Check "Display in Gallery" option</li>
                <li>Select the appropriate artwork category</li>
                <li>Set the gallery order number</li>
                <li>Save the changes</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Stats */}
      {images.length > 0 && (
        <>
          {/* <div className={styles.galleryStats}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{images.length}</div>
                <div className={styles.statLabel}>Total Artworks</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{categories.length}</div>
                <div className={styles.statLabel}>Categories</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>Premium</div>
                <div className={styles.statLabel}>Quality</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>Vintage</div>
                <div className={styles.statLabel}>Collection</div>
              </div>
            </div>
          </div> */}

          {/* Category Breakdown */}
          {/* <div className={styles.categoryBreakdown}>
            <h3>Collection Overview</h3>
            <div className={styles.categoryGrid}>
              {categories.map((category) => {
                const categoryCount = images.filter(
                  (img) => img.category?.slug === category.slug,
                ).length
                return (
                  <div key={category.id} className={styles.categoryCard}>
                    <h4>{category.title}</h4>
                    <p>
                      {categoryCount} {categoryCount === 1 ? 'artwork' : 'artworks'}
                    </p>
                  </div>
                )
              })}
            </div>
          </div> */}
        </>
      )}
    </div>
  )
}

// Metadata for SEO
export async function generateMetadata() {
  const { images, categories } = await getGalleryData()

  return {
    title: 'Vintage Art Gallery | Curated Collection',
    description: `Browse our curated collection of ${images.length} vintage artworks across ${categories.length} categories including handpainted, metal, wooden, and thikri art pieces.`,
    openGraph: {
      title: 'Vintage Art Gallery | Curated Collection',
      description: `Discover ${images.length} unique vintage artworks in our gallery`,
      type: 'website',
    },
  }
}
