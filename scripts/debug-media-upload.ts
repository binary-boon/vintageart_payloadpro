// scripts/debug-media-upload.ts
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

const debugMediaUpload = async () => {
  console.log('🔍 Debug: Testing Payload Media Collection...\n')

  try {
    const payload = await getPayloadHMR({ config: configPromise })

    console.log('✅ Payload instance loaded successfully')
    console.log('Collections available:', Object.keys(payload.collections))
    console.log('Media collection config:', payload.collections.media ? 'Found' : 'Not found')
    console.log()

    // Test creating a minimal media record (without actual file upload)
    console.log('📋 Testing media collection structure...')

    // Check if we can query the media collection
    const existingMedia = await payload.find({
      collection: 'media',
      limit: 5,
      sort: '-createdAt',
    })

    console.log(`Found ${existingMedia.docs.length} existing media items`)

    if (existingMedia.docs.length > 0) {
      console.log('Sample media item structure:')
      const sample = existingMedia.docs[0]
      console.log({
        id: sample.id,
        url: sample.url || 'NO URL',
        filename: sample.filename || 'NO FILENAME',
        mimeType: sample.mimeType || 'NO MIMETYPE',
        alt: sample.alt || 'NO ALT',
        isGalleryImage: sample.isGalleryImage || false,
        sizes: Object.keys(sample.sizes || {}),
      })
    }
    console.log()

    // Check S3 plugin integration
    console.log('🔧 Checking S3 plugin integration...')
    console.log('Environment variables:')
    console.log('- S3_BUCKET:', process.env.S3_BUCKET || 'NOT SET')
    console.log('- S3_REGION:', process.env.S3_REGION || 'NOT SET')
    console.log('- S3_ACCESS_KEY_ID:', process.env.S3_ACCESS_KEY_ID ? 'SET' : 'NOT SET')
    console.log('- S3_SECRET_ACCESS_KEY:', process.env.S3_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET')
    console.log()

    console.log('🎯 Ready to test actual file upload through admin panel')
    console.log('Next steps:')
    console.log('1. Start your dev server: pnpm dev')
    console.log('2. Go to: http://localhost:3000/admin')
    console.log('3. Navigate to Media collection')
    console.log('4. Try uploading a small image file')
    console.log('5. Watch the server console for detailed logs')
  } catch (error) {
    console.error('❌ Debug failed:', error)

    if (error instanceof Error) {
      console.error('Error details:')
      console.error('- Message:', error.message)
      console.error('- Stack:', error.stack?.split('\n').slice(0, 5).join('\n'))
    }

    console.error('\n💡 Common issues:')
    console.error('1. Make sure payload.config.ts can be imported without errors')
    console.error('2. Check that all environment variables are set correctly')
    console.error('3. Verify MongoDB connection is working')
    console.error('4. Ensure S3 credentials have proper permissions')
  }
}

debugMediaUpload().catch(console.error)
