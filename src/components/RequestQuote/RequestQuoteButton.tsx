// src/components/RequestQuote/RequestQuoteButton.tsx - DEBUG VERSION
'use client'

import React from 'react'
import { Product } from '@/payload-types'
import { useQuotation } from '@/contexts/QuotationContext'
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

  // Debug logging
  console.log('RequestQuoteButton rendered with:', {
    productId: product.id,
    productName: product.name,
    hasAddItem: typeof addItem === 'function',
    hasSetModalOpen: typeof setModalOpen === 'function',
    currentItems: state.items.length,
    state: state,
  })

  // Check if product is already in quotation request
  const isInQuotation = state.items.some((item) => item.product.id === product.id)

  const handleRequestQuote = () => {
    console.log('Request quote button clicked for:', product.name)
    console.log('Is in quotation already:', isInQuotation)

    try {
      if (!isInQuotation) {
        console.log('Adding item to quotation...')
        addItem(product, 1)
        console.log('Item added successfully')
      }

      console.log('Opening modal...')
      setModalOpen(true)
      console.log('Modal opened')
    } catch (error) {
      console.error('Error in handleRequestQuote:', error)
    }
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
        'inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        buttonSizes[size],
        buttonVariants[variant],
        fullWidth ? 'w-full' : '',
        className,
      )}
    >
      {showIcon && (
        <span className="mr-2">
          {isInQuotation ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
        </span>
      )}

      {isInQuotation ? 'Added to Quote' : 'Request Quote'}
    </button>
  )
}

// Quick add button for grid views - ALSO FIXED
export const QuickRequestQuoteButton: React.FC<{ product: Product }> = ({ product }) => {
  const { addItem, state } = useQuotation()
  const isInQuotation = state.items.some((item) => item.product.id === product.id)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if used inside a Link
    e.stopPropagation()

    console.log('Quick add button clicked for:', product.name)
    console.log('Is in quotation already:', isInQuotation)

    try {
      if (!isInQuotation) {
        console.log('Adding item via quick add...')
        addItem(product, 1)
        console.log('Item added via quick add successfully')
      }
    } catch (error) {
      console.error('Error in handleQuickAdd:', error)
    }
  }

  return (
    <button
      onClick={handleQuickAdd}
      disabled={isInQuotation}
      className={cn(
        'absolute top-4 left-4 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100',
        isInQuotation
          ? 'bg-green-600 text-white cursor-default'
          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer',
      )}
      title={isInQuotation ? 'Added to Quote Request' : 'Quick Add to Quote Request'}
    >
      {isInQuotation ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
    </button>
  )
}
