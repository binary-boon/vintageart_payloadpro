// src/app/api/shop/route.ts - CORRECTED VERSION
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const featured = searchParams.get('featured') === 'true'
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const limit = 12 // Products per page

    // Build where clause
    const where: any = {}

    // Category filter - Fixed to handle both string and object relations
    if (category && category !== 'all') {
      where.category = {
        equals: category,
      }
    }

    // Search filter
    if (search) {
      where.or = [
        {
          name: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ]
    }

    // Featured filter
    if (featured) {
      where.featured = {
        equals: true,
      }
    }

    // Tags filter
    if (tags && tags.length > 0) {
      where['tags.tag'] = {
        in: tags,
      }
    }

    // Build sort parameter
    let sort: string
    switch (sortBy) {
      case 'name':
        sort = 'name'
        break
      case 'oldest':
        sort = 'createdAt'
        break
      case 'newest':
      default:
        sort = '-createdAt'
        break
    }

    console.log('Shop API Query:', { where, sort, page, limit })

    // Fetch products with detailed population
    const productsResult = await payload.find({
      collection: 'products',
      where,
      sort,
      page,
      limit,
      depth: 2, // This ensures relations are populated
    })

    // Fetch categories for filters
    const categoriesResult = await payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'title',
    })

    // Get all available tags
    const allProductsForTags = await payload.find({
      collection: 'products',
      limit: 1000,
      select: {
        tags: true,
      },
    })

    const availableTags = Array.from(
      new Set(
        allProductsForTags.docs
          .flatMap((p: any) => p.tags || [])
          .map((tagObj: any) => tagObj?.tag)
          .filter(Boolean),
      ),
    ).sort()

    const response = {
      products: productsResult.docs,
      totalPages: productsResult.totalPages,
      currentPage: productsResult.page || 1,
      totalProducts: productsResult.totalDocs,
      categories: categoriesResult.docs,
      availableTags,
    }

    console.log('Shop API Response:', {
      productsCount: response.products.length,
      totalProducts: response.totalProducts,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
      categoriesCount: response.categories.length,
      availableTagsCount: response.availableTags.length,
      appliedWhere: where,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Shop API error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
