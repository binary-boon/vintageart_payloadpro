import React, { useEffect, useRef, useState } from 'react'
import { LightGallery } from 'lightgallery/lightgallery'
import lgAutoplay from 'lightgallery/plugins/autoplay'
import lgFullscreen from 'lightgallery/plugins/fullscreen'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'

// Import LightGallery CSS
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'

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

interface FilteredGalleryProps {
  images: GalleryImage[]
  categories: Category[]
  className?: string
}

export const FilteredGallery: React.FC<FilteredGalleryProps> = ({
  images,
  categories,
  className = '',
}) => {
  const lightboxRef = useRef<HTMLDivElement>(null)
  const galleryInstance = useRef<LightGallery | null>(null) // Fixed: removed extra >
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(images)

  // Filter images based on active category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredImages(images)
    } else {
      const filtered = images.filter((image) => image.category?.slug === activeCategory)
      setFilteredImages(filtered)
    }
  }, [activeCategory, images])

  // Reinitialize lightgallery when filtered images change
  useEffect(() => {
    if (galleryInstance.current) {
      galleryInstance.current.destroy()
      galleryInstance.current = null
    }

    if (lightboxRef.current && filteredImages.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        import('lightgallery').then(({ default: lightGallery }) => {
          const lgSettings = {
            plugins: [lgThumbnail, lgZoom, lgAutoplay, lgFullscreen],
            speed: 500,
            thumbnail: true,
            animateThumb: false,
            zoomFromOrigin: false,
            allowMediaOverlap: true,
            toggleThumb: true,
          }

          const settings = {
            ...lgSettings,
            thumbWidth: 80,
            thumbHeight: 80,
            thumbMargin: 5,
            licenseKey: 'GPLv3',
          }

          if (lightboxRef.current) {
            galleryInstance.current = lightGallery(lightboxRef.current, settings as any)
          }
        })
      }, 100)
    }

    return () => {
      if (galleryInstance.current) {
        galleryInstance.current.destroy()
        galleryInstance.current = null
      }
    }
  }, [filteredImages])

  // Get category counts
  const getCategoryCount = (categorySlug: string) => {
    if (categorySlug === 'all') return images.length
    return images.filter((image) => image.category?.slug === categorySlug).length
  }

  // Styles
  const filterButtonsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '32px',
    justifyContent: 'center',
  }

  const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '12px 24px',
    border: isActive ? '2px solid #8B4513' : '2px solid #ddd',
    backgroundColor: isActive ? '#8B4513' : 'white',
    color: isActive ? 'white' : '#333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  })

  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    padding: '20px 0',
  }

  const itemStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '280px',
    overflow: 'hidden',
    borderRadius: '12px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    backgroundColor: '#f8f8f8',
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.4s ease',
  }

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 69, 19, 0)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease',
    opacity: 0,
  }

  const categoryTagStyle: React.CSSProperties = {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(139, 69, 19, 0.9)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
  }

  const noResultsStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  }

  return (
    <div className={`vintage-filtered-gallery ${className}`}>
      {/* Category Filters */}
      <div style={filterButtonsStyle}>
        <button
          style={filterButtonStyle(activeCategory === 'all')}
          onClick={() => setActiveCategory('all')}
          onMouseEnter={(e) => {
            if (activeCategory !== 'all') {
              e.currentTarget.style.backgroundColor = '#f5f5f5'
              e.currentTarget.style.borderColor = '#8B4513'
            }
          }}
          onMouseLeave={(e) => {
            if (activeCategory !== 'all') {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.borderColor = '#ddd'
            }
          }}
        >
          <span>All Artworks</span>
          <span
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '2px 6px',
              borderRadius: '10px',
              fontSize: '12px',
            }}
          >
            {getCategoryCount('all')}
          </span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            style={filterButtonStyle(activeCategory === category.slug)}
            onClick={() => setActiveCategory(category.slug)}
            onMouseEnter={(e) => {
              if (activeCategory !== category.slug) {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.borderColor = '#8B4513'
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== category.slug) {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#ddd'
              }
            }}
          >
            <span>{category.title}</span>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '12px',
              }}
            >
              {getCategoryCount(category.slug)}
            </span>
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredImages.length > 0 ? (
        <div ref={lightboxRef} style={containerStyle}>
          {filteredImages.map((image, index) => (
            <div
              key={`${image.id}-${activeCategory}`}
              className="vintage-gallery-item"
              data-src={image.src}
              data-sub-html={`<h4>${image.alt}</h4>${image.category ? `<p>Category: ${image.category.title}</p>` : ''}`}
              style={itemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.25)'
                const img = e.currentTarget.querySelector('img') as HTMLImageElement
                if (img) img.style.transform = 'scale(1.1)'
                const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement
                if (overlay) {
                  overlay.style.backgroundColor = 'rgba(139, 69, 19, 0.8)'
                  overlay.style.opacity = '1'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
                const img = e.currentTarget.querySelector('img') as HTMLImageElement
                if (img) img.style.transform = 'scale(1)'
                const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement
                if (overlay) {
                  overlay.style.backgroundColor = 'rgba(139, 69, 19, 0)'
                  overlay.style.opacity = '0'
                }
              }}
            >
              {image.category && <div style={categoryTagStyle}>{image.category.title}</div>}

              <img src={image.thumb} alt={image.alt} style={imageStyle} loading="lazy" />

              <div className="overlay" style={overlayStyle}>
                <div style={{ color: 'white', textAlign: 'center' }}>
                  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px', fontWeight: '500' }}>
                    View Full Size
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={noResultsStyle}>
          <h3>No artworks found</h3>
          <p>There are no artworks in the selected category.</p>
        </div>
      )}

      {/* Results Counter */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '32px',
          color: '#666',
          fontSize: '14px',
        }}
      >
        Showing {filteredImages.length} of {images.length} artworks
        {activeCategory !== 'all' && (
          <span> in {categories.find((c) => c.slug === activeCategory)?.title}</span>
        )}
      </div>
    </div>
  )
}
