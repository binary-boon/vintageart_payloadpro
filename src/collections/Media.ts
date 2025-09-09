import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'category', 'isGalleryImage', 'updatedAt'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
      filterOptions: {
        type: { equals: 'artwork' }, // Only show artwork categories
      },
      admin: {
        description: 'Select the artwork category for gallery filtering',
      },
    },
    {
      name: 'isGalleryImage',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Check this to display in the gallery page',
      },
    },
    {
      name: 'galleryOrder',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Order for displaying in gallery (lower numbers first)',
        condition: (data, siblingData) => siblingData.isGalleryImage,
      },
    },
  ],
  upload: {
    // Remove staticDir when using S3 - the S3 plugin handles storage
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        // Add validation and debugging
        if (operation === 'create') {
          console.log('Creating media with data:', {
            alt: data.alt,
            hasFile: !!data.file,
            filename: data.filename,
            mimeType: data.mimeType,
            isGalleryImage: data.isGalleryImage,
            category: data.category,
          })

          // Ensure alt text exists for gallery images
          if (data.isGalleryImage && !data.alt) {
            data.alt = `Gallery Image ${Date.now()}`
          }
        }

        if (operation === 'update') {
          console.log('Updating media with data:', {
            id: data.id,
            alt: data.alt,
            url: data.url,
            isGalleryImage: data.isGalleryImage,
            category: data.category,
          })
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Log successful operations
        if (operation === 'create') {
          console.log(`✅ Media created successfully:`, {
            id: doc.id,
            url: doc.url,
            filename: doc.filename,
            alt: doc.alt,
            isGalleryImage: doc.isGalleryImage,
            category: typeof doc.category === 'object' ? doc.category?.title : doc.category,
          })
        } else if (operation === 'update') {
          console.log(`✅ Media updated successfully:`, {
            id: doc.id,
            url: doc.url,
            alt: doc.alt,
            isGalleryImage: doc.isGalleryImage,
            category: typeof doc.category === 'object' ? doc.category?.title : doc.category,
          })
        }

        // Log media changes for debugging (detailed logging moved to hooks)
        console.log(`Gallery image ${operation}:`, {
          id: doc.id,
          alt: doc.alt,
          url: doc.url,
          category: typeof doc.category === 'object' ? doc.category?.title : doc.category,
          timestamp: new Date().toISOString(),
        })

        // Trigger revalidation if this is a gallery image
        if (doc.isGalleryImage) {
          try {
            // Revalidate the gallery page
            const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_URL
            if (serverUrl) {
              const revalidateUrl = serverUrl.startsWith('http')
                ? `${serverUrl}/api/revalidate`
                : `https://${serverUrl}/api/revalidate`

              console.log('Triggering revalidation for gallery page...')

              const response = await fetch(revalidateUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  path: '/gallery',
                  secret: process.env.REVALIDATION_SECRET || 'fallback-secret',
                }),
              })

              if (response.ok) {
                console.log('Successfully triggered gallery revalidation')
              } else {
                console.warn('Revalidation request failed:', response.status, response.statusText)
              }
            } else {
              console.warn('No server URL available for revalidation')
            }
          } catch (error) {
            console.warn('Error triggering revalidation:', error)
          }
        }
      },
    ],
    beforeValidate: [
      ({ data, operation }) => {
        // Type guard to ensure data exists
        if (!data) return data

        // Ensure alt text is provided for gallery images
        if (data.isGalleryImage && !data.alt) {
          data.alt = `Gallery Image ${Date.now()}`
        }

        // Log validation data for debugging
        if (operation === 'create' || operation === 'update') {
          console.log('Validating media data:', {
            operation,
            alt: data.alt,
            isGalleryImage: data.isGalleryImage,
            category: data.category,
            hasUrl: !!data.url,
            hasFilename: !!data.filename,
          })
        }

        return data
      },
    ],
    afterRead: [
      ({ doc }) => {
        // Add debug logging for read operations
        if (doc.isGalleryImage && process.env.NODE_ENV === 'development') {
          console.log(`📖 Read gallery image:`, {
            id: doc.id,
            alt: doc.alt,
            url: doc.url,
            category: typeof doc.category === 'object' ? doc.category?.title : doc.category,
          })
        }
        return doc
      },
    ],
  },
}
