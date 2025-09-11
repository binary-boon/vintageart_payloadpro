// src/components/WhatsAppWidget/index.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'

interface WhatsAppWidgetProps {
  phoneNumber?: string
  message?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  size?: 'small' | 'medium' | 'large'
  showPopup?: boolean
  companyName?: string
  description?: string
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber = '917014534242',
  message = 'Hello! I would like to inquire about your vintage art collection.',
  position = 'bottom-right',
  size = 'medium',
  showPopup = true,
  companyName = 'Vintage Art & Decor',
  description = 'Typically replies within minutes',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)

  // Show widget after page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      // Show welcome popup after widget appears
      if (showPopup) {
        setTimeout(() => setShowWelcomePopup(true), 1000)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [showPopup])

  // Auto hide welcome popup after 10 seconds
  useEffect(() => {
    if (showWelcomePopup) {
      const timer = setTimeout(() => setShowWelcomePopup(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [showWelcomePopup])

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setShowWelcomePopup(false)
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-12 h-12'
      case 'large':
        return 'w-16 h-16'
      default:
        return 'w-14 h-14'
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'top-left':
        return 'top-4 left-4'
      default:
        return 'bottom-4 right-4'
    }
  }

  const getPopupPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-20 left-4'
      case 'top-right':
        return 'top-20 right-4'
      case 'top-left':
        return 'top-20 left-4'
      default:
        return 'bottom-20 right-4'
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div
          className={`fixed ${getPopupPositionClasses()} z-50 max-w-sm animate-in slide-in-from-bottom-2 duration-300`}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 relative">
            <button
              onClick={() => setShowWelcomePopup(false)}
              className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{companyName}</h4>
                <p className="text-xs text-gray-600 mb-2">{description}</p>
                <p className="text-xs text-gray-800">Hello! How can we help you today?</p>
              </div>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Start Chat
            </button>

            {/* Small triangle pointer */}
            <div
              className={`absolute ${position.includes('right') ? '-bottom-2 right-8' : '-bottom-2 left-8'} w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white`}
            />
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className={`fixed ${getPositionClasses()} ${getSizeClasses()} bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 group animate-in zoom-in-50 duration-500`}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-1/2 h-1/2 mx-auto" />

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />

        {/* Hover tooltip */}
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap">
            Chat with us
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
          </div>
        </div>
      </button>
    </>
  )
}
