/**
 * Production-optimized media URL processor
 * Handles S3 URLs with proper caching and CDN support
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

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

  // Production fallback: construct S3 URL directly
  if (process.env.NODE_ENV === 'production') {
    const bucket = process.env.S3_BUCKET
    const region = process.env.S3_REGION

    if (bucket && region) {
      // Clean the URL path
      const cleanPath = url.startsWith('/') ? url.substring(1) : url
      const path = cleanPath.startsWith('media/') ? cleanPath : `media/${cleanPath}`

      // Use CloudFront URL if available
      const cdnUrl = process.env.CLOUDFRONT_URL
      if (cdnUrl) {
        return `${cdnUrl}/${path}`
      }

      return `https://${bucket}.s3.${region}.amazonaws.com/${path}`
    }
  }

  // Development fallback (should rarely be used in production)
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://your-domain.vercel.app'
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  const fullUrl = `${serverUrl}${cleanUrl}`

  return cacheTag ? `${fullUrl}?v=${cacheTag}` : fullUrl
}

/**
 * Get optimized thumbnail URL with fallback strategy
 */
export const getThumbnailUrl = (media: any): string => {
  // Priority order: medium -> small -> thumbnail -> original
  const sizes = ['medium', 'small', 'thumbnail']

  for (const size of sizes) {
    if (media.sizes?.[size]?.url) {
      return getMediaUrl(media.sizes[size].url)
    }
  }

  // Fallback to original URL
  return getMediaUrl(media.url)
}
