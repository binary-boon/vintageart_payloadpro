// src/components/Cart/CartDropdown.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart, X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Media as MediaComponent } from '@/components/Media'
import { Media } from '@/payload-types'
import { formatPrice } from '@/utilities/shopHelpers'

export const CartDropdown: React.FC = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, isLoading } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        removeItem(productId)
      } else {
        updateQuantity(productId, newQuantity)
      }
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
        aria-label={`Shopping cart with ${totalItems} items`}
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Shopping Cart</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-gray-500">Loading cart...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">Your cart is empty</p>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.image && typeof item.product.image === 'object' && (
                        <Link
                          href={`/products/${item.product.id}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <MediaComponent
                            resource={item.product.image as Media}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </Link>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        onClick={() => setIsOpen(false)}
                        className="font-medium text-sm text-gray-900 truncate block hover:text-blue-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600 mb-2">
                        {formatPrice(item.product.price)}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          disabled={
                            item.product.stockQuantity
                              ? item.quantity >= item.product.stockQuantity
                              : false
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 p-1 mt-1"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && !isLoading && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg text-center block transition-colors font-medium"
                >
                  View Cart ({totalItems})
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center block transition-colors font-medium"
                >
                  Checkout
                </Link>
              </div>

              <div className="mt-3 text-xs text-gray-500 text-center">
                Free shipping on all orders
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
