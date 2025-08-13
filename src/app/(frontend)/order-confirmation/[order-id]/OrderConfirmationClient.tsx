// src/app/(frontend)/order-confirmation/[orderId]/OrderConfirmationClient.tsx
'use client'

import React, { useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Media as MediaComponent } from '@/components/Media'
import { Media } from '@/payload-types'
import { formatPrice } from '@/utilities/shopHelpers'
import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Download,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  customerInfo: {
    customerName: string
    customerEmail: string
    customerPhone?: string
  }
  shippingAddress: {
    fullName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  items: Array<{
    product: {
      id: string
      name: string
    }
    productSnapshot: {
      name: string
      price: number
      image?: string | Media
      description?: string
    }
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  pricing: {
    subtotal: number
    shippingCost: number
    taxAmount: number
    discountAmount: number
    totalAmount: number
  }
  paymentInfo?: {
    paymentMethod: string
    paymentId?: string
  }
  customerNotes?: string
  createdAt: string
}

interface OrderConfirmationClientProps {
  order: Order
}

export const OrderConfirmationClient: React.FC<OrderConfirmationClientProps> = ({ order }) => {
  const { clearCart } = useCart()

  // Clear cart when order is confirmed
  useEffect(() => {
    clearCart()
  }, [clearCart])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'shipped':
        return 'text-purple-600 bg-purple-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'razorpay':
        return 'Razorpay'
      case 'phonepe':
        return 'PhonePe'
      case 'cod':
        return 'Cash on Delivery'
      default:
        return method
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-4">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-xl font-bold text-gray-900">{order.orderNumber}</p>
            </div>
          </div>

          {/* Order Status & Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.paymentStatus)}`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Download Invoice
                </button>
                <Link
                  href="/shop"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Order Items</h2>
              </div>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.productSnapshot.image &&
                        typeof item.productSnapshot.image === 'object' && (
                          <MediaComponent
                            resource={item.productSnapshot.image as Media}
                            className="w-full h-full object-cover"
                          />
                        )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {item.productSnapshot.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {formatPrice(item.unitPrice)} × {item.quantity}
                        </span>
                        <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.pricing.subtotal)}</span>
                  </div>
                  {order.pricing.shippingCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{formatPrice(order.pricing.shippingCost)}</span>
                    </div>
                  )}
                  {order.pricing.shippingCost === 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                  )}
                  {order.pricing.taxAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>{formatPrice(order.pricing.taxAmount)}</span>
                    </div>
                  )}
                  {order.pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(order.pricing.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatPrice(order.pricing.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Customer Information</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">{order.customerInfo.customerName}</p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {order.customerInfo.customerEmail}
                  </p>
                  {order.customerInfo.customerPhone && (
                    <p className="text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {order.customerInfo.customerPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Shipping Address</h3>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p className="text-gray-600">{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && (
                      <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
                    )}
                    <p className="text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-600">{order.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Payment Information</h3>
                </div>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Payment Method: </span>
                    {order.paymentInfo
                      ? getPaymentMethodDisplay(order.paymentInfo.paymentMethod)
                      : 'Not specified'}
                  </p>
                  {order.paymentInfo?.paymentId && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Transaction ID: </span>
                      {order.paymentInfo.paymentId}
                    </p>
                  )}
                </div>
              </div>

              {/* Customer Notes */}
              {order.customerNotes && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Notes</h3>
                  <p className="text-gray-600">{order.customerNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
            <h3 className="text-lg font-semibold mb-6">Order Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Order Placed</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              {order.status !== 'pending' && (
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Order Confirmed</p>
                    <p className="text-sm text-gray-600">Your order is being processed</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Need Help?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-800 mb-1">Order Questions</p>
                <p className="text-blue-700">
                  Contact our support team for order updates and inquiries.
                </p>
              </div>
              <div>
                <p className="font-medium text-blue-800 mb-1">Return Policy</p>
                <p className="text-blue-700">Items can be returned within 30 days of delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
