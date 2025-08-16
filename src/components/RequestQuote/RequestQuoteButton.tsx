// src/components/RequestQuote/RequestQuoteButton.tsx
'use client'

import React from 'react'
import { Product } from '@/payload-types'
import { useQuotation } from '@/contexts/QuotationContext'
import { Button } from '@/components/ui/button'
import { FileText, Check } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface RequestQuoteButtonProps {
  product: Product
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outline'
  className?: string
  showIcon?: boolean
  fullWidth?: boolean
}

export const RequestQuoteButton: React.FC<RequestQuoteButtonProps> = ({
  product,
  size = 'md',
  variant = 'primary',
  className,
  showIcon = true,
  fullWidth = false,
}) => {
  const { addItem, state, setModalOpen } = useQuotation()

  // Check if product is already in quotation request
  const isInQuotation = state.items.some((item) => item.product.id === product.id)

  const handleRequestQuote = () => {
    if (!isInQuotation) {
      addItem(product, 1)
    }
    // Open the quotation modal/page
    setModalOpen(true)
  }

  const buttonSizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const buttonVariants = {
    primary: isInQuotation
      ? 'bg-green-600 text-white hover:bg-green-700 border-green-600'
      : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
    secondary: isInQuotation
      ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200'
      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200',
    outline: isInQuotation
      ? 'border-green-600 text-green-600 hover:bg-green-50'
      : 'border-blue-600 text-blue-600 hover:bg-blue-50',
  }

  return (
    <button
      onClick={handleRequestQuote}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
        buttonSizes[size],
        buttonVariants[variant],
        fullWidth ? 'w-full' : '',
        className,
      )}
      disabled={!product.inStock}
    >
      {showIcon && (
        <span className="mr-2">
          {isInQuotation ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
        </span>
      )}

      {!product.inStock ? 'Out of Stock' : isInQuotation ? 'Added to Quote' : 'Request Quote'}
    </button>
  )
}

// Quick add button for grid views
export const QuickRequestQuoteButton: React.FC<{ product: Product }> = ({ product }) => {
  const { addItem, state } = useQuotation()
  const isInQuotation = state.items.some((item) => item.product.id === product.id)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if used inside a Link
    e.stopPropagation()

    if (!isInQuotation && product.inStock) {
      addItem(product, 1)
    }
  }

  return (
    <button
      onClick={handleQuickAdd}
      disabled={!product.inStock || isInQuotation}
      className={cn(
        'absolute top-4 left-4 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100',
        isInQuotation
          ? 'bg-green-600 text-white'
          : product.inStock
            ? 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed',
      )}
      title={
        !product.inStock
          ? 'Out of Stock'
          : isInQuotation
            ? 'Added to Quote Request'
            : 'Quick Add to Quote Request'
      }
    >
      {isInQuotation ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
    </button>
  )
}
