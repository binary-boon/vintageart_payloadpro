// src/Header/Nav/index.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-mobile-menu]') && !target.closest('[data-menu-trigger]')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('click', handleClickOutside)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-3 items-center">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" />
        })}

        {/* Search Icon
        <Link
          href="/search"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 h-5 text-primary" />
        </Link> */}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-2">
        {/* Mobile Search Icon */}
        {/* <Link
          href="/search"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 h-5 text-primary" />
        </Link> */}

        {/* Hamburger Menu Button */}
        <button
          data-menu-trigger
          onClick={toggleMobileMenu}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-primary" />
          ) : (
            <Menu className="w-6 h-6 text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

          {/* Menu Panel */}
          <div
            data-mobile-menu
            className="fixed right-0 top-0 h-full w-64 bg-background border-l shadow-xl transform transition-transform duration-300 ease-in-out"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="p-4">
              <ul className="space-y-4">
                {navItems.map(({ link }, i) => (
                  <li key={i}>
                    <div onClick={closeMobileMenu}>
                      <CMSLink
                        {...link}
                        appearance="link"
                        className="block py-2 text-lg hover:text-primary transition-colors"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay Alternative (Full Screen) - Uncomment if you prefer full screen menu */}
      {/*
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-background">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6 text-primary" />
            </button>
          </div>
          
          <nav className="p-6">
            <ul className="space-y-6">
              {navItems.map(({ link }, i) => (
                <li key={i}>
                  <div onClick={closeMobileMenu}>
                    <CMSLink 
                      {...link} 
                      appearance="link" 
                      className="block text-2xl font-medium hover:text-primary transition-colors"
                    />
                  </div>
                </li>
              ))}
              <li className="pt-4 border-t">
                <Link 
                  href="/search" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-xl font-medium hover:text-primary transition-colors"
                >
                  <SearchIcon className="w-6 h-6" />
                  Search
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
      */}
    </>
  )
}
