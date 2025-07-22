import type { CollectionConfig } from 'payload'
export const Product: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
}
