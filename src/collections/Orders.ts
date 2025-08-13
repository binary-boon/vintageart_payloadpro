// src/collections/Orders.ts
import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Order',
    plural: 'Orders',
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'status', 'totalAmount', 'createdAt'],
    listSearchableFields: ['orderNumber', 'customerName', 'customerEmail'],
  },
  access: {
    create: () => true, // Allow order creation from frontend
    read: ({ req }) => {
      // Admin can read all orders
      if (req.user) return true
      // Public can't read orders (you might want to add customer-specific logic here)
      return false
    },
    update: ({ req }) => {
      // Only admin can update orders
      return Boolean(req.user)
    },
    delete: ({ req }) => {
      // Only admin can delete orders
      return Boolean(req.user)
    },
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated unique order number',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: {
        description: 'Current status of the order',
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Partially Refunded', value: 'partially_refunded' },
      ],
      admin: {
        description: 'Payment status of the order',
      },
    },
    // Customer Information
    {
      name: 'customerInfo',
      type: 'group',
      fields: [
        {
          name: 'customerName',
          type: 'text',
          required: true,
          admin: {
            description: 'Customer full name',
          },
        },
        {
          name: 'customerEmail',
          type: 'email',
          required: true,
          admin: {
            description: 'Customer email address',
          },
        },
        {
          name: 'customerPhone',
          type: 'text',
          admin: {
            description: 'Customer phone number',
          },
        },
      ],
    },
    // Shipping Address
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'fullName',
          type: 'text',
          required: true,
        },
        {
          name: 'addressLine1',
          type: 'text',
          required: true,
          admin: {
            description: 'Street address, house number, building name',
          },
        },
        {
          name: 'addressLine2',
          type: 'text',
          admin: {
            description: 'Apartment, suite, unit, floor, etc.',
          },
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          defaultValue: 'India',
        },
      ],
    },
    // Billing Address
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
        {
          name: 'sameAsShipping',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Use shipping address as billing address',
          },
        },
        {
          name: 'fullName',
          type: 'text',
          admin: {
            condition: (data) => !data.sameAsShipping,
          },
        },
        {
          name: 'addressLine1',
          type: 'text',
          admin: {
            condition: (data) => !data.sameAsShipping,
          },
        },
        {
          name: 'addressLine2',
          type: 'text',
          admin: {
            condition: (data) => !data.sameAsShipping,
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            condition: (data) => !data.sameAsShipping,
          },
        },
        {
          name: 'state',
          type: 'text',
          admin: {
            condition: (data) => !data.sameAsShipping,
          },
        },
        {
          name: 'postalCode',
          type: 'text',
          admin: {
            condition: (data) => !data.sameAsShipping,
          },
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'India',
          admin: {
            condition: (data) => !data.sameAsShipping,
          },
        },
      ],
    },
    // Order Items
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products', // Make sure this matches your Product collection slug
          required: true,
        },
        {
          name: 'productSnapshot',
          type: 'group',
          admin: {
            description: 'Product details at time of purchase',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'price',
              type: 'number',
              required: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'description',
              type: 'text',
            },
          ],
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          admin: {
            description: 'Price per unit at time of purchase',
          },
        },
        {
          name: 'totalPrice',
          type: 'number',
          required: true,
          admin: {
            description: 'Total price for this line item (unitPrice × quantity)',
          },
        },
      ],
    },
    // Pricing
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          admin: {
            description: 'Sum of all line items before tax and shipping',
          },
        },
        {
          name: 'shippingCost',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Shipping charges',
          },
        },
        {
          name: 'taxAmount',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total tax amount',
          },
        },
        {
          name: 'discountAmount',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total discount applied',
          },
        },
        {
          name: 'totalAmount',
          type: 'number',
          required: true,
          admin: {
            description: 'Final total amount (subtotal + shipping + tax - discount)',
          },
        },
      ],
    },
    // Payment Information
    {
      name: 'paymentInfo',
      type: 'group',
      fields: [
        {
          name: 'paymentMethod',
          type: 'select',
          options: [
            { label: 'PhonePe', value: 'phonepe' },
            { label: 'Razorpay', value: 'razorpay' },
            { label: 'Cash on Delivery', value: 'cod' },
          ],
        },
        {
          name: 'paymentId',
          type: 'text',
          admin: {
            description: 'Payment gateway transaction ID',
          },
        },
        {
          name: 'paymentDetails',
          type: 'json',
          admin: {
            description: 'Additional payment gateway response data',
          },
        },
      ],
    },
    // Shipping Information
    {
      name: 'shippingInfo',
      type: 'group',
      fields: [
        {
          name: 'trackingNumber',
          type: 'text',
          admin: {
            description: 'Shipping carrier tracking number',
          },
        },
        {
          name: 'carrier',
          type: 'text',
          admin: {
            description: 'Shipping carrier name',
          },
        },
        {
          name: 'estimatedDelivery',
          type: 'date',
          admin: {
            description: 'Estimated delivery date',
          },
        },
        {
          name: 'shippedAt',
          type: 'date',
          admin: {
            description: 'Date when order was shipped',
          },
        },
        {
          name: 'deliveredAt',
          type: 'date',
          admin: {
            description: 'Date when order was delivered',
          },
        },
      ],
    },
    // Order Notes
    {
      name: 'notes',
      type: 'group',
      fields: [
        {
          name: 'customerNotes',
          type: 'textarea',
          admin: {
            description: 'Notes from customer during checkout',
          },
        },
        {
          name: 'internalNotes',
          type: 'textarea',
          admin: {
            description: 'Internal notes for order processing (not visible to customer)',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Generate order number for new orders
        if (operation === 'create' && !data.orderNumber) {
          const timestamp = Date.now()
          const random = Math.floor(Math.random() * 1000)
          data.orderNumber = `ORD-${timestamp}-${random.toString().padStart(3, '0')}`
        }

        // Calculate totals
        if (data.items && Array.isArray(data.items)) {
          const subtotal = data.items.reduce((sum: number, item: any) => {
            const itemTotal = (item.unitPrice || 0) * (item.quantity || 0)
            item.totalPrice = itemTotal
            return sum + itemTotal
          }, 0)

          if (!data.pricing) data.pricing = {}
          data.pricing.subtotal = subtotal

          const shippingCost = data.pricing.shippingCost || 0
          const taxAmount = data.pricing.taxAmount || 0
          const discountAmount = data.pricing.discountAmount || 0

          data.pricing.totalAmount = subtotal + shippingCost + taxAmount - discountAmount
        }

        // Extract customer info for easier searching
        if (data.customerInfo) {
          data.customerName = data.customerInfo.customerName
          data.customerEmail = data.customerInfo.customerEmail
        }

        return data
      },
    ],
  },
  timestamps: true,
}
