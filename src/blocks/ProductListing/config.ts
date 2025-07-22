// src/blocks/ProductListing/config.ts
import type { Block } from 'payload'

export const ProductListing: Block = {
  slug: 'productListing',
  labels: {
    singular: 'Product Listing',
    plural: 'Product Listings',
  },
  interfaceName: 'ProductListingBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      admin: {
        description: 'Optional title for the product listing section',
      },
    },
    {
      name: 'displayMode',
      type: 'select',
      label: 'Display Mode',
      defaultValue: 'selected',
      options: [
        {
          label: 'Show All Products',
          value: 'all',
        },
        {
          label: 'Show Selected Products',
          value: 'selected',
        },
        {
          label: 'Show Latest Products',
          value: 'latest',
        },
      ],
      required: true,
    },
    {
      name: 'selectedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Select Products',
      admin: {
        condition: (data, siblingData) => siblingData.displayMode === 'selected',
        description: 'Choose specific products to display',
      },
    },
    {
      name: 'numberOfProducts',
      type: 'number',
      label: 'Number of Products',
      defaultValue: 6,
      min: 1,
      max: 20,
      admin: {
        condition: (data, siblingData) => siblingData.displayMode !== 'selected',
        description: 'How many products to display',
      },
    },
    {
      name: 'showDescription',
      type: 'checkbox',
      label: 'Show Product Description',
      defaultValue: true,
    },
    {
      name: 'cardsPerRow',
      type: 'select',
      label: 'Cards Per Row',
      defaultValue: '3',
      options: [
        { label: '2 Cards', value: '2' },
        { label: '3 Cards', value: '3' },
        { label: '4 Cards', value: '4' },
      ],
      required: true,
    },
  ],
}
