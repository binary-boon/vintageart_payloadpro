// src/components/RequestQuote/QuotationIcon.tsx
'use client'

import React from 'react'
import { useQuotation } from '@/contexts/QuotationContext'
import { FileText } from 'lucide-react'

interface QuotationIconProps {
  className?: string
}

export const QuotationIcon: React.FC<QuotationIconProps> = ({ className }) => {
  const { totalItems, toggleModal } = useQuotation()

  return (
    <button
      onClick={toggleModal}
      className={`relative inline-flex items-center p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${className}`}
      aria-label="Quote Request"
      title="Quote Request"
    >
      <FileText className="w-6 h-6" />

      {/* Badge */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full min-w-[1.25rem] h-5">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
