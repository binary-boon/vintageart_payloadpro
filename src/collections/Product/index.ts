// src/collections/Product/index.ts (Replace your existing file)
import type { CollectionConfig } from 'payload'

export const Product: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'inStock', 'featured'],
  },
  access: {
    read: () => true, // Allow public read access
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Product Name',
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Main Image',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Additional Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Price (₹)',
      min: 0,
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      label: 'Compare at Price (₹)',
      admin: {
        description: 'Original price for showing discounts',
      },
      min: 0,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description',
      admin: {
        description: 'Brief description shown in product cards',
      },
    },
    {
      name: 'fullDescription',
      type: 'richText',
      label: 'Full Description',
      admin: {
        description: 'Detailed product description for product page',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Category',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for filtering and search',
      },
    },
    {
      name: 'inStock',
      type: 'checkbox',
      label: 'In Stock',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'stockQuantity',
      type: 'number',
      label: 'Stock Quantity',
      min: 0,
      admin: {
        position: 'sidebar',
        condition: (data) => data.inStock,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Product',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'dimensions',
      type: 'group',
      label: 'Dimensions',
      fields: [
        {
          name: 'width',
          type: 'number',
          label: 'Width (cm)',
        },
        {
          name: 'height',
          type: 'number',
          label: 'Height (cm)',
        },
        {
          name: 'depth',
          type: 'number',
          label: 'Depth (cm)',
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Weight (kg)',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Keywords',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published Date',
      defaultValue: () => new Date(),
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.publishedAt) {
          data.publishedAt = new Date()
        }
        return data
      },
    ],
  },
}
