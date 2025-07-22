import React, { useEffect, useRef } from 'react'
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
  src: string
  thumb: string
  alt: string
}

interface GalleryProps {
  images: GalleryImage[]
  className?: string
}

export const Gallery: React.FC<GalleryProps> = ({ images, className = '' }) => {
  const lightboxRef = useRef<HTMLDivElement>(null)
  const galleryInstance = useRef<LightGallery | null>(null)

  useEffect(() => {
    if (lightboxRef.current && !galleryInstance.current) {
      // Initialize LightGallery
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

        // Add thumbnail settings conditionally to avoid type conflicts
        const settings = {
          ...lgSettings,
          thumbWidth: 80,
          thumbHeight: 80,
          thumbMargin: 5,
          licenseKey: 'GPLv3', // Use GPLv3 for open source projects
        }

        galleryInstance.current = lightGallery(lightboxRef.current!, settings as any)
      })
    }

    return () => {
      if (galleryInstance.current) {
        galleryInstance.current.destroy()
        galleryInstance.current = null
      }
    }
  }, [])

  // Inline styles to prevent conflicts
  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
    padding: '16px',
  }

  const itemStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '250px',
    overflow: 'hidden',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'opacity 0.3s ease',
  }

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease',
  }

  return (
    <div className={`vintage-gallery-container ${className}`}>
      <div ref={lightboxRef} style={containerStyle}>
        {images.map((image, index) => (
          <div
            key={index}
            className="vintage-gallery-item"
            data-src={image.src}
            data-sub-html={`<h4>${image.alt}</h4>`}
            style={itemStyle}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <img src={image.thumb} alt={image.alt} style={imageStyle} loading="lazy" />
            <div style={overlayStyle}>
              <div style={{ color: 'white', opacity: 0.8 }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
