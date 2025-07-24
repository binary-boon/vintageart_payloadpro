// src/components/Shop/ShopSearch.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface ShopSearchProps {
  value: string
  onChange: (search: string) => void
  placeholder?: string
}

export const ShopSearch: React.FC<ShopSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search products...',
}) => {
  const [localValue, setLocalValue] = useState(value)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue, onChange, value])

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
