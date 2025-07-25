// src/app/api/shop/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const inStock = searchParams.get('inStock') === 'true'
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

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) {
        where.price.greater_than_equal = parseFloat(minPrice)
      }
      if (maxPrice) {
        where.price.less_than_equal = parseFloat(maxPrice)
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

    // Stock filter
    if (inStock) {
      where.inStock = {
        equals: true,
      }
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
      case 'price-low-high':
        sort = 'price'
        break
      case 'price-high-low':
        sort = '-price'
        break
      case 'name-a-z':
        sort = 'name'
        break
      case 'name-z-a':
        sort = '-name'
        break
      case 'oldest':
        sort = 'createdAt'
        break
      case 'newest':
      default:
        sort = '-createdAt'
        break
    }

    console.log('Shop API Query:', { where, sort, page, limit }) // Debug logging

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

    // Get price range for filters
    const allProductsForPriceRange = await payload.find({
      collection: 'products',
      limit: 1000, // Adjust based on your needs
      select: {
        price: true,
      },
    })

    const prices = allProductsForPriceRange.docs.map((p) => p.price || 0).filter((p) => p > 0)
    const priceRange = {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 1000,
    }

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
          .flatMap((p) => p.tags || [])
          .map((tagObj) => (tagObj as any)?.tag)
          .filter(Boolean),
      ),
    ).sort()

    const response = {
      products: productsResult.docs,
      totalPages: productsResult.totalPages,
      currentPage: productsResult.page || 1,
      totalProducts: productsResult.totalDocs,
      categories: categoriesResult.docs,
      priceRange,
      availableTags,
    }

    console.log('Shop API Response:', {
      productsCount: response.products.length,
      totalProducts: response.totalProducts,
      categoriesCount: response.categories.length,
      appliedWhere: where,
    }) // Debug logging

    return NextResponse.json(response)
  } catch (error) {
    console.error('Shop API error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// // src/app/api/shop/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { getPayload } from 'payload'
// import config from '@payload-config'

// export async function GET(request: NextRequest) {
//   try {
//     const payload = await getPayload({ config })
//     const { searchParams } = new URL(request.url)

//     // Parse query parameters
//     const category = searchParams.get('category')
//     const minPrice = searchParams.get('minPrice')
//     const maxPrice = searchParams.get('maxPrice')
//     const sortBy = searchParams.get('sortBy') || 'newest'
//     const search = searchParams.get('search')
//     const page = parseInt(searchParams.get('page') || '1')
//     const inStock = searchParams.get('inStock') === 'true'
//     const featured = searchParams.get('featured') === 'true'
//     const tags = searchParams.get('tags')?.split(',').filter(Boolean)
//     const limit = 12 // Products per page

//     // Build where clause
//     const where: any = {}

//     // Category filter
//     if (category && category !== 'all') {
//       where.category = {
//         equals: category,
//       }
//     }

//     // Price range filter
//     if (minPrice || maxPrice) {
//       where.price = {}
//       if (minPrice) {
//         where.price.greater_than_equal = parseFloat(minPrice)
//       }
//       if (maxPrice) {
//         where.price.less_than_equal = parseFloat(maxPrice)
//       }
//     }

//     // Search filter
//     if (search) {
//       where.or = [
//         {
//           name: {
//             contains: search,
//           },
//         },
//         {
//           description: {
//             contains: search,
//           },
//         },
//         {
//           shortDescription: {
//             contains: search,
//           },
//         },
//       ]
//     }

//     // Stock filter
//     if (inStock) {
//       where.inStock = {
//         equals: true,
//       }
//     }

//     // Featured filter
//     if (featured) {
//       where.featured = {
//         equals: true,
//       }
//     }

//     // Tags filter
//     if (tags && tags.length > 0) {
//       where['tags.tag'] = {
//         in: tags,
//       }
//     }

//     // Build sort parameter
//     let sort: string
//     switch (sortBy) {
//       case 'price-low-high':
//         sort = 'price'
//         break
//       case 'price-high-low':
//         sort = '-price'
//         break
//       case 'name-a-z':
//         sort = 'name'
//         break
//       case 'name-z-a':
//         sort = '-name'
//         break
//       case 'oldest':
//         sort = 'createdAt'
//         break
//       case 'newest':
//       default:
//         sort = '-createdAt'
//         break
//     }

//     // Fetch products
//     const productsResult = await payload.find({
//       collection: 'products',
//       where,
//       sort,
//       page,
//       limit,
//       depth: 2,
//     })

//     // Fetch categories for filters
//     const categoriesResult = await payload.find({
//       collection: 'categories',
//       limit: 100,
//       sort: 'title',
//     })

//     // Get price range for filters
//     const allProductsForPriceRange = await payload.find({
//       collection: 'products',
//       limit: 1000, // Adjust based on your needs
//       select: {
//         price: true,
//       },
//     })

//     const prices = allProductsForPriceRange.docs.map((p) => p.price || 0).filter((p) => p > 0)
//     const priceRange = {
//       min: prices.length > 0 ? Math.min(...prices) : 0,
//       max: prices.length > 0 ? Math.max(...prices) : 1000,
//     }

//     // Get all available tags
//     const allProductsForTags = await payload.find({
//       collection: 'products',
//       limit: 1000,
//       select: {
//         tags: true,
//       },
//     })

//     const availableTags = Array.from(
//       new Set(
//         allProductsForTags.docs
//           .flatMap((p) => p.tags || [])
//           .map((tagObj) => (tagObj as any)?.tag)
//           .filter(Boolean),
//       ),
//     ).sort()

//     const response = {
//       products: productsResult.docs,
//       totalPages: productsResult.totalPages,
//       currentPage: productsResult.page || 1,
//       totalProducts: productsResult.totalDocs,
//       categories: categoriesResult.docs,
//       priceRange,
//       availableTags,
//     }

//     return NextResponse.json(response)
//   } catch (error) {
//     console.error('Shop API error:', error)
//     return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
//   }
// }
