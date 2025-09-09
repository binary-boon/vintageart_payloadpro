import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, secret } = body

    // Validate the secret (optional but recommended for security)
    const revalidationSecret = process.env.REVALIDATION_SECRET || 'fallback-secret'
    if (secret && secret !== revalidationSecret) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Default to gallery path if none provided
    const pathToRevalidate = path || '/gallery'

    console.log(`🔄 Revalidating path: ${pathToRevalidate}`)

    // Revalidate the specified path
    revalidatePath(pathToRevalidate)

    // Also revalidate the root page if it displays gallery content
    if (pathToRevalidate === '/gallery') {
      revalidatePath('/')
    }

    console.log(`✅ Successfully revalidated: ${pathToRevalidate}`)

    return NextResponse.json(
      {
        message: `Successfully revalidated ${pathToRevalidate}`,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('❌ Error revalidating:', error)

    return NextResponse.json(
      {
        message: 'Error revalidating',
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  // Allow GET requests for manual testing
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get('path') || '/gallery'
  const secret = searchParams.get('secret')

  try {
    const revalidationSecret = process.env.REVALIDATION_SECRET || 'fallback-secret'
    if (secret && secret !== revalidationSecret) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    console.log(`🔄 Manual revalidation of: ${path}`)
    revalidatePath(path)

    return NextResponse.json(
      {
        message: `Manually revalidated ${path}`,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error revalidating', error: error.message },
      { status: 500 },
    )
  }
}
