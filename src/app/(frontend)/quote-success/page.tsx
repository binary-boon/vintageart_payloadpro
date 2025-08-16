// src/app/(frontend)/quote-success/page.tsx
import React from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Phone, Mail, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quote Request Submitted - Vintage Art & Decor',
  description: 'Your quote request has been successfully submitted. We will get back to you soon.',
}

export default function QuoteSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Main Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Quote Request Submitted Successfully!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Thank you for your interest in our vintage art and decor pieces. We've received your
            quote request and our team will review it shortly.
          </p>

          {/* What Happens Next */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Review</h3>
                <p className="text-sm text-gray-600">
                  We'll review your requirements within 2-4 hours
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Contact</h3>
                <p className="text-sm text-gray-600">Our team will reach out to discuss details</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Quote</h3>
                <p className="text-sm text-gray-600">
                  You'll receive a detailed quote within 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need immediate assistance?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="tel:+911234567890"
                className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call us: +91 12345 67890
              </a>
              <a
                href="mailto:quotes@vintageart.com"
                className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email: quotes@vintageart.com
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t text-sm text-gray-500">
            <p className="mb-2">
              <strong>Quote Request ID:</strong> Will be provided via email
            </p>
            <p>For future reference, please save this page or note down your contact details.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
