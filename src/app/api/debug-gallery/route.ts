import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import type { Media } from '@/payload-types'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({
      config: configPromise,
    })

    // Get all media items marked as gallery images
    const mediaResult = await payload.find({
      collection: 'media',
      where: {
        isGalleryImage: {
          equals: true,
        },
      },
      sort: ['-updatedAt'],
      limit: 100,
      depth: 2,
    })

    // Get categories
    const categoriesResult = await payload.find({
      collection: 'categories',
      where: {
        type: {
          equals: 'artwork',
        },
      },
      sort: 'title',
    })

    // Process media items to show debug info
    const debugMedia = mediaResult.docs.map((item: Media) => ({
      id: item.id,
      alt: item.alt,
      url: item.url,
      filename: item.filename,
      isGalleryImage: item.isGalleryImage,
      category:
        typeof item.category === 'object'
          ? { id: item.category?.id, title: item.category?.title, slug: item.category?.slug }
          : item.category,
      updatedAt: item.updatedAt,
      createdAt: item.createdAt,
      hasSizes: !!item.sizes,
      sizesAvailable: item.sizes ? Object.keys(item.sizes) : [],
      thumbnailUrl: item.sizes?.thumbnail?.url,
      smallUrl: item.sizes?.small?.url,
    }))

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      s3Config: {
        bucket: process.env.S3_BUCKET,
        region: process.env.S3_REGION,
        hasAccessKey: !!process.env.S3_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.S3_SECRET_ACCESS_KEY,
      },
      serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
      totalMediaItems: mediaResult.totalDocs,
      galleryImageCount: debugMedia.length,
      categoriesCount: categoriesResult.docs.length,
      categories: categoriesResult.docs.map((cat) => ({
        id: cat.id,
        title: cat.title,
        slug: cat.slug,
        type: cat.type,
      })),
      recentGalleryImages: debugMedia.slice(0, 10), // Show most recent 10
      mediaValidationIssues: debugMedia
        .filter((item) => !item.url || !item.alt)
        .map((item) => ({
          id: item.id,
          issues: {
            noUrl: !item.url,
            noAlt: !item.alt,
            noCategory: !item.category,
            noThumbnail: !item.thumbnailUrl,
          },
        })),
    }

    return NextResponse.json(debugInfo, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error: any) {
    console.error('Debug gallery error:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch debug information',
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
