// scripts/simple-cleanup.mjs
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

async function cleanupMediaUrls() {
  console.log('🧹 Starting media URL cleanup...')

  try {
    const payload = await getPayload({ config })

    // Find all media documents with potential issues
    const allMedia = await payload.find({
      collection: 'media',
      limit: 0,
      pagination: false,
    })

    console.log(`📊 Found ${allMedia.docs.length} media documents to check`)

    let updateCount = 0
    let errorCount = 0

    for (const doc of allMedia.docs) {
      let needsUpdate = false
      const updateData = {}
      const issues = []

      // Check main URL for null values
      if (
        !doc.url ||
        doc.url === 'null' ||
        doc.url === 'undefined' ||
        doc.url.includes('/media/null')
      ) {
        if (doc.filename && process.env.S3_BUCKET && process.env.S3_REGION) {
          updateData.url = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/media/${doc.filename}`
          needsUpdate = true
          issues.push('Fixed main URL')
        } else {
          issues.push('Cannot fix main URL - missing filename or S3 config')
        }
      }

      // Fix size variants with null URLs
      if (doc.sizes) {
        const fixedSizes = { ...doc.sizes }
        let sizesFixed = false

        for (const [sizeName, sizeData] of Object.entries(doc.sizes)) {
          if (sizeData && typeof sizeData === 'object') {
            // Remove variants with null URLs or dimensions
            if (
              !sizeData.url ||
              sizeData.url === 'null' ||
              sizeData.url === 'undefined' ||
              sizeData.url.includes('/media/null') ||
              sizeData.width === null ||
              sizeData.height === null
            ) {
              // Try to fix if we have filename
              if (sizeData.filename && process.env.S3_BUCKET && process.env.S3_REGION) {
                fixedSizes[sizeName] = {
                  ...sizeData,
                  url: `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/media/${sizeData.filename}`,
                }
                sizesFixed = true
                issues.push(`Fixed ${sizeName} size URL`)
              } else {
                delete fixedSizes[sizeName]
                sizesFixed = true
                issues.push(`Removed invalid ${sizeName} variant`)
              }
            }
          }
        }

        if (sizesFixed) {
          updateData.sizes = fixedSizes
          needsUpdate = true
        }
      }

      // Remove legacy thumbnailURL field
      if ('thumbnailURL' in doc) {
        // This field will be removed by not including it in the update
        needsUpdate = true
        issues.push('Will remove legacy thumbnailURL field')
      }

      if (needsUpdate) {
        try {
          await payload.update({
            collection: 'media',
            id: doc.id,
            data: updateData,
          })

          console.log(`✅ Updated: ${doc.alt || doc.filename || doc.id}`)
          console.log(`   Issues fixed: ${issues.join(', ')}`)
          updateCount++
        } catch (error) {
          console.error(`❌ Failed to update ${doc.alt || doc.id}:`, error.message)
          errorCount++
        }
      }

      if (issues.length > 0 && !needsUpdate) {
        console.log(`⚠️  Issues found but couldn't fix: ${doc.alt || doc.id}`)
        console.log(`   Issues: ${issues.join(', ')}`)
      }
    }

    console.log(`\n✨ Cleanup completed!`)
    console.log(`- Successfully updated: ${updateCount}`)
    console.log(`- Failed updates: ${errorCount}`)
    console.log(`- Total checked: ${allMedia.docs.length}`)

    if (updateCount > 0) {
      console.log('\n💡 Next steps:')
      console.log('1. Clear Next.js cache: rm -rf .next')
      console.log('2. Restart your development server')
      console.log('3. Test your gallery page')
    }
  } catch (error) {
    console.error('💥 Error during cleanup:', error)
    process.exit(1)
  }
}

// Run the cleanup
cleanupMediaUrls()
  .then(() => {
    console.log('\n🏁 Process completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
