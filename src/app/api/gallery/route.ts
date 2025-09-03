// src/app/api/gallery/route.ts
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import type { Media, Category } from '@/payload-types'
import { getMediaUrl, getThumbnailUrl } from '@/utilities/getMediaUrl'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '50')
  const page = parseInt(searchParams.get('page') || '1')

  try {
    const payload = await getPayloadHMR({
      config: configPromise,
    })

    // Build where condition with strict URL validation
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

    console.log(`Found ${mediaResult.docs.length} potential gallery images`)

    // Transform media data with comprehensive validation
    const validImages = []
    const skippedImages = []

    for (const item of mediaResult.docs as Media[]) {
      // Additional runtime validation
      if (!item.url || item.url === 'null' || item.url === 'undefined' || item.url.trim() === '') {
        skippedImages.push({ id: item.id, reason: 'Invalid URL', url: item.url })
        continue
      }

      const baseUrl = getMediaUrl(item.url)
      if (!baseUrl) {
        skippedImages.push({ id: item.id, reason: 'Could not generate base URL', url: item.url })
        continue
      }

      const thumbnailUrl = getThumbnailUrl(item)
      if (!thumbnailUrl) {
        skippedImages.push({
          id: item.id,
          reason: 'Could not generate thumbnail URL',
          url: item.url,
        })
        continue
      }

      // Handle category relationship
      let category = null
      if (item.category && typeof item.category === 'object' && 'id' in item.category) {
        category = {
          id: item.category.id,
          title: item.category.title,
          slug: item.category.slug || '',
        }
      }

      validImages.push({
        id: item.id,
        src: baseUrl,
        thumb: thumbnailUrl,
        alt: item.alt || `Artwork ${item.id}`,
        category,
        galleryOrder: item.galleryOrder || 0,
      })
    }

    // Log skipped images for debugging
    if (skippedImages.length > 0) {
      console.warn(`Skipped ${skippedImages.length} images:`, skippedImages)
    }

    console.log(`Returning ${validImages.length} valid images`)

    // Transform categories data
    const categories = categoriesResult.docs.map((cat: Category) => ({
      id: cat.id,
      title: cat.title,
      slug: cat.slug || '',
      description: cat.description || '',
    }))

    return NextResponse.json({
      images: validImages,
      categories,
      pagination: {
        totalDocs: validImages.length, // Use actual valid count
        totalPages: Math.ceil(validImages.length / limit),
        page: mediaResult.page,
        limit: mediaResult.limit,
        hasNextPage: mediaResult.hasNextPage,
        hasPrevPage: mediaResult.hasPrevPage,
      },
      debug: {
        foundInDb: mediaResult.docs.length,
        validImages: validImages.length,
        skippedImages: skippedImages.length,
        skippedReasons: skippedImages.map((img) => `${img.id}: ${img.reason}`),
      },
    })
  } catch (error) {
    console.error('Gallery API Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch gallery data',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    )
  }
}

// Keep existing POST and DELETE methods unchanged
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

    return NextResponse.json({
      success: true,
      image: updated,
    })
  } catch (error) {
    console.error('Gallery Update API Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update gallery image',
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

    return NextResponse.json({
      success: true,
      message: 'Image removed from gallery',
      image: updated,
    })
  } catch (error) {
    console.error('Gallery Delete API Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to remove image from gallery',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    )
  }
}
