'use client'
import React, { useEffect, useRef } from 'react'

// Import CSS - these should work as they do in your Gallery component
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-fullscreen.css'
import 'lightgallery/css/lg-thumbnail.css'

interface ImageItem {
  src: string
  thumb: string
  alt: string
  subHtml?: string
}

interface ImageLightboxProps {
  images: ImageItem[]
  children: React.ReactNode
  className?: string
  trigger?: 'click' | 'hover'
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  children,
  className = '',
  trigger = 'click',
}) => {
  const lightboxRef = useRef<HTMLDivElement>(null)
  const galleryInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (lightboxRef.current && images.length > 0 && !galleryInstanceRef.current) {
      // Dynamic import like your Gallery component
      import('lightgallery').then(async ({ default: lightGallery }) => {
        // Import plugins dynamically
        const lgZoom = (await import('lightgallery/plugins/zoom')).default
        const lgFullscreen = (await import('lightgallery/plugins/fullscreen')).default
        const lgThumbnail = (await import('lightgallery/plugins/thumbnail')).default

        const settings = {
          plugins: [lgZoom, lgFullscreen, lgThumbnail],
          speed: 500,
          // Zoom settings
          zoom: true,
          scale: 1,
          actualSize: false,
          // Fullscreen
          fullScreen: true,
          // Thumbnail settings
          thumbnail: images.length > 1,
          thumbWidth: 60,
          thumbMargin: 5,
          // Mobile optimizations
          mobileSettings: {
            controls: true,
            showCloseIcon: true,
            download: false,
          },
          // Controls
          controls: true,
          download: false,
          counter: images.length > 1,
          // Dynamic gallery items
          dynamic: true,
          dynamicEl: images.map((image) => ({
            src: image.src,
            thumb: image.thumb,
            subHtml: image.subHtml || `<h4>${image.alt}</h4>`,
          })),
          licenseKey: 'GPLv3', // Add license key like in Gallery component
        }

        galleryInstanceRef.current = lightGallery(lightboxRef.current!, settings as any)
      })
    }

    // Cleanup function
    return () => {
      if (galleryInstanceRef.current) {
        galleryInstanceRef.current.destroy()
        galleryInstanceRef.current = null
      }
    }
  }, [images])

  const openGallery = (index: number = 0) => {
    if (galleryInstanceRef.current) {
      galleryInstanceRef.current.openGallery(index)
    }
  }

  return (
    <div
      ref={lightboxRef}
      className={className}
      onClick={() => trigger === 'click' && openGallery(0)}
      onMouseEnter={() => trigger === 'hover' && openGallery(0)}
      style={{ cursor: trigger === 'click' ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  )
}

// Hook for programmatic control
export const useLightbox = (images: ImageItem[]) => {
  const galleryRef = useRef<any>(null)

  const openLightbox = (index: number = 0) => {
    if (typeof window !== 'undefined' && images.length > 0) {
      import('lightgallery').then(async ({ default: lightGallery }) => {
        const lgZoom = (await import('lightgallery/plugins/zoom')).default
        const lgFullscreen = (await import('lightgallery/plugins/fullscreen')).default
        const lgThumbnail = (await import('lightgallery/plugins/thumbnail')).default

        const tempDiv = document.createElement('div')
        galleryRef.current = lightGallery(tempDiv, {
          plugins: [lgZoom, lgFullscreen, lgThumbnail],
          dynamic: true,
          dynamicEl: images.map((image) => ({
            src: image.src,
            thumb: image.thumb,
            subHtml: image.subHtml || `<h4>${image.alt}</h4>`,
          })),
          speed: 500,
          zoom: true,
          fullScreen: true,
          thumbnail: images.length > 1,
          controls: true,
          download: false,
          counter: images.length > 1,
          licenseKey: 'GPLv3',
        } as any)
        galleryRef.current.openGallery(index)
      })
    }
  }

  return { openLightbox }
}
