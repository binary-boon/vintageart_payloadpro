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
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      admin: {
        description: 'Optional description/subheading that appears below the title',
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
    {
      name: 'callToAction',
      type: 'group',
      label: 'Call to Action Button',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show Call to Action Button',
          defaultValue: false,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'View All Products',
          admin: {
            condition: (data, siblingData) => siblingData.enabled,
          },
          required: true,
        },
        {
          name: 'linkType',
          type: 'radio',
          label: 'Link Type',
          defaultValue: 'internal',
          options: [
            {
              label: 'Internal Page',
              value: 'internal',
            },
            {
              label: 'External URL',
              value: 'external',
            },
          ],
          admin: {
            condition: (data, siblingData) => siblingData.enabled,
          },
          required: true,
        },
        {
          name: 'internalLink',
          type: 'relationship',
          relationTo: 'pages',
          label: 'Internal Page',
          admin: {
            condition: (data, siblingData) =>
              siblingData.enabled && siblingData.linkType === 'internal',
          },
        },
        {
          name: 'externalLink',
          type: 'text',
          label: 'External URL',
          admin: {
            condition: (data, siblingData) =>
              siblingData.enabled && siblingData.linkType === 'external',
            description: 'Include the full URL (e.g., https://example.com)',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Open in New Tab',
          defaultValue: false,
          admin: {
            condition: (data, siblingData) => siblingData.enabled,
          },
        },
        {
          name: 'appearance',
          type: 'select',
          label: 'Button Style',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Default', value: 'default' },
          ],
          admin: {
            condition: (data, siblingData) => siblingData.enabled,
          },
        },
      ],
    },
  ],
}
