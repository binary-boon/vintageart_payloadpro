import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Blog Category',
          value: 'blog',
        },
        {
          label: 'Product Category',
          value: 'product',
        },
        {
          label: 'Artwork Category',
          value: 'artwork',
        },
      ],
      defaultValue: 'blog',
      required: true,
      admin: {
        description: 'Select the type of category',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of this category',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for this category',
        condition: (data, siblingData) => siblingData.type === 'artwork',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Create default artwork categories if they don't exist
        if (operation === 'create' && doc.type === 'artwork') {
          const defaultCategories = [
            { title: 'Thikri Artworks', slug: 'thikri-artworks' },
            { title: 'Metal Artworks', slug: 'metal-artworks' },
            { title: 'Handpainted Artworks', slug: 'handpainted-artworks' },
            { title: 'Wooden Artworks', slug: 'wooden-artworks' },
          ]

          for (const category of defaultCategories) {
            const existing = await req.payload.find({
              collection: 'categories',
              where: {
                and: [{ slug: { equals: category.slug } }, { type: { equals: 'artwork' } }],
              },
            })

            if (existing.docs.length === 0) {
              await req.payload.create({
                collection: 'categories',
                data: {
                  title: category.title,
                  slug: category.slug,
                  type: 'artwork',
                  description: `Category for ${category.title.toLowerCase()}`,
                },
              })
            }
          }
        }
      },
    ],
  },
}
