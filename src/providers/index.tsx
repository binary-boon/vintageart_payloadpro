// src/providers/index.tsx - Fixed with QuotationSidebar
'use client'
import React from 'react'

import { AuthProvider } from './Auth'
import { ThemeProvider } from './Theme'
import { QuotationProvider } from '@/contexts/QuotationContext'

import { QuotationSidebar } from '@/components/RequestQuote/QuotationSidebar'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QuotationProvider>
          {children}
          {/* Add the QuotationSidebar globally so it's available everywhere */}
          <QuotationSidebar />
        </QuotationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
