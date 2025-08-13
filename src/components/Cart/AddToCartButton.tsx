// src/components/Cart/AddToCartButton.tsx
'use client'

import React, { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/payload-types'
import { ShoppingCart, Check, Loader2, Plus, Minus } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  showQuantitySelector?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outline'
  className?: string
  onSuccess?: () => void
  disabled?: boolean
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity: initialQuantity = 1,
  showQuantitySelector = false,
  size = 'md',
  variant = 'primary',
  className,
  onSuccess,
  disabled = false,
}) => {
  // Fixed: Changed getCartItemQuantity to getItemQuantity
  const { addItem, items, getItemQuantity } = useCart()
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isLoading, setIsLoading] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const isOutOfStock = product.inStock === false
  const hasStockLimit = product.stockQuantity && product.stockQuantity > 0
  // Fixed: Changed getCartItemQuantity to getItemQuantity
  const currentCartQuantity = getItemQuantity(product.id)
  const maxQuantity = hasStockLimit ? product.stockQuantity! - currentCartQuantity : 99
  const canAddMore = !isOutOfStock && maxQuantity > 0

  // Fixed: Added isInCart function since it's not in the context
  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId)
  }

  const handleAddToCart = async () => {
    if (disabled || isOutOfStock || !canAddMore) return

    setIsLoading(true)
    try {
      addItem(product, quantity)
      setJustAdded(true)
      onSuccess?.()

      // Reset the "just added" state after 2 seconds
      setTimeout(() => setJustAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      // You might want to show a toast notification here
      alert(error instanceof Error ? error.message : 'Failed to add item to cart')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity)
    }
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400',
    outline:
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white disabled:border-gray-400 disabled:text-gray-400',
  }

  if (isOutOfStock) {
    return (
      <button
        disabled
        className={cn(
          'font-medium rounded-lg transition-colors cursor-not-allowed',
          'bg-gray-300 text-gray-500',
          sizeClasses[size],
          className,
        )}
      >
        Out of Stock
      </button>
    )
  }

  if (!canAddMore && hasStockLimit) {
    return (
      <button
        disabled
        className={cn(
          'font-medium rounded-lg transition-colors cursor-not-allowed',
          'bg-gray-300 text-gray-500',
          sizeClasses[size],
          className,
        )}
      >
        Max Quantity Reached
      </button>
    )
  }

  return (
    <div className="space-y-3">
      {/* Quantity Selector */}
      {showQuantitySelector && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-base font-medium text-gray-900 min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {hasStockLimit && (
            <span className="text-sm text-gray-500">({maxQuantity} available)</span>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={disabled || isLoading || !canAddMore}
        className={cn(
          'flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed w-full',
          variantClasses[variant],
          sizeClasses[size],
          justAdded && 'bg-green-600 text-white hover:bg-green-700',
          className,
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Adding...
          </>
        ) : justAdded ? (
          <>
            <Check className="w-4 h-4" />
            Added to Cart!
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            {isInCart(product.id) ? 'Add More' : 'Add to Cart'}
          </>
        )}
      </button>

      {/* Stock Information */}
      {hasStockLimit && (
        <div className="text-xs text-gray-500">
          {product.stockQuantity! > 10 ? 'In Stock' : `Only ${product.stockQuantity} left in stock`}
          {currentCartQuantity > 0 && <span className="ml-1">({currentCartQuantity} in cart)</span>}
        </div>
      )}
    </div>
  )
}
