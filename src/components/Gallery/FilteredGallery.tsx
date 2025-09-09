'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

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
  debug?: any
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
  const galleryInstanceRef = useRef<any>(null)
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(images)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [isGalleryReady, setIsGalleryReady] = useState(false)

  // Memoized filter function
  const filterImages = useCallback((categorySlug: string, allImages: GalleryImage[]) => {
    if (categorySlug === 'all') {
      return allImages
    }
    return allImages.filter((image) => image.category?.slug === categorySlug)
  }, [])

  // Filter images based on active category
  useEffect(() => {
    setIsTransitioning(true)
    setIsGalleryReady(false)

    // Clear any existing timeout
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current)
    }

    // Add transition delay for smooth UX
    const transitionTimeout = setTimeout(() => {
      const newFiltered = filterImages(activeCategory, images)
      setFilteredImages(newFiltered)
      setIsTransitioning(false)

      // Set gallery ready after images are filtered
      setTimeout(() => setIsGalleryReady(true), 100)
    }, 200)

    return () => clearTimeout(transitionTimeout)
  }, [activeCategory, images, filterImages])

  // Handle image loading errors
  const handleImageError = useCallback((imageId: string) => {
    console.warn(`Image failed to load: ${imageId}`)
    setImageErrors((prev) => new Set(prev).add(imageId))
  }, [])

  // Handle image load success
  const handleImageLoad = useCallback((imageId: string) => {
    setImageErrors((prev) => {
      const newSet = new Set(prev)
      newSet.delete(imageId)
      return newSet
    })
  }, [])

  // Destroy gallery instance
  const destroyGallery = useCallback(() => {
    if (galleryInstanceRef.current) {
      try {
        galleryInstanceRef.current.destroy(true)
        console.log('Gallery destroyed successfully')
      } catch (error) {
        console.warn('Error destroying gallery:', error)
      } finally {
        galleryInstanceRef.current = null
      }
    }
  }, [])

  // Initialize lightgallery with corrected imports
  const initializeGallery = useCallback(() => {
    if (!lightboxRef.current || !isGalleryReady || filteredImages.length === 0) {
      return
    }

    // Destroy existing instance first
    destroyGallery()

    // Clear any existing timeout
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current)
    }

    // Initialize with delay to ensure DOM is ready
    initTimeoutRef.current = setTimeout(async () => {
      try {
        // Import LightGallery - use dynamic import for better compatibility
        const { default: lightGallery } = await import('lightgallery')

        // Import plugins with proper destructuring
        const { default: lgThumbnail } = await import('lightgallery/plugins/thumbnail')
        const { default: lgZoom } = await import('lightgallery/plugins/zoom')
        const { default: lgFullscreen } = await import('lightgallery/plugins/fullscreen')

        if (lightboxRef.current && isGalleryReady) {
          // Ensure we have gallery items
          const galleryItems = lightboxRef.current.querySelectorAll('.vintage-gallery-item')

          if (galleryItems.length === 0) {
            console.warn('No gallery items found with selector .vintage-gallery-item')
            return
          }

          console.log(`Found ${galleryItems.length} gallery items`)

          const lgSettings: any = {
            plugins: [lgThumbnail, lgZoom, lgFullscreen],
            speed: 400,
            thumbnail: true,
            animateThumb: false,
            zoomFromOrigin: false,
            allowMediaOverlap: true,
            toggleThumb: true,
            thumbWidth: '100px',
            thumbHeight: '80px',
            thumbMargin: 8,
            licenseKey: 'GPLv3',
            // Ensure proper selector
            selector: '.vintage-gallery-item',
            // Essential settings for proper functionality
            download: false,
            counter: true,
            controls: true,
            getCaptionFromTitleOrAlt: false,
            // Mobile optimizations
            swipeThreshold: 50,
            enableSwipe: true,
            enableDrag: true,
            // Performance settings
            preload: 2,
            hideScrollbar: true,
            closable: true,
            escKey: true,
            keyPress: true,
            mousewheel: false,
            // Use correct mode
            mode: 'lg-slide',
          }

          console.log('Initializing LightGallery with settings:', lgSettings)
          console.log('Gallery container:', lightboxRef.current)

          // Initialize gallery
          galleryInstanceRef.current = lightGallery(lightboxRef.current, lgSettings)

          // Verify initialization
          if (galleryInstanceRef.current) {
            console.log('LightGallery instance created:', galleryInstanceRef.current)

            // Add event listeners for debugging
            const container = lightboxRef.current

            const handleBeforeOpen = () => {
              console.log('LightGallery: Opening...')
            }

            const handleAfterOpen = () => {
              console.log('LightGallery: Opened successfully')
            }

            const handleBeforeClose = () => {
              console.log('LightGallery: Closing...')
            }

            container.addEventListener('lgBeforeOpen', handleBeforeOpen)
            container.addEventListener('lgAfterOpen', handleAfterOpen)
            container.addEventListener('lgBeforeClose', handleBeforeClose)

            // Test click handler
            container.addEventListener('click', (e) => {
              console.log('Container clicked:', e.target)
              const galleryItem = (e.target as Element).closest('.vintage-gallery-item')
              if (galleryItem) {
                console.log('Gallery item clicked:', galleryItem)
              }
            })

            console.log('LightGallery initialized successfully with event listeners')
          } else {
            console.error('Failed to create LightGallery instance')
          }
        }
      } catch (error: unknown) {
        console.error('Failed to initialize LightGallery:', error)
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
          })
        } else {
          console.error('Unknown error type:', error)
        }
      }
    }, 300)
  }, [isGalleryReady, filteredImages.length, destroyGallery])

  // Initialize/reinitialize gallery when conditions are met
  useEffect(() => {
    initializeGallery()

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, [initializeGallery])

  // Force re-initialization after initial load when all images are ready
  useEffect(() => {
    if (activeCategory === 'all' && filteredImages.length > 0) {
      // Wait for images to load, then force re-init
      const checkAndReinit = () => {
        const images = document.querySelectorAll('.vintage-gallery-item img')
        const allLoaded = Array.from(images).every((img) => (img as HTMLImageElement).complete)

        if (allLoaded) {
          console.log('All images loaded on initial render, forcing re-initialization...')
          setTimeout(() => {
            setIsGalleryReady(false)
            setTimeout(() => setIsGalleryReady(true), 100)
          }, 500)
        }
      }

      // Check immediately and also after a delay
      setTimeout(checkAndReinit, 1000)
      setTimeout(checkAndReinit, 2000)
    }
  }, [filteredImages.length]) // Only run when images length changes on initial load

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroyGallery()
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, [destroyGallery])

  // Handle category change with better UX
  const handleCategoryChange = useCallback(
    (categorySlug: string) => {
      if (categorySlug !== activeCategory && !isTransitioning) {
        console.log(`Switching category from ${activeCategory} to ${categorySlug}`)
        setActiveCategory(categorySlug)
      }
    },
    [activeCategory, isTransitioning],
  )

  // Get category counts with error filtering
  const getCategoryCount = useCallback(
    (categorySlug: string) => {
      const filteredForCount = filterImages(categorySlug, images)
      return filteredForCount.filter((img) => !imageErrors.has(img.id)).length
    },
    [images, imageErrors, filterImages],
  )

  // Filter out error images for display
  const displayImages = filteredImages.filter((img) => !imageErrors.has(img.id))

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
    cursor: isTransitioning ? 'not-allowed' : 'pointer',
    fontSize: '15px',
    fontWeight: isActive ? '600' : '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: isActive ? '0 4px 12px rgba(139, 69, 19, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.1)',
    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
    opacity: isTransitioning ? 0.7 : 1,
  })

  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    padding: '20px 0',
    opacity: isTransitioning ? 0.4 : 1,
    transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: isTransitioning ? 'none' : 'auto',
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
    pointerEvents: 'none', // This is important - prevents overlay from blocking clicks
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
    zIndex: 2,
    pointerEvents: 'none', // Prevents the tag from blocking clicks
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

  const noResultsStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    border: '2px dashed #ddd',
  }

  return (
    <div className={`vintage-filtered-gallery ${className}`}>
      {/* Category Filters */}
      <div style={filterButtonsStyle}>
        <button
          style={filterButtonStyle(activeCategory === 'all')}
          onClick={() => handleCategoryChange('all')}
          disabled={isTransitioning}
          onMouseEnter={(e) => {
            if (activeCategory !== 'all' && !isTransitioning) {
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
            disabled={isTransitioning}
            onMouseEnter={(e) => {
              if (activeCategory !== category.slug && !isTransitioning) {
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
          ? `Showing all ${displayImages.length} artworks`
          : `Showing ${displayImages.length} ${categories.find((c) => c.slug === activeCategory)?.title || 'artworks'}`}
        {/* {imageErrors.size > 0 && (
          <span style={{ fontSize: '14px', color: '#e74c3c', marginLeft: '8px' }}>
            ({imageErrors.size} failed to load)
          </span>
        )} */}
      </div>

      {/* Loading indicator during transition */}
      {isTransitioning && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #8B4513',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ fontSize: '16px', color: '#8B4513', fontWeight: '500' }}>
            Loading gallery...
          </span>
        </div>
      )}

      {/* Gallery Grid */}
      {displayImages.length > 0 ? (
        <div
          ref={lightboxRef}
          style={containerStyle}
          key={`gallery-${activeCategory}-${displayImages.length}-${isGalleryReady}`}
        >
          {displayImages.map((image, index) => (
            <div
              key={`${image.id}-${activeCategory}-${index}`}
              className="vintage-gallery-item"
              data-src={image.src}
              data-sub-html={`<h4>${image.alt}</h4>${image.category ? `<p>Category: ${image.category.title}</p>` : ''}`}
              style={itemStyle}
              onMouseEnter={(e) => {
                if (!isTransitioning) {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.25)'
                  const img = e.currentTarget.querySelector('img') as HTMLImageElement
                  if (img) img.style.transform = 'scale(1.1)'
                  const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement
                  if (overlay) {
                    overlay.style.backgroundColor = 'rgba(139, 69, 19, 0.85)'
                    overlay.style.opacity = '1'
                  }
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

              <img
                src={image.thumb}
                alt={image.alt}
                style={imageStyle}
                loading="lazy"
                onError={() => handleImageError(image.id)}
                onLoad={() => handleImageLoad(image.id)}
              />

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
            {imageErrors.size > 0
              ? `All images in this category failed to load. Please check your media configuration.`
              : `There are no artworks in the ${categories.find((c) => c.slug === activeCategory)?.title || 'selected'} category yet.`}
          </p>
          <button
            onClick={() => handleCategoryChange('all')}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: '#8B4513',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5d2e0b'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8B4513'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            View All Artworks
          </button>
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
