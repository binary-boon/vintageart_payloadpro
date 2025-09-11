// src/components/WhatsAppWidget/ClientWidget.tsx
'use client'

import React from 'react'
import { WhatsAppWidget } from './index'
import { usePathname } from 'next/navigation'

export const ClientWhatsAppWidget: React.FC = () => {
  const pathname = usePathname()

  // Don't show widget on admin pages
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <WhatsAppWidget
      phoneNumber="917014534242"
      message="Hello! I'm interested in your vintage art collection and would like to know more about your products."
      companyName="Vintage Art & Decor"
      description="We typically reply within minutes"
      position="bottom-right"
      size="medium"
      showPopup={true}
    />
  )
}
