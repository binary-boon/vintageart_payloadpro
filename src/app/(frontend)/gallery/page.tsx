'use client'

import React, { useEffect, useState } from 'react'
import { FilteredGallery } from '../../../components/Gallery/FilteredGallery'
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
  } | null
}

interface Category {
  id: string
  title: string
  slug: string
  description?: string
}

interface GalleryData {
  images: GalleryImage[]
  categories: Category[]
  pagination: {
    totalDocs: number
    totalPages: number
    page: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function GalleryPage() {
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/gallery')

        if (!response.ok) {
          throw new Error('Failed to fetch gallery data')
        }

        const data: GalleryData = await response.json()
        setGalleryData(data)
      } catch (err) {
        console.error('Error fetching gallery data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryData()
  }, [])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Vintage Art Gallery</h1>
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading gallery...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Vintage Art Gallery</h1>
            <div className={styles.error}>
              <p>Error: {error}</p>
              <button onClick={() => window.location.reload()} className={styles.retryButton}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!galleryData || galleryData.images.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Vintage Art Gallery</h1>
            <div className={styles.noImages}>
              <p>No gallery images found. Please add some images through the admin panel.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Vintage Art Gallery</h1>
          <p className={styles.subtitle}>
            Discover our curated collection of {galleryData.images.length} vintage artworks. Click
            on any image to view in full detail.
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className={styles.gallerySection}>
        <FilteredGallery
          images={galleryData.images}
          categories={galleryData.categories}
          className="mb-8"
        />
      </div>

      {/* Gallery Stats */}
      <div className={styles.galleryStats}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{galleryData.images.length}</div>
            <div className={styles.statLabel}>Artworks</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{galleryData.categories.length}</div>
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
      </div>
    </div>
  )
}
