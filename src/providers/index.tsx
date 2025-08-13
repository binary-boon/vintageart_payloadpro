// src/providers/index.tsx
'use client'

import React from 'react'

import { ThemeProvider } from './Theme'
import { CartProvider } from '@/contexts/CartContext'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  )
}
