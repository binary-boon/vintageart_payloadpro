// src/components/Checkout/CheckoutForm.tsx
'use client'

import React, { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import { Media as MediaComponent } from '@/components/Media'
import { Media } from '@/payload-types'
import { formatPrice } from '@/utilities/shopHelpers'
import { CreditCard, Truck, User, MapPin, Phone, Mail, Shield } from 'lucide-react'

interface CheckoutFormData {
  customerInfo: {
    fullName: string
    email: string
    phone: string
  }
  shippingAddress: {
    fullName: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  billingAddress: {
    sameAsShipping: boolean
    fullName: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod: 'phonepe' | 'razorpay' | 'cod'
  customerNotes: string
}

const initialFormData: CheckoutFormData = {
  customerInfo: {
    fullName: '',
    email: '',
    phone: '',
  },
  shippingAddress: {
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  },
  billingAddress: {
    sameAsShipping: true,
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  },
  paymentMethod: 'razorpay',
  customerNotes: '',
}

export const CheckoutForm: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const updateFormData = (section: keyof CheckoutFormData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))

    // Clear error when user starts typing
    const errorKey = `${section}.${field}`
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: '',
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    // Customer Info validation
    if (!formData.customerInfo.fullName) {
      newErrors['customerInfo.fullName'] = 'Full name is required'
    }
    if (!formData.customerInfo.email) {
      newErrors['customerInfo.email'] = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.customerInfo.email)) {
      newErrors['customerInfo.email'] = 'Email is invalid'
    }
    if (!formData.customerInfo.phone) {
      newErrors['customerInfo.phone'] = 'Phone number is required'
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.customerInfo.phone)) {
      newErrors['customerInfo.phone'] = 'Phone number is invalid'
    }

    // Shipping Address validation
    if (!formData.shippingAddress.fullName) {
      newErrors['shippingAddress.fullName'] = 'Full name is required'
    }
    if (!formData.shippingAddress.addressLine1) {
      newErrors['shippingAddress.addressLine1'] = 'Address is required'
    }
    if (!formData.shippingAddress.city) {
      newErrors['shippingAddress.city'] = 'City is required'
    }
    if (!formData.shippingAddress.state) {
      newErrors['shippingAddress.state'] = 'State is required'
    }
    if (!formData.shippingAddress.postalCode) {
      newErrors['shippingAddress.postalCode'] = 'Postal code is required'
    }

    // Billing Address validation (if different from shipping)
    if (!formData.billingAddress.sameAsShipping) {
      if (!formData.billingAddress.fullName) {
        newErrors['billingAddress.fullName'] = 'Full name is required'
      }
      if (!formData.billingAddress.addressLine1) {
        newErrors['billingAddress.addressLine1'] = 'Address is required'
      }
      if (!formData.billingAddress.city) {
        newErrors['billingAddress.city'] = 'City is required'
      }
      if (!formData.billingAddress.state) {
        newErrors['billingAddress.state'] = 'State is required'
      }
      if (!formData.billingAddress.postalCode) {
        newErrors['billingAddress.postalCode'] = 'Postal code is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare order data
      const orderData = {
        customerInfo: formData.customerInfo,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.billingAddress.sameAsShipping
          ? formData.shippingAddress
          : formData.billingAddress,
        items: items.map((item) => ({
          product: item.product.id,
          productSnapshot: {
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            description: item.product.description,
          },
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity,
        })),
        pricing: {
          subtotal: totalPrice,
          shippingCost: 0, // Free shipping
          taxAmount: 0, // Calculate if needed
          discountAmount: 0,
          totalAmount: totalPrice,
        },
        paymentMethod: formData.paymentMethod,
        customerNotes: formData.customerNotes,
      }

      // Create order and initiate payment
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const result = await response.json()

      if (formData.paymentMethod === 'cod') {
        // For COD, redirect to success page
        clearCart()
        router.push(`/order-confirmation/${result.orderId}`)
      } else {
        // For online payment, redirect to payment gateway
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl
        } else if (result.paymentData) {
          // Handle Razorpay integration
          initializeRazorpayPayment(result.paymentData, result.orderId)
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const initializeRazorpayPayment = (paymentData: any, orderId: string) => {
    // This will be implemented when we add Razorpay script
    console.log('Initialize Razorpay payment', paymentData, orderId)
  }

  const subtotal = totalPrice
  const shipping = 0 // Free shipping
  const tax = 0 // No tax for now
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your order below</p>
          </div>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Customer Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customerInfo.fullName}
                      onChange={(e) => updateFormData('customerInfo', 'fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                    {errors['customerInfo.fullName'] && (
                      <p className="text-red-600 text-sm mt-1">{errors['customerInfo.fullName']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.customerInfo.phone}
                      onChange={(e) => updateFormData('customerInfo', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                    {errors['customerInfo.phone'] && (
                      <p className="text-red-600 text-sm mt-1">{errors['customerInfo.phone']}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.customerInfo.email}
                      onChange={(e) => updateFormData('customerInfo', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email address"
                    />
                    {errors['customerInfo.email'] && (
                      <p className="text-red-600 text-sm mt-1">{errors['customerInfo.email']}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.shippingAddress.fullName}
                      onChange={(e) =>
                        updateFormData('shippingAddress', 'fullName', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full name for delivery"
                    />
                    {errors['shippingAddress.fullName'] && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors['shippingAddress.fullName']}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={formData.shippingAddress.addressLine1}
                      onChange={(e) =>
                        updateFormData('shippingAddress', 'addressLine1', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="House number, street name"
                    />
                    {errors['shippingAddress.addressLine1'] && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors['shippingAddress.addressLine1']}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={formData.shippingAddress.addressLine2}
                      onChange={(e) =>
                        updateFormData('shippingAddress', 'addressLine2', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Apartment, suite, unit, floor, etc."
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        value={formData.shippingAddress.city}
                        onChange={(e) => updateFormData('shippingAddress', 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="City"
                      />
                      {errors['shippingAddress.city'] && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors['shippingAddress.city']}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.state}
                        onChange={(e) => updateFormData('shippingAddress', 'state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="State"
                      />
                      {errors['shippingAddress.state'] && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors['shippingAddress.state']}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress.postalCode}
                        onChange={(e) =>
                          updateFormData('shippingAddress', 'postalCode', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Postal code"
                      />
                      {errors['shippingAddress.postalCode'] && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors['shippingAddress.postalCode']}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="razorpay"
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === 'razorpay'}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, paymentMethod: e.target.value as any }))
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="razorpay" className="ml-3 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Razorpay</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        Credit/Debit Card, UPI, Net Banking
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="phonepe"
                      type="radio"
                      name="paymentMethod"
                      value="phonepe"
                      checked={formData.paymentMethod === 'phonepe'}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, paymentMethod: e.target.value as any }))
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="phonepe" className="ml-3 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">PhonePe</span>
                      </div>
                      <span className="text-sm text-gray-600">UPI, Cards, Wallets</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="cod"
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, paymentMethod: e.target.value as any }))
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="cod" className="ml-3 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-orange-600" />
                        <span className="font-medium">Cash on Delivery</span>
                      </div>
                      <span className="text-sm text-gray-600">Pay when you receive</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Order Notes (Optional)</h2>
                <textarea
                  value={formData.customerNotes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, customerNotes: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special instructions for your order..."
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.image && typeof item.product.image === 'object' && (
                          <MediaComponent
                            resource={item.product.image as Media}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Your payment information is secure and encrypted
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
