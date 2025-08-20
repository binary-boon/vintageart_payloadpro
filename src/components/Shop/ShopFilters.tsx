// src/components/Shop/ShopFilters.tsx - UPDATED WITHOUT PRICING
'use client'

import React, { useState } from 'react'
import { Category } from '@/payload-types'
import { X, ChevronDown, ChevronUp } from 'lucide-react'

interface ShopFiltersProps {
  filters: {
    category?: string
    featured?: boolean
    tags?: string[]
  }
  onFiltersChange: (filters: any) => void
  categories: Category[]
  availableTags: string[]
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export const ShopFilters: React.FC<ShopFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  availableTags,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    availability: true,
    tags: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag]

    onFiltersChange({ tags: newTags.length > 0 ? newTags : undefined })
  }

  const FilterSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string
    sectionKey: keyof typeof expandedSections
    children: React.ReactNode
  }) => (
    <div className="border-b border-gray-200 pb-6">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-4"
      >
        {title}
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expandedSections[sectionKey] && children}
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <FilterSection title="Category" sectionKey="category">
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={() => onFiltersChange({ category: undefined })}
                className="mr-3 text-blue-600"
              />
              <span className="text-sm text-gray-700">All Categories</span>
            </label>
            {categories.map((category) => (
              <label key={category.id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={filters.category === category.id}
                  onChange={() => onFiltersChange({ category: category.id })}
                  className="mr-3 text-blue-600"
                />
                <span className="text-sm text-gray-700">{category.title}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Availability Filter */}
        <FilterSection title="Featured" sectionKey="availability">
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.featured || false}
                onChange={(e) => onFiltersChange({ featured: e.target.checked || undefined })}
                className="mr-3 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Featured Artworks</span>
            </label>
          </div>
        </FilterSection>

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <FilterSection title="Tags" sectionKey="tags">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableTags.map((tag) => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.tags?.includes(tag) || false}
                    onChange={() => handleTagToggle(tag)}
                    className="mr-3 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">{tag}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {categories.find((c) => c.id === filters.category)?.title}
                  <button
                    onClick={() => onFiltersChange({ category: undefined })}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.featured && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Featured
                  <button
                    onClick={() => onFiltersChange({ featured: undefined })}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quote Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">🎨 Custom Thikri Artwork</h4>
          <p className="text-xs text-blue-700">
            All our pieces are handcrafted to order. Select items and request a personalized quote
            based on your requirements.
          </p>
        </div>
      </div>
    </div>
  )
}
