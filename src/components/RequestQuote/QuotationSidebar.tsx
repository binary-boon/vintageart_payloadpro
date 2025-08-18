// src/components/RequestQuote/QuotationSidebar.tsx - FINAL FIXED VERSION
'use client'

import React from 'react'
import { useQuotation } from '@/contexts/QuotationContext'
import { Media as MediaComponent } from '@/components/Media'
import { X, Plus, Minus, FileText, ArrowRight } from 'lucide-react'
import { Media } from '@/payload-types'
import Link from 'next/link'

export const QuotationSidebar: React.FC = () => {
  const { state, removeItem, updateQuantity, setModalOpen } = useQuotation()

  if (!state.isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setModalOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Quote Request</h2>
          </div>
          <button
            onClick={() => setModalOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items selected</h3>
              <p className="text-gray-500 mb-6">
                Browse our products and add items to request a quote
              </p>
              <Link
                href="/shop"
                onClick={() => setModalOpen(false)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Items List */}
              {state.items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    {item.product.image && typeof item.product.image === 'object' && (
                      <MediaComponent
                        resource={item.product.image as Media}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{item.product.name}</h4>
                    <p className="text-sm text-blue-600 font-medium">Custom Quote Item</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-2 py-1 text-sm font-medium bg-white border rounded min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto p-1 text-red-400 hover:text-red-600 rounded transition-colors"
                        title="Remove from quote"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Custom Requirements */}
                    {item.customRequirements && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Notes:</span> {item.customRequirements}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Summary - NO PRICING */}
              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">Total Items:</span>
                  <span className="text-sm text-gray-600">{state.items.length}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-900">Total Quantity:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {state.items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    🎨 Custom Thikri Artwork Quote
                  </p>
                  <p className="text-xs text-blue-600">
                    Each piece is handcrafted to your specifications. Pricing depends on size,
                    materials, and customization details.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t bg-white p-6">
            <Link
              href="/request-quote"
              onClick={() => setModalOpen(false)}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Proceed to Quote Request
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <p className="text-xs text-gray-500 text-center mt-2">
              Fill out details to get a personalized quote within 24 hours
            </p>
          </div>
        )}
      </div>
    </>
  )
}
