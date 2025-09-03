// scripts/cleanup-media-urls.ts
// Run this script to clean up invalid media URLs in your MongoDB database

import { getPayload } from 'payload'
import config from '@payload-config'

interface MediaDocument {
  id: string
  url: string
  sizes: Record<string, any>
  filename: string
  alt: string
  isGalleryImage?: boolean
}

async function cleanupMediaUrls() {
  console.log('🧹 Starting media URL cleanup...')

  try {
    const payload = await getPayload({ config })

    // Find all media documents
    const allMedia = await payload.find({
      collection: 'media',
      limit: 0, // Get all documents
      pagination: false,
    })

    console.log(`📊 Found ${allMedia.docs.length} media documents to check`)

    const updates = []
    const problematicDocs = []

    for (const doc of allMedia.docs as MediaDocument[]) {
      let needsUpdate = false
      const updateData: any = {}
      const issues = []

      // Check main URL
      if (!doc.url || doc.url === 'null' || doc.url === 'undefined' || doc.url.trim() === '') {
        issues.push('Invalid main URL')

        // Try to reconstruct URL from filename if available
        if (doc.filename && process.env.S3_BUCKET && process.env.S3_REGION) {
          const newUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/media/${doc.filename}`
          updateData.url = newUrl
          needsUpdate = true
          issues.push(`Reconstructed URL: ${newUrl}`)
        }
      }

      // Check and fix size variants
      if (doc.sizes) {
        const fixedSizes = { ...doc.sizes }
        let sizesNeedFix = false

        for (const [sizeName, sizeData] of Object.entries(doc.sizes)) {
          if (sizeData && typeof sizeData === 'object') {
            // Check for null URLs in size variants
            if (
              !sizeData.url ||
              sizeData.url === 'null' ||
              sizeData.url === 'undefined' ||
              sizeData.url.includes('/media/null')
            ) {
              // Try to reconstruct from filename
              if (sizeData.filename && process.env.S3_BUCKET && process.env.S3_REGION) {
                const newSizeUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/media/${sizeData.filename}`
                fixedSizes[sizeName] = {
                  ...sizeData,
                  url: newSizeUrl,
                }
                sizesNeedFix = true
                issues.push(`Fixed ${sizeName} size URL`)
              } else {
                // Remove invalid size variant
                delete fixedSizes[sizeName]
                sizesNeedFix = true
                issues.push(`Removed invalid ${sizeName} size variant`)
              }
            }

            // Remove null dimensions
            if (sizeData.width === null || sizeData.height === null) {
              delete fixedSizes[sizeName]
              sizesNeedFix = true
              issues.push(`Removed ${sizeName} variant with null dimensions`)
            }
          }
        }

        if (sizesNeedFix) {
          updateData.sizes = fixedSizes
          needsUpdate = true
        }
      }

      // Remove thumbnailURL field if it exists (outdated field)
      if ('thumbnailURL' in doc) {
        updateData.thumbnailURL = undefined // This will remove the field
        needsUpdate = true
        issues.push('Removed outdated thumbnailURL field')
      }

      if (needsUpdate) {
        updates.push({
          id: doc.id,
          alt: doc.alt,
          issues,
          updateData,
        })
      }

      if (issues.length > 0) {
        problematicDocs.push({
          id: doc.id,
          alt: doc.alt,
          filename: doc.filename,
          originalUrl: doc.url,
          isGalleryImage: doc.isGalleryImage,
          issues,
        })
      }
    }

    console.log(`\n📋 Summary:`)
    console.log(`- Total documents checked: ${allMedia.docs.length}`)
    console.log(`- Documents with issues: ${problematicDocs.length}`)
    console.log(`- Documents needing updates: ${updates.length}`)

    if (problematicDocs.length > 0) {
      console.log('\n⚠️  Problematic documents:')
      problematicDocs.forEach((doc) => {
        console.log(`\n  📄 ${doc.alt} (${doc.id})`)
        console.log(`     Filename: ${doc.filename}`)
        console.log(`     Original URL: ${doc.originalUrl}`)
        console.log(`     Gallery Image: ${doc.isGalleryImage}`)
        console.log(`     Issues: ${doc.issues.join(', ')}`)
      })
    }

    // Ask for confirmation before updating
    if (updates.length > 0) {
      console.log(`\n🔧 Ready to update ${updates.length} documents...`)

      // Perform updates
      let successCount = 0
      let errorCount = 0

      for (const update of updates) {
        try {
          await payload.update({
            collection: 'media',
            id: update.id,
            data: update.updateData,
          })

          console.log(`✅ Updated: ${update.alt} (${update.id})`)
          successCount++
        } catch (error) {
          console.error(`❌ Failed to update ${update.alt} (${update.id}):`, error)
          errorCount++
        }
      }

      console.log(`\n✨ Cleanup completed!`)
      console.log(`- Successfully updated: ${successCount}`)
      console.log(`- Failed updates: ${errorCount}`)

      if (successCount > 0) {
        console.log('\n💡 Recommended next steps:')
        console.log('1. Clear your Next.js cache: rm -rf .next')
        console.log('2. Restart your development server')
        console.log('3. Check your gallery page for improvements')
        console.log('4. Consider re-uploading problematic images if issues persist')
      }
    } else {
      console.log('\n✅ No updates needed - all media URLs look good!')
    }
  } catch (error) {
    console.error('💥 Error during cleanup:', error)
    process.exit(1)
  }
}

// Optional: Find and report images missing from S3
async function checkS3Availability() {
  console.log('\n🔍 Checking S3 availability (optional)...')

  try {
    const payload = await getPayload({ config })

    const galleryImages = await payload.find({
      collection: 'media',
      where: {
        isGalleryImage: { equals: true },
      },
      limit: 0,
    })

    console.log(`🖼️  Checking ${galleryImages.docs.length} gallery images...`)

    let availableCount = 0
    let unavailableCount = 0

    for (const image of galleryImages.docs as MediaDocument[]) {
      try {
        const response = await fetch(image.url, { method: 'HEAD' })
        if (response.ok) {
          availableCount++
        } else {
          console.log(`❌ Unavailable: ${image.alt} - ${image.url}`)
          unavailableCount++
        }
      } catch (error) {
        console.log(`❌ Error checking: ${image.alt} - ${image.url}`)
        unavailableCount++
      }
    }

    console.log(`\n📊 S3 Availability Report:`)
    console.log(`- Available: ${availableCount}`)
    console.log(`- Unavailable: ${unavailableCount}`)
  } catch (error) {
    console.error('Error checking S3 availability:', error)
  }
}

// Run the cleanup
if (require.main === module) {
  cleanupMediaUrls()
    .then(() => {
      console.log('\n🏁 Cleanup process completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { cleanupMediaUrls, checkS3Availability }
