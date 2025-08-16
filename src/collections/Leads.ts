// src/collections/Leads.ts
import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: 'Lead',
    plural: 'Leads',
  },
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'email', 'phone', 'status', 'createdAt'],
    group: 'Sales',
  },
  access: {
    read: ({ req: { user } }) => {
      // Only admin users can read leads
      return Boolean(user)
    },
    create: () => true, // Allow public creation from frontend
    update: ({ req: { user } }) => {
      return Boolean(user)
    },
    delete: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      required: true,
      label: 'Customer Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Phone Number',
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company Name',
    },
    {
      name: 'address',
      type: 'group',
      label: 'Address',
      fields: [
        {
          name: 'street',
          type: 'text',
          label: 'Street Address',
        },
        {
          name: 'city',
          type: 'text',
          label: 'City',
        },
        {
          name: 'state',
          type: 'text',
          label: 'State/Province',
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'Postal Code',
        },
        {
          name: 'country',
          type: 'text',
          label: 'Country',
          defaultValue: 'India',
        },
      ],
    },
    {
      name: 'products',
      type: 'array',
      label: 'Requested Products',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
          min: 1,
        },
        {
          name: 'customRequirements',
          type: 'textarea',
          label: 'Custom Requirements',
          admin: {
            description: 'Any specific requirements for this product',
          },
        },
      ],
    },
    {
      name: 'projectDetails',
      type: 'group',
      label: 'Project Details',
      fields: [
        {
          name: 'projectType',
          type: 'select',
          label: 'Project Type',
          options: [
            { label: 'Home Decoration', value: 'home-decoration' },
            { label: 'Office Interior', value: 'office-interior' },
            { label: 'Restaurant/Hotel', value: 'hospitality' },
            { label: 'Retail Space', value: 'retail' },
            { label: 'Event/Exhibition', value: 'event' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'budget',
          type: 'select',
          label: 'Budget Range',
          options: [
            { label: 'Under ₹10,000', value: 'under-10k' },
            { label: '₹10,000 - ₹50,000', value: '10k-50k' },
            { label: '₹50,000 - ₹1,00,000', value: '50k-100k' },
            { label: '₹1,00,000 - ₹5,00,000', value: '100k-500k' },
            { label: 'Above ₹5,00,000', value: 'above-500k' },
            { label: 'Flexible', value: 'flexible' },
          ],
        },
        {
          name: 'timeline',
          type: 'select',
          label: 'Project Timeline',
          options: [
            { label: 'ASAP', value: 'asap' },
            { label: '1-2 weeks', value: '1-2-weeks' },
            { label: '1 month', value: '1-month' },
            { label: '2-3 months', value: '2-3-months' },
            { label: 'Flexible', value: 'flexible' },
          ],
        },
        {
          name: 'deliveryAddress',
          type: 'textarea',
          label: 'Delivery Address',
          admin: {
            description: 'If different from customer address',
          },
        },
      ],
    },
    {
      name: 'additionalRequirements',
      type: 'textarea',
      label: 'Additional Requirements',
      admin: {
        description: 'Any other specific requirements or questions',
      },
    },
    {
      name: 'hearAboutUs',
      type: 'select',
      label: 'How did you hear about us?',
      options: [
        { label: 'Google Search', value: 'google' },
        { label: 'Social Media', value: 'social-media' },
        { label: 'Word of Mouth', value: 'word-of-mouth' },
        { label: 'Advertisement', value: 'advertisement' },
        { label: 'Existing Customer', value: 'existing-customer' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Lead Status',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Negotiating', value: 'negotiating' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
        { label: 'On Hold', value: 'on-hold' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Priority',
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Assigned To',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'array',
      label: 'Internal Notes',
      fields: [
        {
          name: 'note',
          type: 'textarea',
          required: true,
        },
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'date',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
        },
      ],
      admin: {
        description: 'Internal notes for tracking lead progress',
      },
    },
    {
      name: 'quotedAmount',
      type: 'number',
      label: 'Quoted Amount (₹)',
      admin: {
        position: 'sidebar',
        condition: (data) => ['quoted', 'negotiating', 'won'].includes(data.status),
      },
    },
    {
      name: 'followUpDate',
      type: 'date',
      label: 'Follow-up Date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Send email notification to admin when new lead is created
        if (operation === 'create') {
          try {
            // Here you would integrate with your email service
            // For now, we'll just log it
            console.log('New lead created:', {
              customerName: doc.customerName,
              email: doc.email,
              products: doc.products?.length || 0,
              id: doc.id,
            })

            // You can integrate with services like:
            // - Nodemailer
            // - SendGrid
            // - Resend
            // - Amazon SES
          } catch (error) {
            console.error('Failed to send lead notification email:', error)
          }
        }
      },
    ],
  },
  timestamps: true,
}
