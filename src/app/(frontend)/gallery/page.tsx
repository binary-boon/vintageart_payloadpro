'use client'

import React from 'react'

import { Gallery } from '../../../components/Gallery/Gallery'

import styles from './page.module.scss'

// Generate images array dynamically from vintage_art_thikri_1 to vintage_art_thikri_24
const generateVintageImages = () => {
  const images = []
  for (let i = 1; i <= 24; i++) {
    images.push({
      src: `/media/vintage_art_thikri_${i}.jpg`,
      thumb: `/media/vintage_art_thikri_${i}.jpg`, // Using same image for thumb, you can create separate thumb versions if needed
      alt: `Vintage Art Thikri ${i}`,
    })
  }
  return images
}

const vintageImages = generateVintageImages()

export default function GalleryPage() {
  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Vintage Art Gallery</h1>
          <p className={styles.subtitle}>
            Discover our curated collection of {vintageImages.length} vintage artworks. Click on any
            image to view in full detail.
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className={styles.gallerySection}>
        <Gallery images={vintageImages} className="mb-8" />
      </div>

      {/* Optional: Gallery Stats */}
      <div className={styles.galleryStats}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{vintageImages.length}</div>
            <div className={styles.statLabel}>Artworks</div>
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

      {/* Load More Button */}
      <div className={styles.loadMoreSection}>
        <button className={styles.loadMoreButton}>Load More Artworks</button>
      </div>
    </div>
  )
}
