// src/collections/Product/index.ts (Enhanced for Thikri Artworks)
import type { CollectionConfig } from 'payload'

export const Product: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'featured', 'publishedAt'],
    group: 'Shop',
  },
  access: {
    read: () => true, // Allow public read access
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Artwork Name',
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
        {
          name: 'caption',
          type: 'text',
          label: 'Image Caption (Optional)',
        },
      ],
      admin: {
        description: 'Add multiple images to showcase different angles and details of your artwork',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description',
      admin: {
        description: 'Brief description shown in product cards and previews',
      },
    },
    {
      name: 'fullDescription',
      type: 'richText',
      label: 'Detailed Description',
      admin: {
        description: 'Comprehensive description of the artwork, materials, and craftsmanship',
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
        description: 'Tags for filtering and search (e.g., "handmade", "glass", "metal", "thikri")',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Artwork',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Display this artwork in featured sections',
      },
    },

    // Artwork-specific fields
    {
      name: 'artworkDetails',
      type: 'group',
      label: 'Artwork Details',
      fields: [
        {
          name: 'materials',
          type: 'array',
          label: 'Materials Used',
          fields: [
            {
              name: 'material',
              type: 'select',
              options: [
                { label: 'Glass', value: 'glass' },
                { label: 'Metal', value: 'metal' },
                { label: 'Wood', value: 'wood' },
                { label: 'Brass', value: 'brass' },
                { label: 'Silver', value: 'silver' },
                { label: 'Gold Leaf', value: 'gold-leaf' },
                { label: 'Mirror', value: 'mirror' },
                { label: 'Other', value: 'other' },
              ],
              required: true,
            },
            {
              name: 'customMaterial',
              type: 'text',
              label: 'Custom Material',
              admin: {
                condition: (data, siblingData) => siblingData.material === 'other',
              },
            },
          ],
          admin: {
            description: 'Select all materials used in this Thikri artwork',
          },
        },
        {
          name: 'technique',
          type: 'select',
          label: 'Primary Technique',
          options: [
            { label: 'Traditional Thikri', value: 'traditional-thikri' },
            { label: 'Mirror Work', value: 'mirror-work' },
            { label: 'Glass Mosaic', value: 'glass-mosaic' },
            { label: 'Metal Inlay', value: 'metal-inlay' },
            { label: 'Mixed Media', value: 'mixed-media' },
          ],
        },
        {
          name: 'origin',
          type: 'select',
          label: 'Origin/Style',
          options: [
            { label: 'Rajasthani', value: 'rajasthani' },
            { label: 'Gujarati', value: 'gujarati' },
            { label: 'Mughal', value: 'mughal' },
            { label: 'Contemporary', value: 'contemporary' },
            { label: 'Traditional', value: 'traditional' },
          ],
        },
        {
          name: 'timeToCreate',
          type: 'text',
          label: 'Creation Time',
          admin: {
            description: 'e.g., "3-4 weeks", "2 months" - how long it takes to create this piece',
          },
        },
        {
          name: 'customizable',
          type: 'checkbox',
          label: 'Available for Customization',
          defaultValue: true,
          admin: {
            description:
              'Can this artwork be customized in terms of size, colors, or design elements?',
          },
        },
      ],
    },

    // Size and Color variants (informational display only)
    {
      name: 'availableVariants',
      type: 'group',
      label: 'Available Variants (Display Only)',
      fields: [
        {
          name: 'sizes',
          type: 'array',
          label: 'Available Sizes',
          fields: [
            {
              name: 'sizeLabel',
              type: 'text',
              required: true,
              label: 'Size Description',
              admin: {
                description: 'e.g., "Small (15x15 cm)", "Medium (25x25 cm)"',
              },
            },
          ],
          admin: {
            description: 'List all available sizes for display purposes',
          },
        },
        {
          name: 'colors',
          type: 'array',
          label: 'Available Colors/Finishes',
          fields: [
            {
              name: 'colorLabel',
              type: 'text',
              required: true,
              label: 'Color/Finish Description',
              admin: {
                description: 'e.g., "Traditional Gold", "Silver Accent", "Colorful Glass"',
              },
            },
          ],
          admin: {
            description: 'List all available colors and finishes for display purposes',
          },
        },
      ],
      admin: {
        description:
          'These variants are for informational display only and do not affect inventory',
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
          admin: {
            step: 0.1,
          },
        },
        {
          name: 'height',
          type: 'number',
          label: 'Height (cm)',
          admin: {
            step: 0.1,
          },
        },
        {
          name: 'depth',
          type: 'number',
          label: 'Depth (cm)',
          admin: {
            step: 0.1,
          },
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Weight (kg)',
          admin: {
            step: 0.01,
          },
        },
      ],
    },

    // Care Instructions
    {
      name: 'careInstructions',
      type: 'group',
      label: 'Care & Maintenance',
      fields: [
        {
          name: 'cleaningInstructions',
          type: 'textarea',
          label: 'Cleaning Instructions',
          admin: {
            description: 'How to properly clean and maintain this artwork',
          },
        },
        {
          name: 'handlingTips',
          type: 'textarea',
          label: 'Handling Tips',
          admin: {
            description: 'Special handling or placement recommendations',
          },
        },
        {
          name: 'durability',
          type: 'select',
          label: 'Durability Rating',
          options: [
            { label: 'Delicate - Handle with Care', value: 'delicate' },
            { label: 'Moderate - Standard Care', value: 'moderate' },
            { label: 'Durable - Long-lasting', value: 'durable' },
          ],
        },
      ],
    },

    // Shipping Information
    {
      name: 'shipping',
      type: 'group',
      label: 'Shipping Information',
      fields: [
        {
          name: 'packagingNotes',
          type: 'textarea',
          label: 'Special Packaging Requirements',
          admin: {
            description: 'Any special packaging or handling requirements for shipping',
          },
        },
        {
          name: 'fragile',
          type: 'checkbox',
          label: 'Fragile Item',
          defaultValue: true,
          admin: {
            description: 'Mark if this item requires fragile handling during shipping',
          },
        },
      ],
    },

    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'Custom meta title for search engines',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Custom meta description for search engines (150-160 characters)',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Keywords',
          admin: {
            description: 'SEO keywords separated by commas',
          },
        },
      ],
      admin: {
        position: 'sidebar',
      },
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

        // Auto-generate slug if not provided
        if (!data.slug && data.name) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }

        return data
      },
    ],
  },
  timestamps: true,
}
