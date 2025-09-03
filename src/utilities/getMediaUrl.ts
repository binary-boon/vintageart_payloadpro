/**
 * Production-optimized media URL processor
 * Handles S3 URLs with proper caching and CDN support
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
    console.warn('getMediaUrl: Invalid URL provided:', url)
    return ''
  }

  // Handle complete S3 URLs (most common case in production)
  if (url.startsWith('https://') && (url.includes('amazonaws.com') || url.includes('s3.'))) {
    return url // S3 URLs should not have cache tags appended
  }

  // Handle other complete URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?v=${cacheTag}` : url
  }

  // Handle S3 URLs missing protocol (fallback)
  if (url.includes('amazonaws.com') || url.includes('.s3.')) {
    return `https://${url}`
  }

  // Production: construct S3 URL directly
  const bucket = process.env.S3_BUCKET
  const region = process.env.S3_REGION

  if (bucket && region) {
    // Clean the URL path
    const cleanPath = url.startsWith('/') ? url.substring(1) : url
    const path = cleanPath.startsWith('media/') ? cleanPath : `media/${cleanPath}`

    // Use CloudFront URL if available for better performance
    const cdnUrl = process.env.CLOUDFRONT_URL
    if (cdnUrl) {
      return `${cdnUrl}/${path}`
    }

    return `https://${bucket}.s3.${region}.amazonaws.com/${path}`
  }

  // Development fallback
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  const fullUrl = `${serverUrl}${cleanUrl}`

  return cacheTag ? `${fullUrl}?v=${cacheTag}` : fullUrl
}

/**
 * Get optimized thumbnail URL with robust fallback strategy
 */
export const getThumbnailUrl = (media: any): string => {
  if (!media) {
    console.warn('getThumbnailUrl: No media object provided')
    return ''
  }

  // Priority order: small -> thumbnail -> medium -> square -> original
  const sizeOrder = ['small', 'thumbnail', 'medium', 'square']

  for (const size of sizeOrder) {
    const sizeData = media.sizes?.[size]
    if (
      sizeData?.url &&
      sizeData.url !== 'null' &&
      sizeData.url !== 'undefined' &&
      sizeData.url.trim() !== ''
    ) {
      const url = getMediaUrl(sizeData.url)
      if (url) {
        console.log(`Using ${size} variant for thumbnail:`, url)
        return url
      }
    }
  }

  // Fallback to original URL
  const originalUrl = getMediaUrl(media.url)
  if (originalUrl) {
    console.log('Using original image for thumbnail:', originalUrl)
    return originalUrl
  }

  console.error('getThumbnailUrl: Could not generate any valid URL for media:', media.id)
  return ''
}

/**
 * Validate and clean media URL
 */
export const validateMediaUrl = (url: string | null | undefined): boolean => {
  if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
    return false
  }

  // Check for valid URL format
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`)
    return true
  } catch {
    return false
  }
}

/**
 * Get full size image URL for gallery display
 */
export const getFullSizeUrl = (media: any): string => {
  if (!media) return ''

  // Priority: xlarge -> large -> medium -> original
  const sizeOrder = ['xlarge', 'large', 'medium']

  for (const size of sizeOrder) {
    const sizeData = media.sizes?.[size]
    if (
      sizeData?.url &&
      sizeData.url !== 'null' &&
      sizeData.url !== 'undefined' &&
      sizeData.url.trim() !== ''
    ) {
      const url = getMediaUrl(sizeData.url)
      if (url) return url
    }
  }

  // Fallback to original
  return getMediaUrl(media.url)
}
