// src/app/api/gallery/route.ts
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import type { Media, Category } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '50')
  const page = parseInt(searchParams.get('page') || '1')

  try {
    const payload = await getPayloadHMR({
      config: configPromise,
    })

    // Build where condition based on category filter
    const whereCondition: any = {
      isGalleryImage: { equals: true },
    }

    if (category && category !== 'all') {
      // Find the category first
      const categoryDoc = await payload.find({
        collection: 'categories',
        where: {
          and: [{ slug: { equals: category } }, { type: { equals: 'artwork' } }],
        },
        limit: 1,
      })

      if (categoryDoc.docs.length > 0) {
        whereCondition.category = { equals: categoryDoc.docs[0].id }
      } else {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
    }

    // Fetch gallery images
    const mediaResult = await payload.find({
      collection: 'media',
      where: whereCondition,
      sort: '-galleryOrder', // Changed to negative for descending order (higher numbers first)
      limit,
      page,
      depth: 2, // To populate category relationship
    })

    // Fetch artwork categories
    const categoriesResult = await payload.find({
      collection: 'categories',
      where: {
        type: { equals: 'artwork' },
      },
      sort: 'title',
    })

    // Transform media data with better error handling
    const images = mediaResult.docs
      .filter((item: Media) => item.url)
      .map((item: Media) => {
        const baseUrl = getMediaUrl(item.url!)
        
        // Handle category relationship more safely
        let category = null
        if (item.category) {
          if (typeof item.category === 'object' && 'id' in item.category) {
            category = {
              id: item.category.id,
              title: item.category.title,
              slug: item.category.slug || '',
            }
          }
        }

        return {
          id: item.id,
          src: baseUrl,
          thumb: item.sizes?.medium?.url ? getMediaUrl(item.sizes.medium.url) : baseUrl,
          alt: item.alt || `Artwork ${item.id}`,
          category,
          galleryOrder: item.galleryOrder || 0,
        }
      })

    // Transform categories data
    const categories = categoriesResult.docs.map((cat: Category) => ({
      id: cat.id,
      title: cat.title,
      slug: cat.slug || '',
      description: cat.description || '',
    }))

    return NextResponse.json({
      images,
      categories,
      pagination: {
        totalDocs: mediaResult.totalDocs,
        totalPages: mediaResult.totalPages,
        page: mediaResult.page,
        limit: mediaResult.limit,
        hasNextPage: mediaResult.hasNextPage,
        hasPrevPage: mediaResult.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Gallery API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch gallery data',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}

// POST endpoint to update gallery image order
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

    // Build update data object
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
    return NextResponse.json({ 
      error: 'Failed to update gallery image',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}

// DELETE endpoint to remove image from gallery
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

    // Remove from gallery (don't delete the media file, just unmark as gallery image)
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
    return NextResponse.json({ 
      error: 'Failed to remove image from gallery',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}
