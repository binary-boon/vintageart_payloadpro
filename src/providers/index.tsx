// src/providers/index.tsx - Fixed with CartProvider
'use client'
import React from 'react'

import { AuthProvider } from './Auth'
import { ThemeProvider } from './Theme'
import { QuotationProvider } from '@/contexts/QuotationContext'
import { CartProvider } from '@/contexts/CartContext'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <QuotationProvider>{children}</QuotationProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
