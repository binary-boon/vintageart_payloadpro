import { getClientSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource  
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  // If already a complete URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Don't add cache tags to S3 URLs as they can cause issues
    return url
  }

  // Handle S3 URLs that might be missing protocol
  if (url.includes('amazonaws.com') || url.includes('.s3.')) {
    return `https://${url}`
  }

  // For local/relative URLs, prepend the client-side URL
  const baseUrl = getClientSideURL()
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  const fullUrl = `${baseUrl}${cleanUrl}`
  
  return cacheTag ? `${fullUrl}?v=${cacheTag}` : fullUrl
}
