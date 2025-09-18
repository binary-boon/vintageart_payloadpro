// src/components/Logo/Logo.tsx
import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <img
      alt="Vintage Art Decor Logo"
      width={250}
      height={60}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx(
        // Base mobile styles
        'h-8 w-auto',
        // Small mobile (sm: 640px)
        'sm:h-10',
        // Medium and up (md: 768px)
        'md:h-12 md:max-w-[200px]',
        // Large and up (lg: 1024px)
        'lg:h-[60px] lg:max-w-[250px]',
        // Ensure visibility
        'object-contain',
        // Additional classes
        className,
      )}
      src="/Vintage_Art_Decor.png"
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  )
}
