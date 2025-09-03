// src/app/api/gallery/route.ts
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import type { Media, Category } from '@/payload-types'
import {
  getMediaUrl,
  getThumbnailUrl,
  validateMediaUrl,
  getFullSizeUrl,
} from '@/utilities/getMediaUrl'
import { revalidatePath } from 'next/cache'

// Cache control headers
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  'CDN-Cache-Control': 'public, max-age=300',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '50')
  const page = parseInt(searchParams.get('page') || '1')
  const forceRefresh = searchParams.get('refresh') === 'true'

  try {
    const payload = await getPayloadHMR({
      config: configPromise,
    })

    // Build where condition with comprehensive validation
    const whereCondition: any = {
      and: [
        { isGalleryImage: { equals: true } },
        { url: { exists: true } },
        { url: { not_equals: null } },
        { url: { not_equals: '' } },
        { url: { not_equals: 'null' } },
        { url: { not_equals: 'undefined' } },
      ],
    }

    if (category && category !== 'all') {
      const categoryDoc = await payload.find({
        collection: 'categories',
        where: {
          and: [{ slug: { equals: category } }, { type: { equals: 'artwork' } }],
        },
        limit: 1,
      })

      if (categoryDoc.docs.length > 0) {
        whereCondition.and.push({ category: { equals: categoryDoc.docs[0].id } })
      } else {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
    }

    // Fetch gallery images
    const mediaResult = await payload.find({
      collection: 'media',
      where: whereCondition,
      sort: '-galleryOrder',
      limit,
      page,
      depth: 2,
    })

    // Fetch artwork categories
    const categoriesResult = await payload.find({
      collection: 'categories',
      where: {
        type: { equals: 'artwork' },
      },
      sort: 'title',
    })

    console.log(`[Gallery API] Found ${mediaResult.docs.length} potential gallery images`)

    // Transform media data with comprehensive validation
    const validImages = []
    const skippedImages = []
    const processedImages = []

    for (const item of mediaResult.docs as Media[]) {
      const itemId = item.id

      // Validate original URL
      if (!validateMediaUrl(item.url)) {
        skippedImages.push({
          id: itemId,
          reason: 'Invalid original URL',
          url: item.url,
          alt: item.alt,
        })
        continue
      }

      // Get URLs with robust error handling
      const baseUrl = getFullSizeUrl(item)
      const thumbnailUrl = getThumbnailUrl(item)

      if (!baseUrl) {
        skippedImages.push({
          id: itemId,
          reason: 'Could not generate base URL',
          url: item.url,
          alt: item.alt,
        })
        continue
      }

      if (!thumbnailUrl) {
        skippedImages.push({
          id: itemId,
          reason: 'Could not generate thumbnail URL',
          url: item.url,
          alt: item.alt,
          sizes: Object.keys(item.sizes || {}),
        })
        continue
      }

      // Handle category relationship
      let categoryData = null
      if (item.category && typeof item.category === 'object' && 'id' in item.category) {
        categoryData = {
          id: item.category.id,
          title: item.category.title || 'Untitled Category',
          slug: item.category.slug || 'uncategorized',
        }
      }

      // Create valid image object
      const validImage = {
        id: itemId,
        src: baseUrl,
        thumb: thumbnailUrl,
        alt: item.alt || `Vintage Artwork ${itemId}`,
        category: categoryData,
        galleryOrder: item.galleryOrder || 0,
        // Add debugging info
        debug:
          process.env.NODE_ENV === 'development'
            ? {
                originalUrl: item.url,
                availableSizes: Object.keys(item.sizes || {}),
                hasValidSizes: Object.values(item.sizes || {}).filter(
                  (size) => size && size.url && size.url !== 'null' && size.url !== 'undefined',
                ).length,
              }
            : undefined,
      }

      validImages.push(validImage)
      processedImages.push({
        id: itemId,
        originalUrl: item.url,
        finalUrl: baseUrl,
        thumbnailUrl: thumbnailUrl,
      })
    }

    // Log detailed information
    if (skippedImages.length > 0) {
      console.warn(`[Gallery API] Skipped ${skippedImages.length} images:`)
      skippedImages.forEach((img) => {
        console.warn(`  - ${img.id} (${img.alt}): ${img.reason}`)
        if (img.url) console.warn(`    Original URL: ${img.url}`)
        if (img.sizes) console.warn(`    Available sizes: ${img.sizes.join(', ')}`)
      })
    }

    console.log(`[Gallery API] Successfully processed ${validImages.length} images`)
    if (process.env.NODE_ENV === 'development') {
      console.log('Processed images:', processedImages)
    }

    // Transform categories data
    const categories = categoriesResult.docs.map((cat: Category) => ({
      id: cat.id,
      title: cat.title || 'Untitled Category',
      slug: cat.slug || 'uncategorized',
      description: cat.description || '',
    }))

    const response = NextResponse.json({
      images: validImages,
      categories,
      pagination: {
        totalDocs: mediaResult.totalDocs,
        totalPages: mediaResult.totalPages,
        page: mediaResult.page,
        limit: mediaResult.limit,
        hasNextPage: mediaResult.hasNextPage,
        hasPrevPage: mediaResult.hasPrevPage,
      },
      metadata: {
        foundInDb: mediaResult.docs.length,
        validImages: validImages.length,
        skippedImages: skippedImages.length,
        cacheStatus: forceRefresh ? 'refreshed' : 'cached',
        timestamp: new Date().toISOString(),
      },
      debug:
        process.env.NODE_ENV === 'development'
          ? {
              skippedReasons: skippedImages.map((img) => `${img.id}: ${img.reason}`),
              processedImages: processedImages,
            }
          : undefined,
    })

    // Set cache headers
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('[Gallery API] Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch gallery data',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageId, galleryOrder, isGalleryImage, categoryId } = body

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    const payload = await getPayloadHMR({
      config: configPromise,
    })

    const updateData: any = {}

    if (typeof galleryOrder === 'number') {
      updateData.galleryOrder = galleryOrder
    }

    if (typeof isGalleryImage === 'boolean') {
      updateData.isGalleryImage = isGalleryImage
    }

    if (categoryId) {
      updateData.category = categoryId
    }

    const updated = await payload.update({
      collection: 'media',
      id: imageId,
      data: updateData,
    })

    // Revalidate gallery pages
    revalidatePath('/gallery')
    revalidatePath('/api/gallery')

    console.log(`[Gallery API] Updated media ${imageId}:`, updateData)

    return NextResponse.json({
      success: true,
      image: updated,
      message: 'Gallery image updated successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Gallery API] Update error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update gallery image',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const imageId = searchParams.get('imageId')

  if (!imageId) {
    return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
  }

  try {
    const payload = await getPayloadHMR({
      config: configPromise,
    })

    const updated = await payload.update({
      collection: 'media',
      id: imageId,
      data: {
        isGalleryImage: false,
      },
    })

    // Revalidate gallery pages
    revalidatePath('/gallery')
    revalidatePath('/api/gallery')

    console.log(`[Gallery API] Removed media ${imageId} from gallery`)

    return NextResponse.json({
      success: true,
      message: 'Image removed from gallery',
      image: updated,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Gallery API] Delete error:', error)
    return NextResponse.json(
      {
        error: 'Failed to remove image from gallery',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    )
  }
}
