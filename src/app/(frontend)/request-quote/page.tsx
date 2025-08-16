// src/app/(frontend)/request-quote/page.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuotation } from '@/contexts/QuotationContext'
import { Media as MediaComponent } from '@/components/Media'
import { formatPrice } from '@/utilities/shopHelpers'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Media } from '@/payload-types'
import {
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  MessageSquare,
  Send,
  Plus,
  Minus,
  X,
} from 'lucide-react'

interface FormData {
  customerName: string
  email: string
  phone: string
  company: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  projectDetails: {
    projectType: string
    budget: string
    timeline: string
    deliveryAddress: string
  }
  additionalRequirements: string
  hearAboutUs: string
}

export default function RequestQuotePage() {
  const router = useRouter()
  const { state, updateQuantity, updateRequirements, removeItem, clearItems } = useQuotation()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    email: '',
    phone: '',
    company: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
    projectDetails: {
      projectType: '',
      budget: '',
      timeline: '',
      deliveryAddress: '',
    },
    additionalRequirements: '',
    hearAboutUs: '',
  })

  // Redirect if no items in quotation
  React.useEffect(() => {
    if (state.items.length === 0 && !success) {
      router.push('/shop')
    }
  }, [state.items.length, router, success])

  const totalEstimate = state.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const leadData = {
        ...formData,
        products: state.items.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
          customRequirements: item.customRequirements || '',
        })),
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit quote request')
      }

      const result = await response.json()
      setSuccess(true)
      clearItems()

      // Optional: Redirect to success page
      setTimeout(() => {
        router.push('/quote-success')
      }, 3000)
    } catch (error) {
      console.error('Error submitting quote request:', error)
      alert('Failed to submit quote request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as any),
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Quote Request Sent!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for your interest. We'll review your request and get back to you within 24
              hours.
            </p>
            <button
              onClick={() => router.push('/shop')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (state.items.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Quote</h1>
          <p className="text-gray-600">
            Fill out the form below to get a personalized quote for your selected items.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => updateFormData('customerName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => updateFormData('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Address</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => updateFormData('address.street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => updateFormData('address.city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => updateFormData('address.state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={formData.address.postalCode}
                        onChange={(e) => updateFormData('address.postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Project Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Type
                    </label>
                    <select
                      value={formData.projectDetails.projectType}
                      onChange={(e) => updateFormData('projectDetails.projectType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select project type</option>
                      <option value="home-decoration">Home Decoration</option>
                      <option value="office-interior">Office Interior</option>
                      <option value="hospitality">Restaurant/Hotel</option>
                      <option value="retail">Retail Space</option>
                      <option value="event">Event/Exhibition</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget Range
                    </label>
                    <select
                      value={formData.projectDetails.budget}
                      onChange={(e) => updateFormData('projectDetails.budget', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-10k">Under ₹10,000</option>
                      <option value="10k-50k">₹10,000 - ₹50,000</option>
                      <option value="50k-100k">₹50,000 - ₹1,00,000</option>
                      <option value="100k-500k">₹1,00,000 - ₹5,00,000</option>
                      <option value="above-500k">Above ₹5,00,000</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                    <select
                      value={formData.projectDetails.timeline}
                      onChange={(e) => updateFormData('projectDetails.timeline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-2-weeks">1-2 weeks</option>
                      <option value="1-month">1 month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      How did you hear about us?
                    </label>
                    <select
                      value={formData.hearAboutUs}
                      onChange={(e) => updateFormData('hearAboutUs', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select option</option>
                      <option value="google">Google Search</option>
                      <option value="social-media">Social Media</option>
                      <option value="word-of-mouth">Word of Mouth</option>
                      <option value="advertisement">Advertisement</option>
                      <option value="existing-customer">Existing Customer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={formData.additionalRequirements}
                    onChange={(e) => updateFormData('additionalRequirements', e.target.value)}
                    placeholder="Please describe any specific requirements, customizations, or questions you have..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Quote Request
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  We'll get back to you within 24 hours with a detailed quote.
                </p>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Selected Items</h3>
              </div>

              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
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
                      <p className="text-xs text-gray-500">{formatPrice(item.product.price)}</p>

                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-0.5 text-gray-400 hover:text-gray-600 rounded"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-1 py-0.5 text-xs font-medium bg-white border rounded">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-0.5 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto p-0.5 text-red-400 hover:text-red-600 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">Total Items:</span>
                  <span className="text-sm text-gray-600">{state.items.length}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-900">Estimated Total:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(totalEstimate)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  *This is an estimate. Final pricing may vary based on customization and
                  requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
