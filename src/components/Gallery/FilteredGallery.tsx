'use client'

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
  }
}

interface Category {
  id: string
  title: string
  slug: string
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
  const galleryInstance = useRef<LightGallery | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(images)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Filter images based on active category
  useEffect(() => {
    setIsTransitioning(true)

    // Add a small delay for smooth transition
    setTimeout(() => {
      if (activeCategory === 'all') {
        setFilteredImages(images)
      } else {
        const filtered = images.filter((image) => image.category?.slug === activeCategory)
        setFilteredImages(filtered)
      }
      setIsTransitioning(false)
    }, 150)
  }, [activeCategory, images])

  // Initialize/reinitialize lightgallery when filtered images change
  useEffect(() => {
    // Destroy existing instance
    if (galleryInstance.current) {
      galleryInstance.current.destroy()
      galleryInstance.current = null
    }

    // Only initialize if we have images and the transition is complete
    if (lightboxRef.current && filteredImages.length > 0 && !isTransitioning) {
      // Small delay to ensure DOM is fully updated
      const timeoutId = setTimeout(() => {
        import('lightgallery').then(({ default: lightGallery }) => {
          if (lightboxRef.current) {
            const lgSettings = {
              plugins: [lgThumbnail, lgZoom, lgAutoplay, lgFullscreen],
              speed: 500,
              thumbnail: true,
              animateThumb: false,
              zoomFromOrigin: false,
              allowMediaOverlap: true,
              toggleThumb: true,
              thumbWidth: 80,
              thumbHeight: 80,
              thumbMargin: 5,
              licenseKey: 'GPLv3',
            }

            galleryInstance.current = lightGallery(lightboxRef.current, lgSettings as any)
          }
        })
      }, 200)

      return () => clearTimeout(timeoutId)
    }
  }, [filteredImages, isTransitioning])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (galleryInstance.current) {
        galleryInstance.current.destroy()
        galleryInstance.current = null
      }
    }
  }, [])

  // Handle category change
  const handleCategoryChange = (categorySlug: string) => {
    if (categorySlug !== activeCategory) {
      setActiveCategory(categorySlug)
    }
  }

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
    padding: '20px',
    backgroundColor: '#f8f4f0',
    borderRadius: '12px',
  }

  const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '14px 28px',
    border: isActive ? '2px solid #8B4513' : '2px solid #ddd',
    backgroundColor: isActive ? '#8B4513' : 'white',
    color: isActive ? 'white' : '#333',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: isActive ? '600' : '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: isActive ? '0 4px 12px rgba(139, 69, 19, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.1)',
    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
  })

  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    padding: '20px 0',
    opacity: isTransitioning ? 0.5 : 1,
    transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
    transition: 'all 0.3s ease',
  }

  const itemStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '300px',
    overflow: 'hidden',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: '#f8f8f8',
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
    transition: 'all 0.3s ease',
    opacity: 0,
  }

  const categoryTagStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: 'rgba(139, 69, 19, 0.95)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  }

  const noResultsStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    border: '2px dashed #ddd',
  }

  const countBadgeStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    minWidth: '20px',
    textAlign: 'center',
  }

  return (
    <div className={`vintage-filtered-gallery ${className}`}>
      {/* Category Filters */}
      <div style={filterButtonsStyle}>
        <button
          style={filterButtonStyle(activeCategory === 'all')}
          onClick={() => handleCategoryChange('all')}
          onMouseEnter={(e) => {
            if (activeCategory !== 'all') {
              e.currentTarget.style.backgroundColor = '#f5f5f5'
              e.currentTarget.style.borderColor = '#8B4513'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }
          }}
          onMouseLeave={(e) => {
            if (activeCategory !== 'all') {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.borderColor = '#ddd'
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          <span>All Artworks</span>
          <span style={countBadgeStyle}>{getCategoryCount('all')}</span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            style={filterButtonStyle(activeCategory === category.slug)}
            onClick={() => handleCategoryChange(category.slug)}
            onMouseEnter={(e) => {
              if (activeCategory !== category.slug) {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.borderColor = '#8B4513'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== category.slug) {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#ddd'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            <span>{category.title}</span>
            <span style={countBadgeStyle}>{getCategoryCount(category.slug)}</span>
          </button>
        ))}
      </div>

      {/* Active Filter Indicator */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '24px',
          fontSize: '16px',
          color: '#8B4513',
          fontWeight: '500',
        }}
      >
        {activeCategory === 'all'
          ? `Showing all ${filteredImages.length} artworks`
          : `Showing ${filteredImages.length} ${categories.find((c) => c.slug === activeCategory)?.title || 'artworks'}`}
      </div>

      {/* Gallery Grid */}
      {filteredImages.length > 0 ? (
        <div
          ref={lightboxRef}
          style={containerStyle}
          key={`gallery-${activeCategory}-${filteredImages.length}`} // Force re-render
        >
          {filteredImages.map((image, index) => (
            <div
              key={`${image.id}-${activeCategory}-${index}`}
              className="vintage-gallery-item"
              data-src={image.src}
              data-sub-html={`<h4>${image.alt}</h4>${image.category ? `<p>Category: ${image.category.title}</p>` : ''}`}
              style={itemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.25)'
                const img = e.currentTarget.querySelector('img') as HTMLImageElement
                if (img) img.style.transform = 'scale(1.1)'
                const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement
                if (overlay) {
                  overlay.style.backgroundColor = 'rgba(139, 69, 19, 0.85)'
                  overlay.style.opacity = '1'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
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
                  <svg width="56" height="56" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                  <p style={{ margin: '12px 0 0 0', fontSize: '16px', fontWeight: '600' }}>
                    View Full Size
                  </p>
                  {image.category && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                      {image.category.title}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={noResultsStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
          <h3 style={{ margin: '0 0 12px 0', color: '#8B4513' }}>No artworks found</h3>
          <p style={{ margin: '0', fontSize: '16px' }}>
            There are no artworks in the{' '}
            <strong>{categories.find((c) => c.slug === activeCategory)?.title}</strong> category
            yet.
          </p>
          <button
            onClick={() => handleCategoryChange('all')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#8B4513',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            View All Artworks
          </button>
        </div>
      )}

      {/* Loading indicator during transition */}
      {isTransitioning && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #8B4513',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
