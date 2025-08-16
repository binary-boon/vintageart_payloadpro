// src/components/Auth/UserMenu.tsx
'use client'
import React from 'react'
import { useAuth } from '@/providers/Auth'

export const UserMenu: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
  }

  if (!isAuthenticated) {
    return (
      <div className="flex space-x-4">
        <a href="/login" className="text-gray-700 hover:text-gray-900">
          Login
        </a>
        <a href="/register" className="text-gray-700 hover:text-gray-900">
          Register
        </a>
      </div>
    )
  }

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
        <span>Hello, {user?.firstName || user?.email}</span>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="py-1">
          <a href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            My Account
          </a>
          <a href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            My Orders
          </a>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
