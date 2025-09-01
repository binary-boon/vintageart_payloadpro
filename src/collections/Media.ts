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
    // staticDir: path.resolve(dirname, '../../public/media'), // ← Remove this line
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
}
