import { getClientSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  // If already a complete URL, return as-is (with optional cache tag)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?v=${cacheTag}` : url
  }

  // Handle various S3 URL formats that might come without protocol
  const s3Patterns = [
    /^[^/]+\.s3\.[^/]+\.amazonaws\.com/,  // bucket.s3.region.amazonaws.com
    /^s3\.[^/]+\.amazonaws\.com/,         // s3.region.amazonaws.com/bucket
    /amazonaws\.com/,                      // any amazonaws.com URL
  ]

  const isS3Url = s3Patterns.some(pattern => pattern.test(url))
  
  if (isS3Url) {
    const httpsUrl = `https://${url}`
    return cacheTag ? `${httpsUrl}?v=${cacheTag}` : httpsUrl
  }

  // For local/relative URLs, prepend the client-side URL
  const baseUrl = getClientSideURL()
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  const fullUrl = `${baseUrl}${cleanUrl}`
  
  return cacheTag ? `${fullUrl}?v=${cacheTag}` : fullUrl
}
